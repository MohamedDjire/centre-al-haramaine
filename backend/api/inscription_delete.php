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

$stmt = $conn->prepare(
    "SELECT document, document_bulletin, document_photo FROM `{$t}` WHERE id = ? LIMIT 1"
);
$stmt->bind_param('i', $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Introuvable']);
    exit;
}

$uploadDir = realpath(__DIR__ . '/../uploads');
foreach (['document', 'document_bulletin', 'document_photo'] as $col) {
    $name = $row[$col] ?? '';
    if ($name && $uploadDir) {
        $path = $uploadDir . DIRECTORY_SEPARATOR . basename((string) $name);
        if (is_file($path)) {
            @unlink($path);
        }
    }
}

$del = $conn->prepare("DELETE FROM `{$t}` WHERE id = ?");
$del->bind_param('i', $id);
$del->execute();
$del->close();

echo json_encode(['ok' => true]);
