import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;