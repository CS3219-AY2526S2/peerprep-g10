import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { initDb } from './init-db';

const PORT = process.env.PORT || 3003;

async function startServer() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`Question Service is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start question server:', err);
  process.exit(1);
});
