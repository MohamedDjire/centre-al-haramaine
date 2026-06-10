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

$tPay = chmc_tbl('paiements');
$tInsc = chmc_tbl('inscriptions');

$inscriptionId = isset($_GET['inscription_id']) ? (int) $_GET['inscription_id'] : 0;
$anneeScolaire = trim($_GET['annee_scolaire'] ?? '2025-2026');

if ($inscriptionId > 0) {
    $stmt = $conn->prepare(
        "SELECT p.*, i.nom, i.prenom, i.matricule, i.niveau
         FROM `{$tPay}` p
         JOIN `{$tInsc}` i ON i.id = p.inscription_id
         WHERE p.inscription_id = ? AND p.annee_scolaire = ?
         ORDER BY FIELD(p.mois,'1er versement (inscription)','2e versement','3e versement','Octobre','Novembre','Décembre','Janvier','Février','Mars','Avril','Mai','Juin')"
    );
    $stmt->bind_param('is', $inscriptionId, $anneeScolaire);
} else {
    $stmt = $conn->prepare(
        "SELECT p.*, i.nom, i.prenom, i.matricule, i.niveau, i.sexe
         FROM `{$tPay}` p
         JOIN `{$tInsc}` i ON i.id = p.inscription_id
         WHERE p.annee_scolaire = ?
         ORDER BY i.nom, i.prenom, FIELD(p.mois,'1er versement (inscription)','2e versement','3e versement','Octobre','Novembre','Décembre','Janvier','Février','Mars','Avril','Mai','Juin')"
    );
    $stmt->bind_param('s', $anneeScolaire);
}

$stmt->execute();
$result = $stmt->get_result();
$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
$stmt->close();

echo json_encode(['ok' => true, 'paiements' => $rows]);
