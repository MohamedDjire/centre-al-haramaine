<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../auth/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

$payload = json_decode(file_get_contents('php://input') ?: '[]', true);
$username = trim((string) ($payload['username'] ?? ''));
$password = (string) ($payload['password'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Identifiants incomplets']);
    exit;
}

$tAdmins = chmc_tbl('admins');
$stmt = $conn->prepare("SELECT id, password_hash FROM `{$tAdmins}` WHERE username = ? LIMIT 1");
$stmt->bind_param('s', $username);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row || !password_verify($password, $row['password_hash'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Identifiants invalides']);
    exit;
}

$token = chmc_issue_token($conn, (int) $row['id']);

echo json_encode([
    'ok' => true,
    'token' => $token,
    'expires_in_days' => 7,
]);
