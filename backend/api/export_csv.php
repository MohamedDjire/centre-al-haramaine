<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

if (isset($_GET['token']) && !isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $_SERVER['HTTP_AUTHORIZATION'] = 'Bearer ' . $_GET['token'];
}

chmc_require_admin_id($conn);

$tInsc = chmc_tbl('inscriptions');
$tPay = chmc_tbl('paiements');

$niveau = trim($_GET['niveau'] ?? '');
$sexe = trim($_GET['sexe'] ?? '');
$type = trim($_GET['type'] ?? 'eleves');

$where = [];
$params = [];
$types = '';

if ($niveau !== '') {
    $where[] = 'i.niveau = ?';
    $params[] = $niveau;
    $types .= 's';
}
if ($sexe !== '') {
    $where[] = 'i.sexe = ?';
    $params[] = $sexe;
    $types .= 's';
}

$whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

if ($type === 'paiements') {
    $anneeScolaire = trim($_GET['annee_scolaire'] ?? '2025-2026');
    $sql = "SELECT i.matricule, i.nom, i.prenom, i.sexe, i.niveau, i.telephone,
                   p.mois, p.montant, p.montant_paye, p.statut, p.date_paiement
            FROM `{$tInsc}` i
            LEFT JOIN `{$tPay}` p ON p.inscription_id = i.id AND p.annee_scolaire = ?
            {$whereClause}
            ORDER BY i.niveau, i.nom, i.prenom, FIELD(p.mois,'Octobre','Novembre','Décembre','Janvier','Février','Mars','Avril','Mai','Juin')";
    $allParams = array_merge([$anneeScolaire], $params);
    $allTypes = 's' . $types;
} else {
    $sql = "SELECT i.matricule, i.nom, i.prenom, i.sexe, i.date_naissance, i.niveau,
                   i.parent_nom, i.telephone, i.whatsapp, i.adresse, i.created_at
            FROM `{$tInsc}` i
            {$whereClause}
            ORDER BY i.niveau, i.nom, i.prenom";
    $allParams = $params;
    $allTypes = $types;
}

if (!empty($allParams)) {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($allTypes, ...$allParams);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($sql);
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
if (isset($stmt)) $stmt->close();

$filename = 'liste_' . ($niveau ?: 'tous') . '_' . date('Ymd') . '.csv';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');
fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

if (!empty($rows)) {
    fputcsv($output, array_keys($rows[0]), ';');
    foreach ($rows as $row) {
        fputcsv($output, $row, ';');
    }
}

fclose($output);
