import pool from './db';

export async function initDb(): Promise<void> {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      topics TEXT[] NOT NULL,
      difficulty difficulty_level NOT NULL,
      examples TEXT,
      pseudocode TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_questions_topics ON questions USING GIN (topics);
    CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions USING btree (difficulty);
  `);

  console.log('Database initialized');
}
