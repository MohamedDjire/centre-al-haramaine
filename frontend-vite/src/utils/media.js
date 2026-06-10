/** URL publique d'une image d'actualité (miniature w=480 par défaut pour chargement rapide). */
export function actuImageUrl(filename, width = 480) {
  if (!filename) return null;
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  if (!base) return null;
  const w = width > 0 ? `&w=${width}` : '';
  return `${base}/actualites.php?f=${encodeURIComponent(filename)}${w}`;
}
