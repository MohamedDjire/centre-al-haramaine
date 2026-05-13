# API PHP — `backend/api/`

Toutes les URLs ci-dessous sont relatives au dossier **`/backend/api/`** sur votre domaine  
(ex. `https://www.damastudio.org/backend/api/health.php`).

| Fichier | Méthode | Rôle |
|---------|---------|------|
| `health.php` | GET | Vérification déploiement + liste des endpoints |
| `inscription.php` | POST | Inscription (champs formulaire + 3 fichiers multipart) |
| `inscriptions.php` | GET | Liste des inscriptions (**Authorization: Bearer**) |
| `inscription_update.php` | POST | Mise à jour JSON (**Bearer**) |
| `inscription_delete.php` | POST | Suppression JSON `{ "id": n }` (**Bearer**) |
| `download.php` | GET | `?id=n&type=acte|bulletin|photo` (**Bearer**) |
| `login.php` | POST | JSON `{ "username", "password" }` → jeton |
| `logout.php` | POST | Révoque le jeton (**Bearer**) |
| `session.php` | GET | Indique si le jeton est valide (**Bearer**) |

## Configuration

- Connexion MySQL et préfixe des tables : **`backend/config/local.php`** (voir `local.php.example`).
- CORS : si `cors_allowed_origins` est renseigné dans `local.php`, seules ces origines reçoivent `Access-Control-Allow-Origin` reflété ; sinon `*`.

## Chargement commun

Les scripts JSON incluent **`config/bootstrap_api.php`** (CORS + base + préfixe `chmc_tbl()`).  
`download.php` utilise **`cors_lib.php`** seul pour ne pas envoyer `Content-Type: application/json` avant le fichier binaire.
