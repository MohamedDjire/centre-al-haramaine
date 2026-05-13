<?php

declare(strict_types=1);

function chmc_token_from_request(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

function chmc_token_hash(string $plain): string
{
    return hash('sha256', $plain);
}

function chmc_require_admin_id(mysqli $conn): int
{
    $token = chmc_token_from_request();
    if (!$token) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(401);
        echo json_encode(['ok' => false, 'message' => 'Non autorise']);
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

    if (!$res) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(401);
        echo json_encode(['ok' => false, 'message' => 'Session invalide']);
        exit;
    }

    return (int) $res['admin_id'];
}

function chmc_issue_token(mysqli $conn, int $adminId): string
{
    $plain = bin2hex(random_bytes(32));
    $hash = chmc_token_hash($plain);
    $expires = (new DateTimeImmutable('+7 days'))->format('Y-m-d H:i:s');

    $tTokens = chmc_tbl('admin_tokens');
    $stmt = $conn->prepare(
        "INSERT INTO `{$tTokens}` (admin_id, token_hash, expires_at) VALUES (?, ?, ?)"
    );
    $stmt->bind_param('iss', $adminId, $hash, $expires);
    $stmt->execute();
    $stmt->close();

    return $plain;
}

function chmc_revoke_token(mysqli $conn): void
{
    $token = chmc_token_from_request();
    if (!$token) {
        return;
    }
    $hash = chmc_token_hash($token);
    $tTokens = chmc_tbl('admin_tokens');
    $stmt = $conn->prepare("DELETE FROM `{$tTokens}` WHERE token_hash = ?");
    $stmt->bind_param('s', $hash);
    $stmt->execute();
    $stmt->close();
}
