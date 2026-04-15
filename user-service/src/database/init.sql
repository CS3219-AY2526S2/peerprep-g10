CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  access_role VARCHAR(10) DEFAULT 'user' CHECK (access_role IN ('admin', 'user')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  profile_icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to prevent deleting the last admin.
CREATE OR REPLACE FUNCTION prevent_last_admin_delete()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INT;
BEGIN
  IF OLD.access_role = 'admin' THEN
    SELECT COUNT(*) INTO admin_count
    FROM users
    WHERE access_role = 'admin'
    FOR UPDATE;

    IF admin_count <= 1 THEN
      RAISE EXCEPTION 'LAST_ADMIN';
    END IF;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_last_admin
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_last_admin_delete();

-- Email Verification Table
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL DEFAULT 'registration' CHECK (type IN ('registration', 'email_change')),
  new_email TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);