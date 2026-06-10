/** Coordonnées officielles du centre — Côte d'Ivoire */
export const PHONE_DISPLAY = '05 05 95 50 39';
export const PHONE_WA = '2250505955039';
export const PHONE_TEL = '+2250505955039';
export const PHONE_SECONDARY = '07 47 49 00 30';
export const PHONE_SECONDARY_TEL = '+2250747490030';

export const WAVE_NUMBER = '05 05 95 50 39';
export const WAVE_NUMBER_INTL = '+2250505955039';

export function whatsappLink(message = '') {
  const base = `https://wa.me/${PHONE_WA}`;
  if (!message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function wavePaymentWhatsAppLink({ eleve = '', montant = '', motif = 'frais de scolarité' } = {}) {
  const parts = [
    'Bonjour,',
    'Je souhaite payer par Wave pour le Centre Al Haramaine.',
  ];
  if (eleve) parts.push(`Élève : ${eleve}`);
  if (montant) parts.push(`Montant : ${montant}`);
  parts.push(`Motif : ${motif}`);
  parts.push('Merci de confirmer la réception après paiement.');
  return whatsappLink(parts.join('\n'));
}

/** Lien WhatsApp pour confirmer le 1er versement à l'inscription */
export function waveInscriptionLink({ prenom, nom, niveau, montant }) {
  const eleve = [prenom, nom].filter(Boolean).join(' ');
  return wavePaymentWhatsAppLink({
    eleve,
    montant,
    motif: `1er versement inscription — ${niveau}`,
  });
}
