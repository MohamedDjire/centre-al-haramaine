-- Compte admin de TEST (à supprimer en production si besoin)
-- Identifiant : test.chmc  |  Mot de passe : TestCHMC2026!
INSERT INTO chmc_admins (username, password_hash)
VALUES (
    'test.chmc',
    '$2y$10$7r8yIec7ibLgFMCPhhEKceT3JZz67X9Sf8fjj9kBrQdlcp.pRMQwu'
)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
