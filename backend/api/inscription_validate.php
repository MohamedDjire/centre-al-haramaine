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

$input = json_decode(file_get_contents('php://input') ?: '[]', true);
$id = (int) ($input['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'id requis']);
    exit;
}

$t = chmc_tbl('inscriptions');
$stmt = $conn->prepare("SELECT id, nom, prenom, date_naissance, statut, matricule FROM `{$t}` WHERE id = ? LIMIT 1");
$stmt->bind_param('i', $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Inscription introuvable']);
    exit;
}

if (($row['statut'] ?? '') === 'validee') {
    echo json_encode([
        'ok' => true,
        'already_valid' => true,
        'matricule' => $row['matricule'],
        'message' => 'Inscription déjà validée',
    ]);
    exit;
}

$matricule = trim((string) ($row['matricule'] ?? ''));
if ($matricule === '' || str_starts_with($matricule, 'CHMC-')) {
    $matricule = chmc_generer_matricule(
        $conn,
        (string) $row['nom'],
        (string) $row['prenom'],
        (string) $row['date_naissance'],
        $id
    );
}

$upd = $conn->prepare("UPDATE `{$t}` SET statut = 'validee', matricule = ? WHERE id = ?");
$upd->bind_param('si', $matricule, $id);
$upd->execute();
$upd->close();

echo json_encode([
    'ok' => true,
    'message' => 'Inscription validée après vérification sur place.',
    'matricule' => $matricule,
]);
