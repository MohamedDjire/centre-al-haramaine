<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

chmc_require_admin_id($conn);

$t = chmc_tbl('inscriptions');
$sql = "SELECT id, matricule, nom, prenom, sexe, date_naissance, niveau, parent_nom, telephone, whatsapp, adresse,
               document, document_bulletin, document_photo, statut, fiche_token, created_at
        FROM `{$t}`
        WHERE statut IN ('validee', 'en_attente_validation') OR statut IS NULL
        ORDER BY FIELD(statut, 'en_attente_validation', 'validee'), id DESC";
$result = $conn->query($sql);

$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

echo json_encode(['ok' => true, 'inscriptions' => $rows]);
