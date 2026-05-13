-- Optionnel : XAMPP en root, si vous voulez créer la base automatiquement.
-- Sur LWS / mutualisé : NE PAS exécuter ce fichier, utiliser schema.sql dans votre base existante.

CREATE DATABASE IF NOT EXISTS centre_haramaine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE centre_haramaine;

-- Puis exécuter le contenu de schema.sql (tables), ou importer les deux fichiers dans l’ordre.
