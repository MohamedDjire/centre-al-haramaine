<?php
/**
 * Régénère le mot de passe admin dans la base MySQL.
 * Usage : php database/fix_admin_password.php
 */

$username    = 'resp.haramaine';
$newPassword = 'ChMc#H@r4m@1n3_2026!';

require_once __DIR__ . '/../backend/config/database.php';

$hash = password_hash($newPassword, PASSWORD_BCRYPT);
$tbl  = 'chmc_admins';

if (function_exists('chmc_tbl')) {
    $tbl = chmc_tbl('admins');
}

$stmt = $conn->prepare("INSERT INTO `{$tbl}` (username, password_hash) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)");
$stmt->bind_param('ss', $username, $hash);
$stmt->execute();

echo "Admin credentials updated.\n";
echo "Username : {$username}\n";
echo "Password : {$newPassword}\n";
echo "Verify   : " . (password_verify($newPassword, $hash) ? 'OK' : 'FAIL') . "\n";

$stmt->close();
$conn->close();
