import pool from './db';

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      topics TEXT[] NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      examples TEXT,
      pseudocode TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_questions_topics ON questions USING GIN (topics);
    CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions USING btree (difficulty);
  `);

  console.log('Database initialized');
}
