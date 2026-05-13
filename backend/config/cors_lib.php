<?php

declare(strict_types=1);

/**
 * En-têtes CORS. Si $setJsonContentType, envoie Content-Type application/json.
 * Répond 204 aux requêtes OPTIONS.
 */
function chmc_cors_headers(bool $setJsonContentType = true): void
{
    $allowOrigin = '*';
    $localPath = __DIR__ . '/local.php';
    if (file_exists($localPath)) {
        $cfg = include $localPath;
        if (is_array($cfg) && !empty($cfg['cors_allowed_origins']) && is_array($cfg['cors_allowed_origins'])) {
            $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
            if ($requestOrigin !== '' && in_array($requestOrigin, $cfg['cors_allowed_origins'], true)) {
                $allowOrigin = $requestOrigin;
            }
        }
    }

    header('Access-Control-Allow-Origin: ' . $allowOrigin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');

    if ($setJsonContentType) {
        header('Content-Type: application/json; charset=utf-8');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
