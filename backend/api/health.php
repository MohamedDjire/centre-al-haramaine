<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

echo json_encode([
    'ok' => true,
    'service' => 'centre-al-haramaine-api',
    'tables_prefix' => CHMC_TBL_PFX,
    'endpoints' => [
        'POST inscription.php' => 'Inscription + fichiers (multipart)',
        'GET inscriptions.php' => 'Liste (Bearer admin)',
        'POST inscription_update.php' => 'Mise a jour (JSON + Bearer)',
        'POST inscription_delete.php' => 'Suppression (JSON + Bearer)',
        'GET download.php?id=&type=acte|bulletin|photo' => 'Telechargement (Bearer)',
        'POST login.php' => 'Connexion admin (JSON)',
        'POST logout.php' => 'Deconnexion (Bearer)',
        'GET session.php' => 'Jeton valide ? (Bearer)',
    ],
]);
