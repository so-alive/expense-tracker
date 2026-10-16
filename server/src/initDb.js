import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

try {
    await pool.query(sql);
    console.log('Database ready: tables created and test users  added');
}catch (err){
    console.log('Schema failed: ', err.message);
} finally {
    await pool.end();
}