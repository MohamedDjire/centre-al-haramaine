<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap_api.php';
require_once __DIR__ . '/../config/frais.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Methode non autorisee']);
    exit;
}

$id = (int) ($_GET['id'] ?? 0);
$token = trim((string) ($_GET['t'] ?? ''));

if ($id <= 0 || $token === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Parametres invalides']);
    exit;
}

$t = chmc_tbl('inscriptions');
$stmt = $conn->prepare(
    "SELECT id, matricule, nom, prenom, sexe, date_naissance, niveau, parent_nom, telephone, whatsapp,
            adresse, statut, fiche_token, created_at
     FROM `{$t}` WHERE id = ? LIMIT 1"
);
$stmt->bind_param('i', $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row || empty($row['fiche_token']) || !hash_equals((string) $row['fiche_token'], $token)) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Fiche introuvable']);
    exit;
}

$statut = (string) ($row['statut'] ?? '');
$allowed = ['en_attente_validation', 'validee', 'en_attente_paiement'];
if (!in_array($statut, $allowed, true) && $statut !== '') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'Fiche non disponible']);
    exit;
}

$niveau = (string) $row['niveau'];
$versements = chmc_versements_niveau($niveau);

echo json_encode([
    'ok' => true,
    'fiche' => [
        'id' => (int) $row['id'],
        'matricule' => $row['matricule'],
        'nom' => $row['nom'],
        'prenom' => $row['prenom'],
        'sexe' => $row['sexe'],
        'date_naissance' => $row['date_naissance'],
        'niveau' => $niveau,
        'parent_nom' => $row['parent_nom'],
        'telephone' => $row['telephone'],
        'whatsapp' => $row['whatsapp'],
        'adresse' => $row['adresse'],
        'statut' => $statut,
        'created_at' => $row['created_at'],
        'annee_scolaire' => '2025-2026',
        'premier_versement' => $versements[0] ?? null,
        'versements' => $versements,
    ],
]);
