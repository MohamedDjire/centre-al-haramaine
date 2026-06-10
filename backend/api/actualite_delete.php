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

$payload = json_decode(file_get_contents('php://input') ?: '[]', true);
$id = (int) ($payload['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID requis']);
    exit;
}

$tbl = chmc_tbl('actualites');

$stmt = $conn->prepare("SELECT image FROM `{$tbl}` WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($row && $row['image']) {
    $file = __DIR__ . '/../uploads/' . $row['image'];
    if (file_exists($file)) {
        unlink($file);
    }
}

$stmt = $conn->prepare("DELETE FROM `{$tbl}` WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();

echo json_encode(['ok' => true, 'deleted' => $stmt->affected_rows]);
$stmt->close();
