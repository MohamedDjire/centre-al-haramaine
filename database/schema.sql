-- =============================================================================
-- Centre Al Haramaine — tables MySQL (préfixe chmc_)
-- =============================================================================
--
-- HÉBERGEMENT MUTUALISÉ (LWS, etc.) :
--   Vous n’avez PAS le droit de CREATE DATABASE avec l’utilisateur du site.
--   Dans phpMyAdmin : cliquez d’abord sur VOTRE base (à gauche), puis importez
--   ce fichier (ou copiez-collez le SQL). Ne lancez pas les lignes CREATE DATABASE.
--
-- XAMPP EN LOCAL :
--   Si besoin, créez une base `centre_haramaine` à la main (phpMyAdmin > Nouvelle base),
--   sélectionnez-la, puis exécutez ce script. Voir aussi `schema_xampp.sql` en option.
--
-- Préfixe : chmc_ — doit correspondre à `table_prefix` dans backend/config/local.php
-- =============================================================================

-- Table obligatoire (cahier des charges) + préfixe chmc_
CREATE TABLE IF NOT EXISTS chmc_inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    sexe VARCHAR(20),
    date_naissance DATE,
    niveau VARCHAR(50),
    parent_nom VARCHAR(100),
    telephone VARCHAR(20),
    whatsapp VARCHAR(20),
    adresse TEXT,
    document VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Colonnes supplémentaires pour bulletin et photo (document = acte de naissance)
-- Si erreur "Duplicate column", commentez ces deux lignes (colonnes déjà créées).
ALTER TABLE chmc_inscriptions ADD COLUMN document_bulletin VARCHAR(255) NULL AFTER document;
ALTER TABLE chmc_inscriptions ADD COLUMN document_photo VARCHAR(255) NULL AFTER document_bulletin;

CREATE TABLE IF NOT EXISTS chmc_admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chmc_admin_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token_hash (token_hash),
    CONSTRAINT fk_chmc_admin_tokens_admin FOREIGN KEY (admin_id) REFERENCES chmc_admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compte par défaut : admin / Admin@2026 (à changer après installation)
INSERT IGNORE INTO chmc_admins (username, password_hash)
VALUES (
    'admin',
    '$2y$10$WaZJ0hvZQT/QXlePrZLINursvXvMlBjI7p7MrrGw7horOMh2l1IoO'
);
