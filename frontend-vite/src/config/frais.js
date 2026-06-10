/** Frais de scolarité 2025-2026 — 3 versements par niveau */

export const FRAIS_TABLE = [
  {
    niveau: 'Maternelle (4-5 ans)',
    versements: [15000, 10000, 10000],
  },
  {
    niveau: 'Primaire (CP1-CM1)',
    versements: [15000, 7500, 7500],
    niveaux: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1'],
  },
  {
    niveau: 'Primaire (CM2)',
    versements: [15000, 7500, 7500],
    niveaux: ['CM2'],
  },
];

const LABELS_VERSEMENTS = ['1er versement (inscription)', '2e versement', '3e versement'];

export function getFraisForNiveau(niveau) {
  if (!niveau) return FRAIS_TABLE[1];
  if (niveau.includes('Maternelle')) return FRAIS_TABLE[0];
  if (niveau === 'CM2') return FRAIS_TABLE[2];
  return FRAIS_TABLE[1];
}

export function getVersementsMontants(niveau) {
  return [...getFraisForNiveau(niveau).versements];
}

export function getPremierVersement(niveau) {
  return getVersementsMontants(niveau)[0];
}

export function getTotalFrais(niveau) {
  return getVersementsMontants(niveau).reduce((a, b) => a + b, 0);
}

export function formatMontant(n) {
  return `${Number(n).toLocaleString('fr-FR')} F`;
}

export function getFraisTableDisplay() {
  return FRAIS_TABLE.map((row) => {
    const [v1, v2, v3] = row.versements;
    return {
      niveau: row.niveau,
      inscription: formatMontant(v1),
      deuxieme: formatMontant(v2),
      troisieme: formatMontant(v3),
      total: formatMontant(v1 + v2 + v3),
    };
  });
}

export function getVersementLabels() {
  return [...LABELS_VERSEMENTS];
}
