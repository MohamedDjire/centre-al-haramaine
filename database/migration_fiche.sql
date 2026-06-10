-- Fiche d'inscription imprimable (token d'accès sécurisé)
-- Si erreur "Duplicate column", la colonne existe déjà.
ALTER TABLE chmc_inscriptions ADD COLUMN fiche_token VARCHAR(64) NULL AFTER wave_client_ref;
