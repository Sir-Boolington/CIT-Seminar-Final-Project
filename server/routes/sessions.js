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

module.exports = router;
