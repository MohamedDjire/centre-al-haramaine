<?php

declare(strict_types=1);

require_once __DIR__ . '/table_prefix.php';

$cfg = [];
if (file_exists(__DIR__ . '/local.php')) {
    $loaded = include __DIR__ . '/local.php';
    if (is_array($loaded)) {
        $cfg = $loaded;
    }
}

$host = (string) ($cfg['db_host'] ?? 'localhost');
$user = (string) ($cfg['db_user'] ?? 'root');
$password = (string) ($cfg['db_password'] ?? '');
$dbname = (string) ($cfg['db_name'] ?? 'centre_haramaine');

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'message' => 'Erreur de connexion']);
    exit;
}

$conn->set_charset('utf8mb4');
