const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

// ------SUBMIT ATTEMPT------

router.post('/submit', authenticateToken, async (req, res) => {
    const {
        session_id,
        scenario_id,
        user_answer,
        correct_answer
    } = req.body;

    try {
        // Determine result
        const isCorrect = user_answer === correct_answer;
        const result = isCorrect ? 'correct' : 'incorrect';
        const score_awarded = isCorrect ? 100 : 0;

        // Insert attempt
        await pool.query(
            `INSERT INTO attempts
            (session_id, scenario_id, user_answer, correct_answer, result, score_awarded)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [session_id, scenario_id, user_answer, correct_answer, result, score_awarded]
        );

        // Recalculate session score
        const scoreResult = await pool.query(
            `SELECT AVG(score_awarded) AS avg_score
             FROM attempts
             WHERE session_id = $1`,
            [session_id]
        );

        const avgScore = Math.round(scoreResult.rows[0].avg_score || 0);

        // Update session
        await pool.query(
            `UPDATE sessions
             SET score_percent = $1
             WHERE session_id = $2`,
            [avgScore, session_id]
        );

        res.json({
            result,
            score_awarded,
            updated_score: avgScore
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit attempt' });
    }
});

module.exports = router;
