import pg from 'pg';
import { URL } from 'url';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('d:/ZGA/frontend/.env') });

const dbUrl = process.env.DATABASE_URL;
console.log('DATABASE_URL:', dbUrl ? 'Found' : 'Missing');

if (!dbUrl) {
    process.exit(1);
}

const url = new URL(dbUrl);
const config = {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false }
};

const pool = new pg.Pool(config);

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

testConnection();
