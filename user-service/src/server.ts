import app from './app';
import pool from './config/db'; // Your Postgres connection
import { connectAuthRedis } from './config/authRedis';
import { seedAdminIfNotExists } from './database/seedAdmin';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3004;

async function startServer() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL on port 5432');

    // Seed the default admin account if it doesn't already exist
    await seedAdminIfNotExists(pool);

    // Connect to auth-redis for ban blacklist and Pub/Sub publishing
    await connectAuthRedis();

    app.listen(port, () => {
      console.log(`[server]: User Service is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start User Service:', err);
    process.exit(1);
  }
}

startServer();
