import { Link } from 'react-router-dom';
import WavePayment from '../components/WavePayment.jsx';
import { PHONE_DISPLAY, whatsappLink } from '../config/contact.js';
import { getFraisTableDisplay } from '../config/frais.js';
import { useActualites } from '../hooks/useActualites.js';
import { actuImageUrl } from '../utils/media.js';
import { PIECES_PHYSIQUES_AFFICHAGE, TITRE_PIECES_PHYSIQUES } from '../config/pieces.js';

const fraisScolarite = getFraisTableDisplay();

const tenuesPrix = [
  { niveau: 'CP1 – CP2', prix: '5 000F' },
  { niveau: 'CE1 – CE2', prix: '6 000F' },
  { niveau: 'CM1', prix: '6 500F' },
  { niveau: 'CM2', prix: '7 000F' },
];

export default function Home() {
  const { actus } = useActualites();

  return (
    <div className="space-y-0">
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Plein écran
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-20 text-center text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 mx-auto max-w-4xl">
          <img
            src="/assets/logo-principal.png"
            alt="Logo C.H.M.C"
            className="mx-auto mb-8 h-32 w-32 rounded-full border-4 border-white/20 object-contain shadow-2xl sm:h-40 sm:w-40"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Rentrée 2025-2026
          </p>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Centre Al Haramaine
          </h1>
          <p className="mt-2 text-lg font-medium text-emerald-200 sm:text-xl">
            pour la Mémorisation du Noble Coran
          </p>
          <p className="mx-auto mt-1 text-sm font-light tracking-wide text-emerald-300/80">
            C.H.M.C
          </p>

          <p
            className="mx-auto mt-6 max-w-xl text-2xl leading-relaxed text-white/90 sm:text-3xl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            dir="rtl"
          >
            خيركم من تعلم القرآن وعلمه
          </p>
          <p className="mt-2 text-sm italic text-emerald-200/70">
            « Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne »
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-base text-emerald-100/80 sm:text-lg">
            Enseignement en arabe, français et mémorisation du noble Coran.
            <br className="hidden sm:inline" />
            Situé à Abidjan, Abobo PK18, Bois Sec Marché.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/inscription"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-emerald-900 shadow-lg transition hover:bg-emerald-50 hover:shadow-xl"
            >
              📝 S'inscrire en ligne
            </Link>
            <Link
              to="/a-propos"
              className="rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
            >
              Découvrir le centre
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200/70">
            <span>📍 Abobo PK18, Bois Sec Marché</span>
            <span className="hidden sm:inline">•</span>
            <span>📞 05 05 95 50 39</span>
            <span className="hidden sm:inline">•</span>
            <span>📞 07 47 49 00 30</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-emerald-300/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ACTUALITÉS
      ═══════════════════════════════════════════════════════════════ */}
      {actus.length > 0 && (() => {
        const top3 = actus.slice(0, 3);
        const main = top3[0];
        const side = top3.slice(1);

        return (
          <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Actualités</h2>
                <Link to="/actualites" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                  Voir tout →
                </Link>
              </div>

              <div className="grid h-[420px] gap-3 sm:grid-cols-2">
                <Link to="/actualites" className="group relative block h-full overflow-hidden rounded-2xl sm:row-span-2">
                  <img
                    src={actuImageUrl(main.image, 720) || '/assets/banniere.png'}
                    alt={main.titre}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="mb-2 inline-block rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-bold uppercase text-white">
                      Nouveau
                    </span>
                    <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">{main.titre}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/70">{main.contenu}</p>
                  </div>
                </Link>

                {side.map((a) => (
                  <Link to="/actualites" key={a.id} className="group relative block overflow-hidden rounded-2xl">
                    <img
                      src={actuImageUrl(a.image, 400) || '/assets/banniere.png'}
                      alt={a.titre}
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-bold leading-snug text-white sm:text-base">{a.titre}</h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-white/60">{a.contenu}</p>
                    </div>
                  </Link>
                ))}

                {side.length < 2 && (
                  <Link
                    to="/actualites"
                    className="flex items-center justify-center rounded-2xl bg-emerald-900/10 text-sm font-semibold text-slate-400"
                  >
                    Plus d&apos;actualités bientôt...
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════
          QUI SOMMES-NOUS — 3 cartes
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Qui sommes-nous
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-emerald-900 sm:text-4xl">
            Notre mission éducative
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Le Centre Al Haramaine offre un cadre d'apprentissage rigoureux et bienveillant,
            alliant sciences islamiques et enseignement général.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: '📚',
                title: 'Pédagogie d\'excellence',
                text: 'Un programme structuré couvrant les matières fondamentales en arabe et en français, encadré par des enseignants qualifiés et dévoués à la réussite de chaque élève.',
              },
              {
                emoji: '🕌',
                title: 'Mémorisation du Coran',
                text: 'Un parcours progressif de mémorisation (Hifz) du Noble Coran, supervisé par des maîtres expérimentés selon les règles du Tajweed et une méthodologie éprouvée.',
              },
              {
                emoji: '🌍',
                title: 'Enseignement bilingue',
                text: 'Maîtrise de l\'arabe et du français pour offrir aux élèves une ouverture linguistique et culturelle, un atout majeur pour leur avenir académique et professionnel.',
              },
            ].map((card) => (
              <article
                key={card.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <span className="text-4xl">{card.emoji}</span>
                <h3 className="mt-4 text-xl font-bold text-emerald-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FRAIS DE SCOLARITÉ — Tableau
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            💰 Frais de scolarité
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-emerald-900 sm:text-4xl">
            Modalités de paiement 2025-2026
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Les frais sont payables en trois versements. Le <strong>1er versement</strong> se règle
            automatiquement par <strong>Wave</strong> lors de l&apos;inscription en ligne.
          </p>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="bg-emerald-900 text-white">
                  <th className="px-5 py-4 font-semibold">Niveau</th>
                  <th className="px-5 py-4 font-semibold text-center">Inscription + 1ᵉʳ versement</th>
                  <th className="px-5 py-4 font-semibold text-center">2ᵉ versement<br /><span className="text-xs font-normal text-emerald-200">Fin novembre</span></th>
                  <th className="px-5 py-4 font-semibold text-center">3ᵉ versement<br /><span className="text-xs font-normal text-emerald-200">Fin janvier</span></th>
                  <th className="px-5 py-4 font-semibold text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {fraisScolarite.map((row, i) => (
                  <tr
                    key={row.niveau}
                    className={`border-t border-slate-100 transition hover:bg-emerald-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
                  >
                    <td className="px-5 py-4 font-medium text-emerald-900">{row.niveau}</td>
                    <td className="px-5 py-4 text-center text-slate-700">{row.inscription}</td>
                    <td className="px-5 py-4 text-center text-slate-700">{row.deuxieme}</td>
                    <td className="px-5 py-4 text-center text-slate-700">{row.troisieme}</td>
                    <td className="px-5 py-4 text-center font-bold text-emerald-800">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            ⚠️ Droits d'examen en sus : <strong className="text-emerald-800">15 500F</strong> (inclus dans le dossier d'inscription)
          </p>

          <div className="mt-10">
            <WavePayment />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DOSSIER D'INSCRIPTION — Liste des pièces
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            📝 Dossier d'inscription
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-emerald-900 sm:text-4xl">
            {TITRE_PIECES_PHYSIQUES}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Après l&apos;inscription en ligne, présentez-vous au centre avec les documents
            physiques suivants pour finaliser l&apos;inscription de votre enfant.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {PIECES_PHYSIQUES_AFFICHAGE.map((piece) => (
              <div
                key={piece.label}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-lg">
                  {piece.icon}
                </span>
                <div>
                  <p className="font-medium text-emerald-900">{piece.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900">
              ⚠️ Note importante
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">👤</span>
                <span>La <strong>présence du parent ou tuteur</strong> est exigée lors de l'inscription.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">📱</span>
                <span>Il est obligatoire d'avoir un <strong>numéro WhatsApp</strong> pour intégrer le groupe des parents.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TENUE SCOLAIRE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            👕 Tenue scolaire
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-emerald-900 sm:text-4xl">
            Uniforme obligatoire
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Le port de la tenue scolaire est obligatoire pour tous les élèves.
            Les tenues sont vendues directement au sein de l'établissement.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tenuesPrix.map((t) => (
              <div
                key={t.niveau}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{t.niveau}</p>
                <p className="mt-3 text-3xl font-extrabold text-emerald-800">{t.prix}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-emerald-900">👟 Chaussures et équipements requis</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">✅</span>
                <span>Chaussures : <strong>Kito ou tennis</strong> pour les garçons, <strong>ballerines</strong> pour les filles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">✅</span>
                <span><strong>Maillot de sport</strong> obligatoire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">🏫</span>
                <span>La tenue est vendue au sein de l'établissement</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FICHE DE RENTRÉE — Image
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            📋 Document officiel
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-emerald-900 sm:text-4xl">
            Fiche de rentrée 2025-2026
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600">
            Retrouvez ci-dessous la fiche officielle du centre reprenant l'ensemble des
            informations relatives à la rentrée scolaire.
          </p>

          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <img
              src="/assets/fiche-inscription.png"
              alt="Fiche de rentrée 2025-2026 du Centre Al Haramaine"
              className="w-full rounded-xl object-contain"
              onError={(e) => {
                e.currentTarget.parentElement.innerHTML =
                  '<p class="py-16 text-center text-slate-400">Image de la fiche de rentrée non disponible</p>';
              }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA FINAL — Inscription + WhatsApp
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-4 py-24 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="text-5xl">🕌</span>
          <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Inscrivez votre enfant dès maintenant
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-emerald-100/80 sm:text-lg">
            Offrez-lui un cadre d'apprentissage où le Coran et le savoir se conjuguent.
            Les inscriptions pour l'année 2025-2026 sont ouvertes.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/inscription"
              className="rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-wider text-emerald-900 shadow-lg transition hover:bg-emerald-50 hover:shadow-xl"
            >
              📝 S'inscrire en ligne
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/40 px-10 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
            >
              💬 WhatsApp
            </a>
            <WavePayment compact />
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-emerald-200/70">
            <span>📍 Abobo PK18, Bois Sec Marché, derrière le moulin</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-emerald-200/70">
            <span>📞 {PHONE_DISPLAY}</span>
            <span>📱 Wave &amp; WhatsApp : {PHONE_DISPLAY}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
