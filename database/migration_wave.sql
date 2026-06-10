-- Migration paiement Wave API — à exécuter dans phpMyAdmin sur votre base
ALTER TABLE chmc_inscriptions ADD COLUMN statut VARCHAR(30) DEFAULT 'validee';
ALTER TABLE chmc_inscriptions ADD COLUMN wave_checkout_id VARCHAR(64) NULL;
ALTER TABLE chmc_inscriptions ADD COLUMN wave_client_ref VARCHAR(64) NULL;
