<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/frais.php';
require_once __DIR__ . '/../lib/matricule.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$inscriptionId = (int) ($input['inscription_id'] ?? 0);

if ($inscriptionId <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'inscription_id requis']);
    exit;
}

$tInsc = chmc_tbl('inscriptions');
$stmt = $conn->prepare("SELECT id, nom, prenom, date_naissance, niveau, statut FROM `{$tInsc}` WHERE id = ? LIMIT 1");
$stmt->bind_param('i', $inscriptionId);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Inscription introuvable']);
    exit;
}

if (($row['statut'] ?? '') === 'validee') {
    echo json_encode(['ok' => true, 'message' => 'Inscription déjà validée']);
    exit;
}

$niveau = (string) $row['niveau'];
$matricule = chmc_generer_matricule(
    $conn,
    (string) $row['nom'],
    (string) $row['prenom'],
    (string) $row['date_naissance'],
    $inscriptionId
);

$upd = $conn->prepare("UPDATE `{$tInsc}` SET statut = 'validee', matricule = ? WHERE id = ?");
$upd->bind_param('si', $matricule, $inscriptionId);
$upd->execute();
$upd->close();

chmc_init_paiements_inscription($conn, $inscriptionId, $niveau, true);

// Marquer le 1er versement comme à confirmer par l'admin (paiement manuel Wave)
$tPay = chmc_tbl('paiements');
$note = 'Paiement Wave manuel — à confirmer par l\'administration';
$stmtP = $conn->prepare(
    "UPDATE `{$tPay}` SET note = ? WHERE inscription_id = ? AND mois = '1er versement (inscription)'"
);
$stmtP->bind_param('si', $note, $inscriptionId);
$stmtP->execute();
$stmtP->close();

$premierMontant = chmc_versements_niveau($niveau)[0];

echo json_encode([
    'ok' => true,
    'message' => 'Inscription enregistrée. Le centre vérifiera votre paiement Wave sous peu.',
    'matricule' => $matricule,
    'premier_versement' => $premierMontant,
    'mode' => 'manual',
]);
