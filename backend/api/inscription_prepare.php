<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/frais.php';

$tInscriptions = chmc_tbl('inscriptions');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

$uploadDir = realpath(__DIR__ . '/../uploads');
if ($uploadDir === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Dossier uploads introuvable']);
    exit;
}

$required = ['nom', 'prenom', 'sexe', 'date_naissance', 'niveau', 'parent_nom', 'telephone', 'whatsapp', 'adresse'];
foreach ($required as $field) {
    if (!isset($_POST[$field]) || trim((string) $_POST[$field]) === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => "Champ requis: {$field}"]);
        exit;
    }
}

$maxBytes = 5 * 1024 * 1024;
$allowedDocs = ['application/pdf' => 'pdf', 'image/jpeg' => 'jpg', 'image/png' => 'png'];
$allowedImages = ['image/jpeg' => 'jpg', 'image/png' => 'png'];

function chmc_save_upload_prepare(array $file, string $prefix, string $uploadDir, int $maxBytes, array $allowedMime): string
{
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Fichier invalide.');
    }
    if ($file['size'] > $maxBytes) {
        throw new RuntimeException('Fichier trop volumineux (max 5 Mo).');
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if (!isset($allowedMime[$mime])) {
        throw new RuntimeException('Type de fichier non autorise.');
    }
    $ext = $allowedMime[$mime];
    $name = $prefix . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $dest = $uploadDir . DIRECTORY_SEPARATOR . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        throw new RuntimeException('Echec enregistrement fichier.');
    }
    return $name;
}

try {
    $docActe = chmc_save_upload_prepare($_FILES['acte_naissance'], 'acte', $uploadDir, $maxBytes, $allowedDocs);
    $docBulletin = chmc_save_upload_prepare($_FILES['bulletin'], 'bulletin', $uploadDir, $maxBytes, $allowedDocs);
    $docPhoto = chmc_save_upload_prepare($_FILES['photo'], 'photo', $uploadDir, $maxBytes, $allowedImages);
} catch (RuntimeException $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
    exit;
}

$nom = trim((string) $_POST['nom']);
$prenom = trim((string) $_POST['prenom']);
$sexe = trim((string) $_POST['sexe']);
$dateNaissance = trim((string) $_POST['date_naissance']);
$niveau = trim((string) $_POST['niveau']);
$parentNom = trim((string) $_POST['parent_nom']);
$telephone = trim((string) $_POST['telephone']);
$whatsapp = trim((string) $_POST['whatsapp']);
$adresse = trim((string) $_POST['adresse']);

$clientRef = 'chmc-' . bin2hex(random_bytes(8));
$ficheToken = bin2hex(random_bytes(16));
$statut = 'en_attente_paiement';

$stmt = $conn->prepare(
    "INSERT INTO `{$tInscriptions}` (nom, prenom, sexe, date_naissance, niveau, parent_nom, telephone, whatsapp, adresse, document, document_bulletin, document_photo, statut, wave_client_ref, fiche_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param(
    'sssssssssssssss',
    $nom,
    $prenom,
    $sexe,
    $dateNaissance,
    $niveau,
    $parentNom,
    $telephone,
    $whatsapp,
    $adresse,
    $docActe,
    $docBulletin,
    $docPhoto,
    $statut,
    $clientRef,
    $ficheToken
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Erreur enregistrement']);
    $stmt->close();
    exit;
}

$newId = (int) $conn->insert_id;
$stmt->close();

$premierMontant = chmc_versements_niveau($niveau)[0];

http_response_code(201);
echo json_encode([
    'ok' => true,
    'inscription_id' => $newId,
    'client_reference' => $clientRef,
    'fiche_token' => $ficheToken,
    'premier_versement' => $premierMontant,
    'message' => 'Dossier enregistré. Procédez au paiement Wave.',
]);
