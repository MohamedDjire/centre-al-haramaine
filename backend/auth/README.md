# Dossier `auth/`

- `token.php` : validation du jeton Bearer, émission et révocation des jetons (table préfixée, ex. `chmc_admin_tokens`).

Les points d’entrée HTTP exposés au navigateur sont dans `../api/` (`login.php`, `logout.php`, `session.php`, etc.).
