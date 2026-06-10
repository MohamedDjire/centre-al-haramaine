<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../auth/token.php';
require_once __DIR__ . '/../lib/matricule.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

chmc_require_admin_id($conn);

$tInsc = chmc_tbl('inscriptions');

$result = $conn->query(
    "SELECT id, nom, prenom, date_naissance, matricule FROM `{$tInsc}`
     WHERE matricule IS NULL OR matricule = '' OR matricule LIKE 'CHMC-%'
     ORDER BY id ASC"
);
$updated = 0;

while ($row = $result->fetch_assoc()) {
    $id = (int) $row['id'];
    $matricule = chmc_generer_matricule(
        $conn,
        (string) ($row['nom'] ?? ''),
        (string) ($row['prenom'] ?? ''),
        (string) ($row['date_naissance'] ?? ''),
        $id
    );

    $stmt = $conn->prepare("UPDATE `{$tInsc}` SET matricule = ? WHERE id = ?");
    $stmt->bind_param('si', $matricule, $id);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        $updated++;
    }
    $stmt->close();
}

echo json_encode([
    'ok' => true,
    'message' => "{$updated} matricule(s) generes (format : 3 lettres nom + annee naissance + annee scolaire + initiale prenom)",
    'updated' => $updated,
]);
