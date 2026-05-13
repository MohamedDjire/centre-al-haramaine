<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/cors_lib.php';
chmc_cors_headers(false);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

chmc_require_admin_id($conn);

$id = (int) ($_GET['id'] ?? 0);
$type = $_GET['type'] ?? '';

$map = [
    'acte' => 'document',
    'bulletin' => 'document_bulletin',
    'photo' => 'document_photo',
];

if ($id <= 0 || !isset($map[$type])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'message' => 'Parametres invalides']);
    exit;
}

$col = $map[$type];
$t = chmc_tbl('inscriptions');
$sql = 'SELECT `' . $col . '` AS fname FROM `' . $t . '` WHERE id = ? LIMIT 1';
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row || empty($row['fname'])) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'message' => 'Fichier introuvable']);
    exit;
}

$uploadDir = realpath(__DIR__ . '/../uploads');
$path = $uploadDir ? $uploadDir . DIRECTORY_SEPARATOR . basename((string) $row['fname']) : '';

if ($path === '' || !is_file($path)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'message' => 'Fichier absent']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($path) ?: 'application/octet-stream';

header('Content-Type: ' . $mime);
header('Content-Disposition: attachment; filename="' . basename($path) . '"');
readfile($path);
exit;
