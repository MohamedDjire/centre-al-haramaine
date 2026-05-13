<?php

declare(strict_types=1);

/**
 * Préfixe des tables MySQL (ex. chmc_ → chmc_inscriptions).
 * Surcharge : dans local.php, clé "table_prefix" => "chmc" (sans underscore final).
 */
$pfx = 'chmc';
if (file_exists(__DIR__ . '/local.php')) {
    $local = include __DIR__ . '/local.php';
    if (is_array($local) && !empty($local['table_prefix'])) {
        $pfx = preg_replace('/[^a-zA-Z0-9_]/', '', (string) $local['table_prefix']);
        $pfx = rtrim($pfx, '_');
        if ($pfx === '') {
            $pfx = 'chmc';
        }
    }
}

define('CHMC_TBL_PFX', $pfx . '_');

function chmc_tbl(string $table): string
{
    return CHMC_TBL_PFX . $table;
}
