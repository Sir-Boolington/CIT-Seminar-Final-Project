const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate } = require('../middleware/auth');

console.log('API Key starts with:', process.env.CLAUDE_API_KEY?.substring(0, 15));
// ————————————————————————————————————————————
// DIFFICULTY SETTINGS
// ————————————————————————————————————————————
const DIFFICULTY_CONFIG = {
    easy: { hints_allowed: 3, time_limit: null, score_multiplier: 1.0 },
    medium: { hints_allowed: 1, time_limit: 90, score_multiplier: 1.5 },
    hard: { hints_allowed: 0, time_limit: 45, score_multiplier: 2.5 }
};


// ————————————————————————————————————————————
// 1. START GAUNTLET SESSION
// POST /api/gauntlet/start
// Body: { difficulty: "easy" | "medium" | "hard" }
// ————————————————————————————————————————————
router.post('/start', authenticate, async (req, res) => {
    const { difficulty } = req.body;
    const user_id = req.user.user_id;

    // Validate difficulty
    if (!difficulty || !DIFFICULTY_CONFIG[difficulty]) {
        return res.status(400).json({ error: 'Invalid difficulty. Must be easy, medium, or hard.' });
    }

    try {
        // Pull all active gauntlet scenarios at or below the selected difficulty
        const difficultyPool = {
            easy: ['easy'],
            medium: ['easy', 'medium'],
            hard: ['easy', 'medium', 'hard']
        };

        const scenarioResult = await pool.query(
            `SELECT scenario_id, title, type, difficulty, 
                    content_json->'scenario_content' AS scenario_content
             FROM scenarios
             WHERE mode_type = 'gauntlet'
               AND is_active = true
               AND difficulty = ANY($1)
             ORDER BY RANDOM()`,
            [difficultyPool[difficulty]]
        );

        if (scenarioResult.rows.length === 0) {
            return res.status(404).json({ error: 'No scenarios available for this difficulty.' });
        }

        // Create the session
        const sessionResult = await pool.query(
            `INSERT INTO sessions (user_id, mode_type, difficulty, total_scenarios)
             VALUES ($1, 'gauntlet', $2, $3)
             RETURNING session_id`,
            [user_id, difficulty, scenarioResult.rows.length]
        );

        const session_id = sessionResult.rows[0].session_id;

        // Build the scenario list for the client (no rubrics, no hints in this response)
        const scenarios = scenarioResult.rows.map((row, index) => ({
            scenario_id: row.scenario_id,
            title: row.title,
            type: row.type,
            difficulty: row.difficulty,
            scenario_content: row.scenario_content,
            order: index + 1
        }));

        res.json({
            message: 'Gauntlet session started',
            session_id,
            difficulty,
            settings: DIFFICULTY_CONFIG[difficulty],
            total_scenarios: scenarios.length,
            scenarios
        });

    } catch (err) {
        console.error('Start gauntlet error:', err);
        res.status(500).json({ error: 'Failed to start gauntlet session.' });
    }
});


// ————————————————————————————————————————————
// 2. GET HINT
// POST /api/gauntlet/hint
// Body: { session_id, scenario_id, hints_used_so_far }
// ————————————————————————————————————————————
router.post('/hint', authenticate, async (req, res) => {
    const { session_id, scenario_id, hints_used_so_far } = req.body;

    if (!session_id || !scenario_id || hints_used_so_far === undefined) {
        return res.status(400).json({ error: 'session_id, scenario_id, and hints_used_so_far are required.' });
    }

    try {
        // Get the session difficulty
        const sessionResult = await pool.query(
            `SELECT difficulty FROM sessions WHERE session_id = $1 AND user_id = $2`,
            [session_id, req.user.user_id]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found.' });
        }

        const difficulty = sessionResult.rows[0].difficulty;
        const hints_allowed = DIFFICULTY_CONFIG[difficulty].hints_allowed;

        // Check if user has hints remaining
        if (hints_used_so_far >= hints_allowed) {
            return res.json({
                hint_available: false,
                message: `No hints remaining. ${difficulty} difficulty allows ${hints_allowed} hint(s).`
            });
        }

        // Pull the hint from the scenario content_json
        const scenarioResult = await pool.query(
            `SELECT content_json->'hints' AS hints
             FROM scenarios
             WHERE scenario_id = $1`,
            [scenario_id]
        );

        if (scenarioResult.rows.length === 0) {
            return res.status(404).json({ error: 'Scenario not found.' });
        }

        const hints = scenarioResult.rows[0].hints;

        // Get the next hint based on how many have been used
        if (!hints || hints_used_so_far >= hints.length) {
            return res.json({
                hint_available: false,
                message: 'No more hints available for this scenario.'
            });
        }

        const nextHint = hints[hints_used_so_far];

        res.json({
            hint_available: true,
            hint: nextHint,
            hints_used: hints_used_so_far + 1,
            hints_remaining: hints_allowed - (hints_used_so_far + 1)
        });

    } catch (err) {
        console.error('Get hint error:', err);
        res.status(500).json({ error: 'Failed to retrieve hint.' });
    }
});


// ————————————————————————————————————————————
// 3. SUBMIT ANSWER (with Claude API evaluation)
// POST /api/gauntlet/submit
// Body: { session_id, scenario_id, user_answer, hints_used, time_taken_sec }
// ————————————————————————————————————————————
router.post('/submit', authenticate, async (req, res) => {
    const { session_id, scenario_id, user_answer, hints_used, time_taken_sec } = req.body;

    // Validate required fields
    if (!session_id || !scenario_id || !user_answer) {
        return res.status(400).json({ error: 'session_id, scenario_id, and user_answer are required.' });
    }

    if (!user_answer.trim()) {
        return res.status(400).json({ error: 'Answer cannot be empty.' });
    }

    try {
        // Verify the session belongs to this user and get difficulty
        const sessionResult = await pool.query(
            `SELECT difficulty FROM sessions WHERE session_id = $1 AND user_id = $2`,
            [session_id, req.user.user_id]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found.' });
        }

        const difficulty = sessionResult.rows[0].difficulty;

        // Pull the full scenario including rubric for evaluation
        const scenarioResult = await pool.query(
            `SELECT title, type, content_json
             FROM scenarios
             WHERE scenario_id = $1`,
            [scenario_id]
        );

        if (scenarioResult.rows.length === 0) {
            return res.status(404).json({ error: 'Scenario not found.' });
        }

        const scenario = scenarioResult.rows[0];
        const content = scenario.content_json;
        const rubric = content.rubric;
        const scenarioContent = content.scenario_content;

        // ——— Call the Claude API for evaluation ———
        const evaluationPrompt = `You are a cybersecurity training evaluator. A user has been presented with a security scenario and asked what they would do and why.

SCENARIO TYPE: ${scenario.type}
DIFFICULTY: ${difficulty}
SCENARIO CONTENT: ${JSON.stringify(scenarioContent)}

EVALUATION RUBRIC:
- Key actions the user should recommend: ${JSON.stringify(rubric.key_actions)}
- Red flags the user should identify: ${JSON.stringify(rubric.red_flags_to_identify)}
- Ideal response summary: ${rubric.ideal_response_summary}
- Partial credit criteria: ${rubric.partial_credit_criteria}

USER'S RESPONSE:
"${user_answer}"

Evaluate the user's response and return ONLY a JSON object with no additional text:
{
  "score": <0-100>,
  "feedback": "<2-4 sentences explaining what they got right, what they missed, and what the best practice would be>",
  "red_flags_caught": [<list of red flags from the rubric that the user identified>],
  "red_flags_missed": [<list of red flags from the rubric that the user did not identify>],
  "key_actions_taken": [<list of recommended actions the user mentioned>],
  "key_actions_missed": [<list of recommended actions the user did not mention>]
}

Score generously for easy difficulty, moderately for medium, and strictly for hard. Award partial credit per the rubric criteria.`;

        // ——— Call the Claude API for evaluation (with retry) ———
        let claudeResponse;
        let retryAttempts = 0;
        const maxRetries = 3;

        while (retryAttempts < maxRetries) {
            claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.CLAUDE_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1024,
                    messages: [
                        { role: 'user', content: evaluationPrompt }
                    ]
                })
            });

            if (claudeResponse.status === 529 && retryAttempts < maxRetries - 1) {
                retryAttempts++;
                console.log(`Claude API overloaded, retrying (${retryAttempts}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * retryAttempts));
                continue;
            }
            break;
        }

        if (!claudeResponse.ok) {
            const errorBody = await claudeResponse.text();
            console.error('Claude API error:', claudeResponse.status, errorBody);
            return res.status(502).json({ error: 'Failed to evaluate answer. Please try again.' });
        }

        const claudeData = await claudeResponse.json();
        const rawText = claudeData.content[0].text;

        // Parse the JSON response from Claude (strip markdown fences if present)
        let evaluation;
        try {
            const cleaned = rawText.replace(/```json|```/g, '').trim();
            evaluation = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('Failed to parse Claude evaluation:', rawText);
            return res.status(502).json({ error: 'Failed to parse evaluation response.' });
        }

        // Apply score multiplier based on difficulty
        const multiplier = DIFFICULTY_CONFIG[difficulty].score_multiplier;
        const rawScore = evaluation.score;
        const adjustedScore = Math.round(rawScore * multiplier);

        // Determine result category
        let result;
        if (rawScore >= 70) result = 'correct';
        else if (rawScore >= 40) result = 'partial';
        else result = 'incorrect';

        // Store the attempt
        await pool.query(
            `INSERT INTO attempts
             (session_id, scenario_id, user_answer, result, ai_feedback, score_awarded, hints_used, time_taken_sec)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                session_id,
                scenario_id,
                user_answer,
                result,
                JSON.stringify(evaluation),
                adjustedScore,
                hints_used || 0,
                time_taken_sec || null
            ]
        );

        // Recalculate session score
        const scoreResult = await pool.query(
            `SELECT AVG(score_awarded) AS avg_score
             FROM attempts
             WHERE session_id = $1`,
            [session_id]
        );

        const avgScore = Math.round(scoreResult.rows[0].avg_score || 0);

        await pool.query(
            `UPDATE sessions SET score_percent = $1 WHERE session_id = $2`,
            [avgScore, session_id]
        );

        // Send the evaluation back to the client
        res.json({
            result,
            raw_score: rawScore,
            adjusted_score: adjustedScore,
            multiplier,
            feedback: evaluation.feedback,
            red_flags_caught: evaluation.red_flags_caught,
            red_flags_missed: evaluation.red_flags_missed,
            key_actions_taken: evaluation.key_actions_taken,
            key_actions_missed: evaluation.key_actions_missed,
            session_avg_score: avgScore
        });

    } catch (err) {
        console.error('Submit answer error:', err);
        res.status(500).json({ error: 'Failed to submit answer.' });
    }
});


// ————————————————————————————————————————————
// 4. END GAUNTLET SESSION / GET DEBRIEF
// POST /api/gauntlet/end
// Body: { session_id }
// ————————————————————————————————————————————
router.post('/end', authenticate, async (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: 'session_id is required.' });
    }

    try {
        // Verify session belongs to user
        const sessionResult = await pool.query(
            `SELECT session_id, difficulty, total_scenarios, score_percent, started_at
             FROM sessions
             WHERE session_id = $1 AND user_id = $2 AND mode_type = 'gauntlet'`,
            [session_id, req.user.user_id]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found.' });
        }

        const session = sessionResult.rows[0];

        // Mark session as completed
        await pool.query(
            `UPDATE sessions SET ended_at = NOW() WHERE session_id = $1`,
            [session_id]
        );

        // Pull all attempts for this session with scenario details
        const attemptsResult = await pool.query(
            `SELECT 
                a.attempt_id,
                a.scenario_id,
                s.title,
                s.type,
                s.difficulty AS scenario_difficulty,
                a.user_answer,
                a.result,
                a.ai_feedback,
                a.score_awarded,
                a.hints_used,
                a.time_taken_sec
             FROM attempts a
             JOIN scenarios s ON a.scenario_id = s.scenario_id
             WHERE a.session_id = $1
             ORDER BY a.attempt_id ASC`,
            [session_id]
        );

        // Calculate summary stats
        const attempts = attemptsResult.rows;
        const totalAttempts = attempts.length;
        const correctCount = attempts.filter(a => a.result === 'correct').length;
        const partialCount = attempts.filter(a => a.result === 'partial').length;
        const incorrectCount = attempts.filter(a => a.result === 'incorrect').length;
        const totalHintsUsed = attempts.reduce((sum, a) => sum + (a.hints_used || 0), 0);
        const avgScore = totalAttempts > 0
            ? Math.round(attempts.reduce((sum, a) => sum + a.score_awarded, 0) / totalAttempts)
            : 0;

        res.json({
            message: 'Gauntlet session complete',
            session: {
                session_id: session.session_id,
                difficulty: session.difficulty,
                total_scenarios: session.total_scenarios,
                scenarios_attempted: totalAttempts,
                final_score: avgScore,
                started_at: session.started_at,
                ended_at: new Date().toISOString()
            },
            summary: {
                correct: correctCount,
                partial: partialCount,
                incorrect: incorrectCount,
                total_hints_used: totalHintsUsed
            },
            attempts: attempts.map(a => ({
                scenario_id: a.scenario_id,
                title: a.title,
                type: a.type,
                scenario_difficulty: a.scenario_difficulty,
                user_answer: a.user_answer,
                result: a.result,
                score_awarded: a.score_awarded,
                hints_used: a.hints_used,
                time_taken_sec: a.time_taken_sec,
                feedback: a.ai_feedback
            }))
        });

    } catch (err) {
        console.error('End session error:', err);
        res.status(500).json({ error: 'Failed to end gauntlet session.' });
    }
});

// ————————————————————————————————————————————
// 5. END SESSION VIA BEACON (no auth — tab close)
// POST /api/gauntlet/end-beacon
// Body: { session_id }
// ————————————————————————————————————————————
router.post('/end-beacon', async (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: 'session_id is required.' });
    }

    try {
        await pool.query(
            `UPDATE sessions SET ended_at = NOW() WHERE session_id = $1 AND ended_at IS NULL`,
            [session_id]
        );
        res.json({ message: 'Session ended via beacon.' });
    } catch (err) {
        console.error('Beacon end session error:', err);
        res.status(500).json({ error: 'Failed to end session.' });
    }
});

module.exports = router;
