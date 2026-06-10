<?php

declare(strict_types=1);

function chmc_app_config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $cfg = [];
        if (file_exists(__DIR__ . '/local.php')) {
            $loaded = include __DIR__ . '/local.php';
            if (is_array($loaded)) {
                $cfg = $loaded;
            }
        }
    }
    return $cfg;
}

function chmc_wave_is_configured(): bool
{
    $cfg = chmc_app_config();
    return !empty($cfg['wave_api_key']);
}

function chmc_site_base_url(): string
{
    $cfg = chmc_app_config();
    $url = (string) ($cfg['site_base_url'] ?? 'https://www.damastudio.org');
    return rtrim($url, '/');
}

/** Convertit 05 05 95 50 39 → +2250505955039 */
function chmc_phone_to_e164(string $phone): ?string
{
    $digits = preg_replace('/\D/', '', $phone);
    if ($digits === '') {
        return null;
    }
    if (str_starts_with($digits, '225')) {
        return '+' . $digits;
    }
    if (strlen($digits) === 10) {
        return '+225' . $digits;
    }
    if (strlen($digits) === 8) {
        return '+225' . $digits;
    }
    return null;
}

/**
 * @return array{ok:bool, data?:array, error?:string, http_code?:int}
 */
function chmc_wave_api(string $method, string $path, ?array $body = null): array
{
    $cfg = chmc_app_config();
    $apiKey = (string) ($cfg['wave_api_key'] ?? '');
    if ($apiKey === '') {
        return ['ok' => false, 'error' => 'API Wave non configurée (wave_api_key manquant dans local.php)'];
    }

    $url = 'https://api.wave.com' . $path;
    $jsonBody = $body !== null ? json_encode($body, JSON_UNESCAPED_SLASHES) : '';

    $headers = [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ];

    $signingSecret = (string) ($cfg['wave_signing_secret'] ?? '');
    if ($signingSecret !== '') {
        $timestamp = (string) time();
        $payload = $timestamp . ($jsonBody ?: '');
        $signature = hash_hmac('sha256', $payload, $signingSecret);
        $headers[] = 'Wave-Signature: t=' . $timestamp . ',v1=' . $signature;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $method = strtoupper($method);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonBody);
    }

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ['ok' => false, 'error' => 'Erreur réseau Wave: ' . $curlErr, 'http_code' => $httpCode];
    }

    $data = json_decode($response, true);
    if ($httpCode >= 200 && $httpCode < 300 && is_array($data)) {
        return ['ok' => true, 'data' => $data, 'http_code' => $httpCode];
    }

    $msg = is_array($data) && isset($data['error']['message'])
        ? (string) $data['error']['message']
        : 'Erreur API Wave (HTTP ' . $httpCode . ')';

    return ['ok' => false, 'error' => $msg, 'http_code' => $httpCode, 'data' => is_array($data) ? $data : null];
}

function chmc_wave_create_checkout(
    string $amountXof,
    string $clientReference,
    string $successUrl,
    string $errorUrl,
    ?string $restrictPayerMobile = null
): array {
    $payload = [
        'amount' => $amountXof,
        'currency' => 'XOF',
        'client_reference' => $clientReference,
        'success_url' => $successUrl,
        'error_url' => $errorUrl,
    ];

    if ($restrictPayerMobile) {
        $payload['restrict_payer_mobile'] = $restrictPayerMobile;
    }

    return chmc_wave_api('POST', '/v1/checkout/sessions', $payload);
}

function chmc_wave_get_checkout(string $checkoutId): array
{
    return chmc_wave_api('GET', '/v1/checkout/sessions/' . rawurlencode($checkoutId));
}

function chmc_wave_find_by_client_reference(string $clientReference): array
{
    return chmc_wave_api('GET', '/v1/checkout/sessions/search?client_reference=' . rawurlencode($clientReference));
}

function chmc_wave_amount_string(float $amount): string
{
    return (string) (int) round($amount);
}
