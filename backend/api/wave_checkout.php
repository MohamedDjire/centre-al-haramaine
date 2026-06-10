<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/frais.php';
require_once __DIR__ . '/../config/wave_client.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

if (!chmc_wave_is_configured()) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'message' => 'Paiement Wave non configuré sur le serveur. Contactez l\'administration.',
        'code' => 'wave_not_configured',
    ]);
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
$stmt = $conn->prepare(
    "SELECT id, nom, prenom, niveau, whatsapp, telephone, statut, wave_client_ref, wave_checkout_id
     FROM `{$tInsc}` WHERE id = ? LIMIT 1"
);
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
    echo json_encode(['ok' => true, 'already_paid' => true, 'message' => 'Inscription déjà validée']);
    exit;
}

$montant = chmc_versements_niveau((string) $row['niveau'])[0];
$amountStr = chmc_wave_amount_string($montant);
$clientRef = (string) ($row['wave_client_ref'] ?: ('chmc-insc-' . $inscriptionId));

$base = chmc_site_base_url();
$successUrl = $base . '/inscription/paiement?s=success&id=' . $inscriptionId;
$errorUrl = $base . '/inscription/paiement?s=error&id=' . $inscriptionId;

$phone = chmc_phone_to_e164((string) ($row['whatsapp'] ?: $row['telephone']));
$waveResult = chmc_wave_create_checkout($amountStr, $clientRef, $successUrl, $errorUrl, $phone);

if (!$waveResult['ok'] || empty($waveResult['data']['wave_launch_url'])) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'message' => $waveResult['error'] ?? 'Impossible de créer la session Wave',
    ]);
    exit;
}

$session = $waveResult['data'];
$checkoutId = (string) ($session['id'] ?? '');

$upd = $conn->prepare(
    "UPDATE `{$tInsc}` SET wave_checkout_id = ?, wave_client_ref = ? WHERE id = ?"
);
$upd->bind_param('ssi', $checkoutId, $clientRef, $inscriptionId);
$upd->execute();
$upd->close();

echo json_encode([
    'ok' => true,
    'wave_launch_url' => $session['wave_launch_url'],
    'checkout_id' => $checkoutId,
    'amount' => $montant,
    'inscription_id' => $inscriptionId,
]);
