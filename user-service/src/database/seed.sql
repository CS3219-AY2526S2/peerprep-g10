-- Seed default admin account
-- Email: admin@peerprep.com | Password: Admin123!
INSERT INTO users (username, email, password, access_role, is_verified, profile_icon)
VALUES ('admin', 'admin@peerprep.com', '$2b$12$EHlYq5Abh2fTzPMmLBP1m.WfNY5Uat6MJ1/JqZ3yytnkM/g4z.WDi', 'admin', TRUE, 'https://storage.googleapis.com/peerprep/avatars/default.png')
ON CONFLICT (email) DO NOTHING;

-- To be deleted
INSERT INTO users (username, email, password, access_role, is_verified, is_banned, profile_icon)
VALUES 
('testing', 'testing@gmail.com', '$2a$12$T1NZ0bJTMtYTKtkNIDG8Q.gvTucnTR6wXkB2H8VY/PpAyvr226y52', 'user', TRUE, FALSE, 'https://storage.googleapis.com/peerprep/avatars/nakamoto.png'),
('flippy', 'flippy@gmail.com', '$2a$12$EPThXnaEi4NBKhJ0LJ14W.Yi6NNVSUaKyvhrIWUdlUU/.YdmJwpHC', 'user', TRUE, TRUE, 'https://storage.googleapis.com/peerprep/avatars/horatius.png'),
('pro', 'pro@gmail.com', '$2a$12$ax948EjCxxUbq7ZPiOogvOrI/nPFC2JrT6Y4EqDPN0cAiIhXC/L66', 'user', TRUE, FALSE, 'https://storage.googleapis.com/peerprep/avatars/doge-lavrinovich.png'),
('hello', 'hello@gmail.com', '$2a$12$ub5zz0LfmEkwPLjWZpmQP.1lbEbsAHAWOFAatcFmYX147CYZx/qF.', 'user', TRUE, TRUE, 'https://storage.googleapis.com/peerprep/avatars/zen.png'),
('qwerty', 'qwerty@gmail.com', '$2a$12$A6mjWepMq.hI.KrN5MACQuIpa3aYG9VAczXm5V5JoiTjETmNfO4mm', 'user', TRUE, FALSE, 'https://storage.googleapis.com/peerprep/avatars/argo.png')
ON CONFLICT (email) DO NOTHING;