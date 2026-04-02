-- Seed default admin account
-- Email: admin@peerprep.com | Password: Admin123!
INSERT INTO users (username, email, password, access_role, is_verified, profile_icon)
VALUES ('admin', 'admin@peerprep.com', '$2b$12$EHlYq5Abh2fTzPMmLBP1m.WfNY5Uat6MJ1/JqZ3yytnkM/g4z.WDi', 'admin', TRUE, 'https://storage.googleapis.com/peerprep/avatars/default.png')
ON CONFLICT (email) DO NOTHING;