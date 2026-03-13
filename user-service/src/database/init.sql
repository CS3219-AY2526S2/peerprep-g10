CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  access_role VARCHAR(10) DEFAULT 'user' CHECK (access_role IN ('admin', 'user')),
  is_verified BOOLEAN DEFAULT FALSE,
  profile_icon VARCHAR(50) DEFAULT 'default',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);