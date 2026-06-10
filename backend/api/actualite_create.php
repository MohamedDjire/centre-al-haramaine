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

$titre   = trim($_POST['titre'] ?? '');
$contenu = trim($_POST['contenu'] ?? '');

if ($titre === '' || $contenu === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Titre et contenu requis']);
    exit;
}

$imagePath = null;
if (!empty($_FILES['image']['tmp_name']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    $mime = mime_content_type($_FILES['image']['tmp_name']);
    if (!in_array($mime, $allowed, true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Format image non autorise']);
        exit;
    }
    $ext = match ($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
        default      => 'jpg',
    };
    $filename = 'actu_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename);
    require_once __DIR__ . '/../lib/actu_upload_optimize.php';
    $imagePath = chmc_optimize_actu_upload($uploadDir . $filename);
}

$tbl = chmc_tbl('actualites');
$stmt = $conn->prepare("INSERT INTO `{$tbl}` (titre, contenu, image) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $titre, $contenu, $imagePath);
$stmt->execute();
$newId = $stmt->insert_id;
$stmt->close();

echo json_encode(['ok' => true, 'id' => $newId]);
