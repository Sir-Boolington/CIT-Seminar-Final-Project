console.log("Current files:", require('fs').readdirSync(__dirname));
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const pool = require('./config/db');
const sessionRoutes = require('./routes/sessions');
const attemptRoutes = require('./routes/attempts');
const interrogationRoutes = require("./routes/interrogation");

const app = express();
const PORT = process.env.PORT || 10000; // Updated to match Render default

// ——— Middleware ———
app.use(cors({
    origin: [
    'http://localhost:5173',
    'https://threat-ag2drek61-sir-boolingtons-projects.vercel.app',
    'https://threatsim.vercel.app',
    'https://cit-seminar-final-project.vercel.app'
  ],
    credentials: true,
}));
app.use(express.json());

// ——— Routes ———
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/interrogation', interrogationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api/gauntlet', require('./routes/gauntlet'));

// Placeholder routes (uncomment as you build them in April) [cite: 79]
// app.use('/api/chat', require('./routes/chat'));
// app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

// ——— Start Logic (The Heartbeat) ———
async function startServer() {
    try {
        console.log('Connecting to PostgreSQL...');
        // Test query to ensure DB is reachable
        await pool.query('SELECT NOW()'); 
        console.log('✓ Database connected successfully');

        app.listen(PORT, () => {
            console.log(`✓ ThreatSim API running on port ${PORT}`);
        });
    } catch (err) {
        // If DB fails, the server will not start, and Render will show a "Failed" deploy
        console.error('X PostgreSQL connection error:', err.message);
        process.exit(1); 
    }
}

startServer();
