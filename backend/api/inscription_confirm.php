<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/frais.php';
require_once __DIR__ . '/../config/wave_client.php';
require_once __DIR__ . '/../lib/matricule.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

$inscriptionId = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);
$checkoutId = trim((string) ($_GET['checkout_id'] ?? $_POST['checkout_id'] ?? ''));

if ($inscriptionId <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'id requis']);
    exit;
}

$tInsc = chmc_tbl('inscriptions');
$stmt = $conn->prepare(
    "SELECT id, nom, prenom, date_naissance, niveau, statut, wave_checkout_id, wave_client_ref, fiche_token, matricule
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

$currentStatut = (string) ($row['statut'] ?? '');
if ($currentStatut === 'validee' || $currentStatut === 'en_attente_validation') {
    $ficheToken = (string) ($row['fiche_token'] ?? '');
    if ($ficheToken === '') {
        $ficheToken = bin2hex(random_bytes(16));
        $tokUpd = $conn->prepare("UPDATE `{$tInsc}` SET fiche_token = ? WHERE id = ?");
        $tokUpd->bind_param('si', $ficheToken, $inscriptionId);
        $tokUpd->execute();
        $tokUpd->close();
    }
    echo json_encode([
        'ok' => true,
        'already_valid' => true,
        'matricule' => $row['matricule'] ?? null,
        'fiche_token' => $ficheToken,
        'statut' => $currentStatut,
        'message' => $currentStatut === 'validee'
            ? 'Inscription déjà validée par le centre.'
            : 'Pré-inscription confirmée. Imprimez votre fiche et présentez-vous au centre.',
    ]);
    exit;
}

if (!chmc_wave_is_configured()) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'API Wave non configurée']);
    exit;
}

$sessionId = $checkoutId !== '' ? $checkoutId : (string) ($row['wave_checkout_id'] ?? '');
$session = null;

if ($sessionId !== '') {
    $res = chmc_wave_get_checkout($sessionId);
    if ($res['ok']) {
        $session = $res['data'];
    }
}

if ($session === null && !empty($row['wave_client_ref'])) {
    $search = chmc_wave_find_by_client_reference((string) $row['wave_client_ref']);
    if ($search['ok'] && !empty($search['data']['result'][0])) {
        $session = $search['data']['result'][0];
    } elseif ($search['ok'] && isset($search['data']['id'])) {
        $session = $search['data'];
    }
}

if ($session === null) {
    http_response_code(402);
    echo json_encode(['ok' => false, 'message' => 'Paiement non trouvé. Réessayez ou contactez le centre.', 'pending' => true]);
    exit;
}

$checkoutStatus = (string) ($session['checkout_status'] ?? '');
$paymentStatus = (string) ($session['payment_status'] ?? '');

if ($checkoutStatus !== 'complete' || $paymentStatus !== 'succeeded') {
    http_response_code(402);
    echo json_encode([
        'ok' => false,
        'message' => 'Paiement Wave non finalisé',
        'checkout_status' => $checkoutStatus,
        'payment_status' => $paymentStatus,
        'pending' => true,
    ]);
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
$waveCheckoutId = (string) ($session['id'] ?? $sessionId);

$ficheToken = (string) ($row['fiche_token'] ?? '');
if ($ficheToken === '') {
    $ficheToken = bin2hex(random_bytes(16));
}

$upd = $conn->prepare(
    "UPDATE `{$tInsc}` SET statut = 'en_attente_validation', matricule = ?, wave_checkout_id = ?, fiche_token = ? WHERE id = ?"
);
$upd->bind_param('sssi', $matricule, $waveCheckoutId, $ficheToken, $inscriptionId);
$upd->execute();
$upd->close();

chmc_init_paiements_inscription($conn, $inscriptionId, $niveau, true);

$premierMontant = chmc_versements_niveau($niveau)[0];

echo json_encode([
    'ok' => true,
    'message' => 'Paiement reçu. Imprimez votre fiche d\'inscription et présentez-vous au centre pour validation.',
    'matricule' => $matricule,
    'fiche_token' => $ficheToken,
    'statut' => 'en_attente_validation',
    'transaction_id' => $session['transaction_id'] ?? null,
    'premier_versement' => $premierMontant,
]);
