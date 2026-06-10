<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/wave_client.php';

echo json_encode([
    'ok' => true,
    'wave_api_enabled' => chmc_wave_is_configured(),
]);
