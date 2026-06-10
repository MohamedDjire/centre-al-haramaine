<?php

declare(strict_types=1);

/** Année scolaire en cours (fin d'année pour les 2 derniers chiffres du matricule). */
function chmc_annee_scolaire(): string
{
    return '2025-2026';
}

function chmc_matricule_lettres(string $text): string
{
    $text = trim($text);
    if ($text === '') {
        return '';
    }
    $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
    if ($converted === false) {
        $converted = $text;
    }
    return strtoupper(preg_replace('/[^A-Z]/i', '', $converted));
}

/** Dernier prénom si plusieurs (ex. « Jean Pierre » → « Pierre »). */
function chmc_matricule_dernier_prenom(string $prenom): string
{
    $parts = preg_split('/\s+/u', trim($prenom)) ?: [];
    $parts = array_values(array_filter($parts, static fn ($p) => $p !== ''));
    if ($parts === []) {
        return '';
    }
    return (string) $parts[count($parts) - 1];
}

/**
 * Matricule : 3 lettres du NOM + 2 chiffres année naissance + 2 chiffres année scolaire + 1ère lettre du dernier PRÉNOM.
 * Ex. Diallo / Mamadou / 2015-03-12 → DIA1526M
 */
function chmc_matricule_base(string $nom, string $prenom, string $dateNaissance, ?string $anneeScolaire = null): string
{
    $anneeScolaire ??= chmc_annee_scolaire();

    $nomLettres = chmc_matricule_lettres($nom);
    $troisNom = substr($nomLettres, 0, 3);
    if (strlen($troisNom) < 3) {
        $troisNom = str_pad($troisNom, 3, 'X');
    }

    $anneeNaiss = '00';
    if (preg_match('/(\d{4})/', $dateNaissance, $m)) {
        $anneeNaiss = substr($m[1], -2);
    }

    $anneeFin = '00';
    if (preg_match('/(\d{4})\s*$/', trim($anneeScolaire), $m)) {
        $anneeFin = substr($m[1], -2);
    }

    $dernierPrenom = chmc_matricule_lettres(chmc_matricule_dernier_prenom($prenom));
    $lettrePrenom = $dernierPrenom !== '' ? $dernierPrenom[0] : 'X';

    return $troisNom . $anneeNaiss . $anneeFin . $lettrePrenom;
}

function chmc_matricule_existe(mysqli $conn, string $matricule, ?int $excludeId = null): bool
{
    $tbl = chmc_tbl('inscriptions');
    if ($excludeId !== null) {
        $stmt = $conn->prepare("SELECT id FROM `{$tbl}` WHERE matricule = ? AND id != ? LIMIT 1");
        $stmt->bind_param('si', $matricule, $excludeId);
    } else {
        $stmt = $conn->prepare("SELECT id FROM `{$tbl}` WHERE matricule = ? LIMIT 1");
        $stmt->bind_param('s', $matricule);
    }
    $stmt->execute();
    $found = (bool) $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return $found;
}

/** Génère un matricule unique (suffixe numérique si doublon). */
function chmc_generer_matricule(
    mysqli $conn,
    string $nom,
    string $prenom,
    string $dateNaissance,
    ?int $excludeId = null,
    ?string $anneeScolaire = null
): string {
    $base = chmc_matricule_base($nom, $prenom, $dateNaissance, $anneeScolaire);
    if (!chmc_matricule_existe($conn, $base, $excludeId)) {
        return $base;
    }

    for ($n = 2; $n <= 99; $n++) {
        $candidate = $base . (string) $n;
        if (!chmc_matricule_existe($conn, $candidate, $excludeId)) {
            return $candidate;
        }
    }

    return $base . bin2hex(random_bytes(2));
}
