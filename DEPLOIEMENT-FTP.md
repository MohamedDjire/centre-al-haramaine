# Déploiement — FTP Dama Studio (`ftp.damastudio.org`)

Ce document décrit comment publier le site sur le serveur FTP indiqué pour le projet **Centre Al Haramaine**.  
Les **mots de passe ne sont pas stockés** dans le dépôt Git : gardez-les uniquement dans votre client FTP et dans `backend/config/local.php` sur le serveur.

## 1. Informations de connexion FTP

| Paramètre   | Valeur |
|------------|--------|
| Hôte       | `ftp.damastudio.org` |
| Utilisateur | celui fourni par l’hébergeur (ex. identifiant panel) |
| Mot de passe | celui fourni par l’hébergeur |
| Port       | `21` (FTP) — ou `22` si SFTP uniquement (selon panel) |

Connexion typique avec **FileZilla** : Fichier > Gestionnaire de sites > Nouveau site > Protocole FTP ou SFTP selon ce que le panel indique.

## 2. Arborescence côté serveur (à confirmer dans le panel)

Souvent le site public est dans un dossier du type :

- `public_html/`  
- ou `www/`  
- ou un sous-dossier du domaine (ex. `public_html/centre-al-haramaine/`)

À adapter selon ce que vous voyez après connexion FTP.

### Recommandation

```
public_html/
├── backend/          ← dossier backend du projet (api, config, uploads, auth)
└── (fichiers du build React)
    index.html
    assets/
    ...
```

Deux options :

**A — Site à la racine du domaine**  
- Uploader le contenu de `frontend-vite/dist/` à la racine de `public_html`.  
- Uploader le dossier `backend/` à côté : `public_html/backend/`.

**B — Site dans un sous-dossier** (ex. `/centre/`)  
- Mettre `dist/` dans `public_html/centre/`.  
- Mettre `backend/` dans `public_html/centre/backend/`.

Dans les deux cas, l’URL de l’API pour le frontend sera du type :

`https://votredomaine.tld/backend/api`  
ou  
`https://votredomaine.tld/centre/backend/api`

Mettre cette URL **sans slash final** dans `frontend-vite/.env` (variable `VITE_API_URL`) puis refaire `npm run build` avant upload.

## 3. Étapes concrètes

1. **Build du frontend** (sur votre PC) :
   ```bash
   cd frontend-vite
   copy .env.example .env
   ```
   Éditer `.env` : `VITE_API_URL=https://.../backend/api` (URL réelle après déploiement).  
   Puis :
   ```bash
   npm run build
   ```
2. **Uploader** tout le contenu de `frontend-vite/dist/` vers le dossier web choisi.
3. **Uploader** le dossier `backend/` complet (y compris `api`, `config`, `auth`, `uploads`).
4. Sur le serveur, créer **`backend/config/local.php`** (copie de `local.php.example`) avec les **identifiants MySQL** du panel (hôte souvent du type `mysql…` ou `localhost` selon l’hébergeur), **sans** commiter ce fichier.
5. Droits : le dossier **`backend/uploads/`** doit être **inscriptible** par le serveur web (chmod 755 ou 775 selon hébergeur).
6. **Importer** `database/schema.sql` dans **la base MySQL déjà créée** (phpMyAdmin : sélectionner la base, puis importer).

## 4. MySQL

L’hôte, l’utilisateur et le nom de la base sont dans le **panel d’hébergement** (souvent différents de l’FTP).  
Les renseigner dans `backend/config/local.php` uniquement.

## 5. Vérifier l’API après upload

Ouvrir dans le navigateur (en HTTPS si le site est en HTTPS) :

`https://VOTRE-DOMAINE/backend/api/health.php`

La réponse JSON doit contenir `"ok": true` et la liste des endpoints.  
Détails : voir **`backend/api/README.md`**.

## 6. Sécurité

- Ne **commitez jamais** `local.php`, mots de passe FTP ou MySQL.  
- Comme des identifiants peuvent avoir été partagés par message, **changez le mot de passe FTP** (et MySQL si besoin) dans le panel si vous suspectez une fuite.
