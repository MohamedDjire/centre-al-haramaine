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

$t = chmc_tbl('inscriptions');
$payload = json_decode(file_get_contents('php://input') ?: '[]', true);
$id = (int) ($payload['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID invalide']);
    exit;
}

$nom = trim((string) ($payload['nom'] ?? ''));
$prenom = trim((string) ($payload['prenom'] ?? ''));
$sexe = trim((string) ($payload['sexe'] ?? ''));
$dateNaissance = trim((string) ($payload['date_naissance'] ?? ''));
$niveau = trim((string) ($payload['niveau'] ?? ''));
$parentNom = trim((string) ($payload['parent_nom'] ?? ''));
$telephone = trim((string) ($payload['telephone'] ?? ''));
$whatsapp = trim((string) ($payload['whatsapp'] ?? ''));
$adresse = trim((string) ($payload['adresse'] ?? ''));

if (
    $nom === '' ||
    $prenom === '' ||
    $sexe === '' ||
    $dateNaissance === '' ||
    $niveau === '' ||
    $parentNom === '' ||
    $telephone === '' ||
    $whatsapp === '' ||
    $adresse === ''
) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Champs incomplets']);
    exit;
}

$sql = "UPDATE `{$t}` SET nom=?, prenom=?, sexe=?, date_naissance=?, niveau=?, parent_nom=?, telephone=?, whatsapp=?, adresse=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    'sssssssssi',
    $nom,
    $prenom,
    $sexe,
    $dateNaissance,
    $niveau,
    $parentNom,
    $telephone,
    $whatsapp,
    $adresse,
    $id
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Erreur mise a jour']);
    $stmt->close();
    exit;
}

$stmt->close();
echo json_encode(['ok' => true]);
