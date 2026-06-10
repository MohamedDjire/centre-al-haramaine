<?php

declare(strict_types=1);

// Image d'une actualité : actualites.php?f=actu_xxx.png (fichier déjà déployé sur le serveur)
if (!empty($_GET['f'])) {
    require_once __DIR__ . '/../lib/actu_image_serve.php';
    $w = isset($_GET['w']) ? (int) $_GET['w'] : 0;
    chmc_serve_actu_image((string) $_GET['f'], $w);
}

require_once __DIR__ . '/../config/bootstrap_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

$tbl = chmc_tbl('actualites');

$result = $conn->query("SELECT id, titre, contenu, image, created_at FROM `{$tbl}` WHERE publie = 1 ORDER BY created_at DESC LIMIT 20");

$rows = [];
while ($row = $result->fetch_assoc()) {
    if (!empty($row['image'])) {
        $enc = rawurlencode((string) $row['image']);
        $row['image_thumb_url'] = 'actualites.php?f=' . $enc . '&w=480';
        $row['image_url'] = 'actualites.php?f=' . $enc . '&w=1200';
    }
    $rows[] = $row;
}

echo json_encode(['ok' => true, 'actualites' => $rows]);
