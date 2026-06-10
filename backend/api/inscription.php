<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';

http_response_code(410);
echo json_encode([
    'ok' => false,
    'message' => 'Endpoint obsolète. Utilisez inscription_prepare.php et wave_checkout.php pour le paiement Wave.',
]);
