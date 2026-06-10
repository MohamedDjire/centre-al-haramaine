import { useActualites } from '../hooks/useActualites.js';
import { actuImageUrl } from '../utils/media.js';

export default function Actualites() {
  const { actus, loading, error, hasCache } = useActualites();

  function timeAgo(dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 172800) return 'Hier';
    if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} jours`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-emerald-900 px-4 py-12 text-center text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Actualités</h1>
        <p className="mt-2 text-sm text-emerald-200">
          Suivez les dernières nouvelles du Centre Al Haramaine
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {loading && !hasCache ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="h-48 bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-5/6 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : actus.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-500">
              {error ? 'Connexion lente — réessayez dans un instant.' : 'Aucune actualité pour le moment.'}
            </p>
            {error && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Réessayer
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {actus.map((a) => (
              <article
                key={a.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/logo-principal.png"
                      alt=""
                      className="h-10 w-10 rounded-full ring-2 ring-slate-100"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Centre Al Haramaine</p>
                      <p className="text-xs text-slate-500">{timeAgo(a.created_at)}</p>
                    </div>
                  </div>

                  <h2 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">{a.titre}</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {a.contenu}
                  </p>
                </div>

                {a.image && (
                  <img
                    src={actuImageUrl(a.image, 900)}
                    alt={a.titre}
                    className="mt-1 max-h-[480px] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                <div className="flex items-center gap-6 border-t border-slate-100 px-4 py-2.5">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(a.titre + ' - Centre Al Haramaine')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700"
                  >
                    <span>📤</span> Partager
                  </a>
                  <span className="text-xs text-slate-400">
                    {new Date(a.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
