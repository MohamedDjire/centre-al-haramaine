<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$token = chmc_token_from_request();
if (!$token) {
    echo json_encode(['ok' => false]);
    exit;
}

$hash = chmc_token_hash($token);
$tTokens = chmc_tbl('admin_tokens');
$stmt = $conn->prepare(
    "SELECT admin_id FROM `{$tTokens}` WHERE token_hash = ? AND expires_at > NOW() LIMIT 1"
);
$stmt->bind_param('s', $hash);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$stmt->close();

echo json_encode(['ok' => (bool) $res]);
