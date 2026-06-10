/** Titre commun — documents à apporter au centre après l'inscription en ligne. */
export const TITRE_PIECES_PHYSIQUES = 'Pièces à fournir physiquement au centre';

/** Liste unique (texte) — fiche imprimable, inscription, fiche PDF. */
export const PIECES_PHYSIQUES_CENTRE = [
  "Fiche d'inscription en ligne imprimée juste après l'inscription (2 exemplaires)",
  "Extrait d'acte de naissance ou jugement supplétif (original + copie)",
  'Dernier bulletin scolaire (original + copie)',
  "4 photos d'identité récentes",
  'Certificat de résidence',
  "Copie de la carte d'identité du parent / tuteur",
  'Chemise cartonnée à rabat (jaune)',
  "Fiche d'engagement signée sur place",
  "Droits d'examen : 15 500 F",
  'Un paquet de rame A4',
];

/** Accueil — cartes avec icônes (même liste). */
export const PIECES_PHYSIQUES_AFFICHAGE = [
  { label: PIECES_PHYSIQUES_CENTRE[0], icon: '🖨️' },
  { label: PIECES_PHYSIQUES_CENTRE[1], icon: '📄' },
  { label: PIECES_PHYSIQUES_CENTRE[2], icon: '📋' },
  { label: PIECES_PHYSIQUES_CENTRE[3], icon: '📸' },
  { label: PIECES_PHYSIQUES_CENTRE[4], icon: '🏠' },
  { label: PIECES_PHYSIQUES_CENTRE[5], icon: '🪪' },
  { label: PIECES_PHYSIQUES_CENTRE[6], icon: '📁' },
  { label: PIECES_PHYSIQUES_CENTRE[7], icon: '✍️' },
  { label: PIECES_PHYSIQUES_CENTRE[8], icon: '💰' },
  { label: PIECES_PHYSIQUES_CENTRE[9], icon: '📦' },
];

// Rétrocompatibilité
export const PIECES_A_FOURNIR = PIECES_PHYSIQUES_CENTRE;
export const PIECES_A_FOURNIR_FICHE = PIECES_PHYSIQUES_CENTRE;
