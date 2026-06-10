<?php

/**
 * Crée ou met à jour le compte admin de test.
 * Usage : php database/create_test_admin.php
 */

$username    = 'test.chmc';
$newPassword = 'TestCHMC2026!';

require_once __DIR__ . '/../backend/config/database.php';

$hash = password_hash($newPassword, PASSWORD_BCRYPT);
$tbl  = function_exists('chmc_tbl') ? chmc_tbl('admins') : 'chmc_admins';

$stmt = $conn->prepare("INSERT INTO `{$tbl}` (username, password_hash) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)");
$stmt->bind_param('ss', $username, $hash);
$stmt->execute();
$stmt->close();
$conn->close();

echo "Compte test cree ou mis a jour.\n";
echo "Identifiant : {$username}\n";
echo "Mot de passe : {$newPassword}\n";
echo "Connexion admin : /gestion-chmc-2026\n";
