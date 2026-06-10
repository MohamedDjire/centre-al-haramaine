<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/frais.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

chmc_require_admin_id($conn);

$input = json_decode(file_get_contents('php://input'), true);

$inscriptionId = (int) ($input['inscription_id'] ?? 0);

if ($inscriptionId <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'inscription_id requis']);
    exit;
}

$tInsc = chmc_tbl('inscriptions');
$stmt = $conn->prepare("SELECT niveau FROM `{$tInsc}` WHERE id = ? LIMIT 1");
$stmt->bind_param('i', $inscriptionId);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Inscription introuvable']);
    exit;
}

$niveau = (string) $row['niveau'];
chmc_init_paiements_inscription($conn, $inscriptionId, $niveau, false);

$versements = chmc_versements_niveau($niveau);
echo json_encode([
    'ok' => true,
    'message' => '3 versements initialises pour cet eleve',
    'versements' => $versements,
]);
