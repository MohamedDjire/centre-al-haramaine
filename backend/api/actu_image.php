<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/actu_image_serve.php';
$w = isset($_GET['w']) ? (int) $_GET['w'] : 0;
chmc_serve_actu_image((string) ($_GET['f'] ?? ''), $w);
