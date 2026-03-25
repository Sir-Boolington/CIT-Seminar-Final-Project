const pool = require('./db');
const fs = require('fs');
const path = require('path');

const runSchema = async () => {
  try {
    // Path to your schema.sql file
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log("Running database schema...");
    await pool.query(sql);
    console.log("✓ Schema applied successfully!");
    
    process.exit(0);
  } catch (err) {
    console.error("X Error applying schema:", err.message);
    process.exit(1);
  }
};

runSchema();