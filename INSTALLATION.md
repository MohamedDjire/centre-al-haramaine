# Centre Al Haramaine — Installation (XAMPP + Vite + MySQL)

Pour publier sur le serveur FTP **Dama Studio** (`ftp.damastudio.org`), voir **`DEPLOIEMENT-FTP.md`** (sans y mettre de mots de passe).

## 1. Prérequis

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP)
- [Node.js](https://nodejs.org/) (LTS)

## 2. Base de données

### Mutualisé (LWS, etc.)

L’utilisateur MySQL du site **n’a en général pas le droit** de créer une base (`CREATE DATABASE` → erreur `#1044`).  
La base est **déjà créée** par l’hébergeur (nom indiqué dans le panel, souvent proche de votre identifiant client).

1. Ouvrir **phpMyAdmin** et cliquer sur **votre base** dans la colonne de gauche (pour que le SQL s’exécute dedans).
2. Importer **`database/schema.sql`** (onglet Importer).  
   Ce fichier ne contient plus `CREATE DATABASE` ni `USE` : uniquement les tables `chmc_*`.

### XAMPP en local

1. Créer une base `centre_haramaine` (phpMyAdmin > Nouvelle base), ou exécuter en premier **`database/schema_xampp.sql`** si vous êtes connecté en `root`.
2. Sélectionner la base, puis importer **`database/schema.sql`**.

### Préfixe des tables

Les tables sont créées avec le préfixe **`chmc_`** pour les distinguer dans une base mutualisée :

- `chmc_inscriptions`
- `chmc_admins`
- `chmc_admin_tokens`

Le PHP lit le préfixe dans `backend/config/local.php` (clé `table_prefix`, valeur sans `_` final, par défaut `chmc` dans l’exemple). Elle doit **correspondre** au préfixe utilisé dans `schema.sql`.

Si les colonnes `document_bulletin` et `document_photo` existent déjà, les deux lignes `ALTER TABLE` peuvent échouer : les ignorer dans ce cas.

## 3. Backend PHP

1. Copier tout le dossier du projet (ou au minimum `backend/`) dans le répertoire web Apache, par exemple :

   `C:\xampp\htdocs\Centre_Al_Haramaine\`

   Vous devez obtenir notamment :

   `C:\xampp\htdocs\Centre_Al_Haramaine\backend\api\inscription.php`

2. **Configuration sur le serveur** : copier `backend/config/local.php.example` vers **`backend/config/local.php`** et y mettre l’hôte MySQL, l’utilisateur, le mot de passe et le nom de base fournis par l’hébergeur (panel Dama Studio / phpMyAdmin). Ce fichier est **ignoré par Git** (ne pas le committer).

3. En local sans `local.php`, `database.php` utilise encore `localhost` / `root` / mot de passe vide / base `centre_haramaine` (XAMPP par défaut).

4. Le dossier `backend/uploads/` doit être **accessible en écriture** par Apache (droits Windows sur le dossier).

5. URL type de l’API :

   `http://localhost/Centre_Al_Haramaine/backend/api/inscription.php`

## 4. Frontend React (Vite)

```bash
cd frontend-vite
copy .env.example .env
```

Éditer `.env` et définir `VITE_API_URL` vers le dossier **api** (sans slash final), par exemple :

`VITE_API_URL=http://localhost/Centre_Al_Haramaine/backend/api`

Puis :

```bash
npm install
npm run dev
```

Le site sera sur `http://localhost:5173`.

### Build pour production

```bash
npm run build
```

Vous pouvez déployer le contenu du dossier `dist/` sous Apache (même hôte que l’API simplifie les en-têtes CORS).

## 5. Compte administrateur par défaut

Après import SQL :

- **Utilisateur :** `admin`  
- **Mot de passe :** `Admin@2026`  

À changer immédiatement en production (table **`chmc_admins`**, champ `password_hash` généré avec `password_hash()` en PHP).

## Sécurité (important)

- Ne **jamais** committer `local.php`, mots de passe FTP/MySQL, ni identifiants dans le dépôt.
- Si des identifiants ont été exposés (chat, capture d’écran), **changez-les** sur l’hébergeur (FTP + base MySQL).

## 6. Authentification admin (jeton)

Le tableau de bord utilise un **jeton Bearer** (stocké dans `sessionStorage`) pour éviter les problèmes de cookies entre le port Vite (5173) et Apache (80). Les requêtes admin envoient l’en-tête `Authorization: Bearer …`.

## 7. Ressources graphiques

Copier les logos / fiches dans `frontend-vite/public/assets/` avec les noms :

- `logo-principal.png`
- `logo-cachet.png`
- `fiche-inscription.png`
- `banniere.png`

## 8. Ancien dossier `frontend/` (Create React App)

Une version antérieure peut encore exister sous `frontend/` (CRA). Le cahier des charges actuel utilise **`frontend-vite/`**. Vous pouvez archiver ou supprimer l’ancien dossier une fois la migration validée.
