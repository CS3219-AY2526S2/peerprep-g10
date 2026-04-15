// AI Assistance Disclosure:
// Tool: Claude, date: 2026-03-08 (PR #10)
// Scope: Translated the hand-designed schema for the `questions` table
//   (difficulty enum, `TEXT[]` topics column, GIN index for multi-topic
//   filtering) into Postgres DDL.
// Author review: Reviewed for correctness and integrated as-is.

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
      solution TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE questions ADD COLUMN IF NOT EXISTS solution TEXT;

    CREATE INDEX IF NOT EXISTS idx_questions_topics ON questions USING GIN (topics);
    CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions USING btree (difficulty);
  `);

  console.log('Database initialized');
}
