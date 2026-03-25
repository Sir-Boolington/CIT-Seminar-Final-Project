const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // Use the Internal Database URL from your Render dashboard
  connectionString: process.env.DATABASE_URL,
  
  // CRITICAL FIX: This allows the encrypted connection required by Render
  ssl: {
    rejectUnauthorized: false
  }
});

// Log any unexpected errors on idle clients to help with debugging
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;