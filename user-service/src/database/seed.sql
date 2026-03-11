-- Seed default admin account
-- Email: admin@peerprep.com | Password: Admin123!
INSERT INTO users (username, email, password, access_role, is_verified)
VALUES ('admin', 'admin@peerprep.com', '$2b$12$EHlYq5Abh2fTzPMmLBP1m.WfNY5Uat6MJ1/JqZ3yytnkM/g4z.WDi', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;
