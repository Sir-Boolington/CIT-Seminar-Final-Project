const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware (reuse JWT auth if applicable)
const { authenticate } = require('../middleware/auth');
// ------START SESSION-------

router.post('/start', authenticate, async (req, res) => {
    const { mode_type, difficulty } = req.body;
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(
            `INSERT INTO sessions (user_id, mode_type, difficulty)
             VALUES ($1, $2, $3)
             RETURNING session_id`,
            [user_id, mode_type, difficulty]
        );

        res.json({
            message: 'Session started',
            session_id: result.rows[0].session_id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// ------SESSION HISTORY-------

router.get('/history', authenticate, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        // Get all sessions for this user
        const sessionsResult = await pool.query(
            `SELECT 
                session_id, mode_type, difficulty, score_percent, 
                total_scenarios, outcome_verdict, is_correct,
                started_at, ended_at
             FROM sessions
             WHERE user_id = $1
             ORDER BY started_at DESC`,
            [user_id]
        );

        // Get aggregate stats
        const statsResult = await pool.query(
            `SELECT 
                COUNT(*) AS total_sessions,
                COUNT(CASE WHEN ended_at IS NOT NULL THEN 1 END) AS completed_sessions,
                ROUND(AVG(CASE WHEN ended_at IS NOT NULL THEN score_percent END)) AS avg_score
             FROM sessions
             WHERE user_id = $1`,
            [user_id]
        );

        // Get per-session attempt counts
        const attemptStatsResult = await pool.query(
            `SELECT 
                a.session_id,
                COUNT(*) AS total_attempts,
                COUNT(CASE WHEN a.result = 'correct' THEN 1 END) AS correct_count,
                COUNT(CASE WHEN a.result = 'partial' THEN 1 END) AS partial_count,
                COUNT(CASE WHEN a.result = 'incorrect' THEN 1 END) AS incorrect_count
             FROM attempts a
             JOIN sessions s ON a.session_id = s.session_id
             WHERE s.user_id = $1
             GROUP BY a.session_id`,
            [user_id]
        );

        // Build a lookup map for attempt stats
        const attemptStatsMap = {};
        attemptStatsResult.rows.forEach(row => {
            attemptStatsMap[row.session_id] = {
                total_attempts: parseInt(row.total_attempts),
                correct: parseInt(row.correct_count),
                partial: parseInt(row.partial_count),
                incorrect: parseInt(row.incorrect_count)
            };
        });

        // Combine sessions with their attempt stats
        const sessions = sessionsResult.rows.map(session => ({
            ...session,
            attempts: attemptStatsMap[session.session_id] || {
                total_attempts: 0, correct: 0, partial: 0, incorrect: 0
            }
        }));

        // Get overall accuracy across all attempts
        const accuracyResult = await pool.query(
            `SELECT 
                COUNT(*) AS total_attempts,
                COUNT(CASE WHEN a.result = 'correct' THEN 1 END) AS correct_attempts
             FROM attempts a
             JOIN sessions s ON a.session_id = s.session_id
             WHERE s.user_id = $1`,
            [user_id]
        );

        const totalAttempts = parseInt(accuracyResult.rows[0].total_attempts) || 0;
        const correctAttempts = parseInt(accuracyResult.rows[0].correct_attempts) || 0;
        const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

        // Get streak from users table
        const streakResult = await pool.query(
            `SELECT current_streak, longest_streak FROM users WHERE user_id = $1`,
            [user_id]
        );

        res.json({
            stats: {
                total_sessions: parseInt(statsResult.rows[0].total_sessions) || 0,
                completed_sessions: parseInt(statsResult.rows[0].completed_sessions) || 0,
                avg_score: parseInt(statsResult.rows[0].avg_score) || 0,
                accuracy,
                current_streak: streakResult.rows[0]?.current_streak || 0,
                longest_streak: streakResult.rows[0]?.longest_streak || 0
            },
            sessions
        });

    } catch (err) {
        console.error('Session history error:', err);
        res.status(500).json({ error: 'Failed to fetch session history.' });
    }
});

module.exports = router;
