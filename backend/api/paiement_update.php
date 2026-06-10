<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

chmc_require_admin_id($conn);

$input = json_decode(file_get_contents('php://input'), true);

$id = (int) ($input['id'] ?? 0);
$montantPaye = isset($input['montant_paye']) ? (float) $input['montant_paye'] : null;
$statut = $input['statut'] ?? null;
$datePaiement = $input['date_paiement'] ?? null;
$note = $input['note'] ?? null;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID paiement requis']);
    exit;
}

$tPay = chmc_tbl('paiements');

$fields = [];
$types = '';
$values = [];

if ($montantPaye !== null) {
    $fields[] = 'montant_paye = ?';
    $types .= 'd';
    $values[] = $montantPaye;
}
if ($statut !== null && in_array($statut, ['non_paye', 'partiel', 'paye'])) {
    $fields[] = 'statut = ?';
    $types .= 's';
    $values[] = $statut;
}
if ($datePaiement !== null) {
    $fields[] = 'date_paiement = ?';
    $types .= 's';
    $values[] = $datePaiement ?: null;
}
if ($note !== null) {
    $fields[] = 'note = ?';
    $types .= 's';
    $values[] = $note;
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Aucun champ a mettre a jour']);
    exit;
}

$types .= 'i';
$values[] = $id;

$sql = "UPDATE `{$tPay}` SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$values);

if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'message' => 'Paiement mis a jour']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Erreur mise a jour']);
}
$stmt->close();
