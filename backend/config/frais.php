<?php

declare(strict_types=1);

/**
 * Frais de scolarité 2025-2026 — 3 versements.
 * Maternelle : 15 000 + 10 000 + 10 000
 * CP1–CM1  : 15 000 + 7 500 + 7 500
 * CM2      : 15 000 + 7 500 + 7 500
 */
function chmc_versements_niveau(string $niveau): array
{
    if (stripos($niveau, 'Maternelle') !== false) {
        return [15000.0, 10000.0, 10000.0];
    }
    if ($niveau === 'CM2') {
        return [15000.0, 7500.0, 7500.0];
    }
    return [15000.0, 7500.0, 7500.0];
}

function chmc_versements_labels(): array
{
    return ['1er versement (inscription)', '2e versement', '3e versement'];
}

function chmc_init_paiements_inscription(mysqli $conn, int $inscriptionId, string $niveau, bool $premierVersementPaye): void
{
    $montants = chmc_versements_niveau($niveau);
    $labels = chmc_versements_labels();
    $annee = '2025-2026';
    $tPay = chmc_tbl('paiements');

    foreach ($labels as $i => $mois) {
        $montant = $montants[$i];
        $estPremier = $i === 0;
        $paye = $estPremier && $premierVersementPaye;
        $montantPaye = $paye ? $montant : 0.0;
        $statut = $paye ? 'paye' : 'non_paye';
        $datePaiement = $paye ? date('Y-m-d') : '';
        $note = $paye ? 'Payé via Wave à l\'inscription en ligne' : '';

        $stmt = $conn->prepare(
            "INSERT IGNORE INTO `{$tPay}` (inscription_id, mois, annee_scolaire, montant, montant_paye, statut, date_paiement, note)
             VALUES (?, ?, ?, ?, ?, ?, NULLIF(?, ''), NULLIF(?, ''))"
        );
        $stmt->bind_param(
            'issddsss',
            $inscriptionId,
            $mois,
            $annee,
            $montant,
            $montantPaye,
            $statut,
            $datePaiement,
            $note
        );
        $stmt->execute();
        $stmt->close();
    }
}
