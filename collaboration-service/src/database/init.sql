CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT,
  title TEXT NOT NULL,
  topics TEXT[],
  difficulty TEXT,
  description TEXT NOT NULL,
  starter_code TEXT NOT NULL,
  current_code TEXT NOT NULL DEFAULT '',
  test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  user1_id TEXT,
  user2_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  partner_id TEXT,
  question_id TEXT NOT NULL,
  code TEXT,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);