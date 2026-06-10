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

-- Compte par défaut (à changer après installation)
-- Après import SQL, exécutez : php database/fix_admin_password.php
INSERT INTO chmc_admins (username, password_hash)
VALUES (
    'resp.haramaine',
    '$2y$10$rKG9mscs6kZ7q1BjgnR1yO.eaQdJGGJQVUEGyUrC2HOEdHvYhaahC'
)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Paiement Wave (inscription en ligne)
-- Si erreur "Duplicate column", commentez ces lignes.
ALTER TABLE chmc_inscriptions ADD COLUMN statut VARCHAR(30) DEFAULT 'validee' AFTER document_photo;
ALTER TABLE chmc_inscriptions ADD COLUMN wave_checkout_id VARCHAR(64) NULL AFTER statut;
ALTER TABLE chmc_inscriptions ADD COLUMN wave_client_ref VARCHAR(64) NULL AFTER wave_checkout_id;
ALTER TABLE chmc_inscriptions ADD COLUMN fiche_token VARCHAR(64) NULL AFTER wave_client_ref;

-- Colonne matricule (identifiant unique élève, généré automatiquement)
-- Si erreur "Duplicate column", commentez cette ligne.
ALTER TABLE chmc_inscriptions ADD COLUMN matricule VARCHAR(20) NULL AFTER id;
ALTER TABLE chmc_inscriptions ADD UNIQUE INDEX idx_matricule (matricule);

-- Table des paiements (suivi mensuel par élève)
CREATE TABLE IF NOT EXISTS chmc_paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inscription_id INT NOT NULL,
    mois VARCHAR(20) NOT NULL,
    annee_scolaire VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    montant DECIMAL(10,2) NOT NULL DEFAULT 0,
    montant_paye DECIMAL(10,2) NOT NULL DEFAULT 0,
    statut ENUM('non_paye','partiel','paye') DEFAULT 'non_paye',
    date_paiement DATE NULL,
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chmc_paiements_insc FOREIGN KEY (inscription_id) REFERENCES chmc_inscriptions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_paiement_mois (inscription_id, mois, annee_scolaire)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des actualités (l'admin publie, le public consulte)
CREATE TABLE IF NOT EXISTS chmc_actualites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    image VARCHAR(255) NULL,
    publie TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
