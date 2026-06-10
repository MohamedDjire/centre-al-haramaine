import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { PHONE_DISPLAY, PHONE_SECONDARY } from '../config/contact.js';
import { formatMontant } from '../config/frais.js';

const PIECES_PHYSIQUES = [
  "Extrait d'acte de naissance ou jugement supplétif (original + copie)",
  'Dernier bulletin scolaire (original + copie)',
  "4 photos d'identité récentes",
  'Certificat de résidence',
  "Copie de la carte d'identité du parent / tuteur",
  'Chemise cartonnée à rabat (jaune)',
  'Un paquet de rame A4',
];

function Field({ label, value }) {
  return (
    <div className="border-b border-slate-200 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value || '—'}</dd>
    </div>
  );
}

export default function InscriptionFiche() {
  const [params] = useSearchParams();
  const [fiche, setFiche] = useState(null);
  const [error, setError] = useState('');

  const id = params.get('id');
  const token = params.get('t');

  useEffect(() => {
    if (!id || !token) {
      setError('Lien de fiche invalide.');
      return;
    }
    api.get(`/inscription_fiche.php?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`)
      .then(({ data }) => {
        if (data.ok) setFiche(data.fiche);
        else setError(data.message || 'Fiche introuvable.');
      })
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger la fiche.'));
  }, [id, token]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/inscription" className="mt-6 inline-block text-emerald-700 underline">Retour à l&apos;inscription</Link>
      </div>
    );
  }

  if (!fiche) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
      </div>
    );
  }

  const statutLabel = fiche.statut === 'validee'
    ? 'Validée par le centre'
    : 'En attente de validation sur place';

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      {/* Barre actions — masquée à l'impression */}
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap justify-center gap-3 px-4 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700"
        >
          🖨️ Imprimer la fiche
        </button>
        <Link to="/" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Accueil
        </Link>
      </div>

      <article className="fiche-print mx-auto max-w-3xl bg-white px-8 py-10 shadow-lg print:max-w-none print:shadow-none print:px-10">
        {/* En-tête */}
        <header className="border-b-2 border-emerald-800 pb-4 text-center">
          <img src="/assets/logo-principal.png" alt="" className="mx-auto h-20 w-20 rounded-full" />
          <h1 className="mt-3 text-xl font-extrabold uppercase tracking-wide text-emerald-950">
            Centre Al Haramaine
          </h1>
          <p className="text-sm font-medium text-emerald-800">pour la Mémorisation du Noble Coran — C.H.M.C</p>
          <p className="mt-1 text-xs text-slate-600">Abobo PK18, Bois Sec Marché — Abidjan</p>
          <p className="mt-3 text-base font-bold text-slate-900">
            FICHE D&apos;INSCRIPTION — Année scolaire {fiche.annee_scolaire}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Pré-inscription en ligne — à présenter au centre pour signature et vérification
          </p>
        </header>

        {/* Référence */}
        <div className="mt-4 flex flex-wrap justify-between gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm">
          <span><strong>N° dossier :</strong> {fiche.id}</span>
          <span><strong>Matricule :</strong> {fiche.matricule || '—'}</span>
          <span><strong>Date :</strong> {new Date(fiche.created_at).toLocaleDateString('fr-FR')}</span>
          <span className={`font-semibold ${fiche.statut === 'validee' ? 'text-emerald-700' : 'text-amber-700'}`}>
            {statutLabel}
          </span>
        </div>

        {/* Élève */}
        <section className="mt-6">
          <h2 className="mb-2 border-l-4 border-emerald-700 pl-3 text-sm font-bold uppercase text-emerald-900">
            Informations de l&apos;élève
          </h2>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Nom" value={fiche.nom} />
            <Field label="Prénom" value={fiche.prenom} />
            <Field label="Sexe" value={fiche.sexe} />
            <Field label="Date de naissance" value={fiche.date_naissance} />
            <Field label="Niveau / Classe demandé(e)" value={fiche.niveau} />
          </dl>
        </section>

        {/* Parent */}
        <section className="mt-6">
          <h2 className="mb-2 border-l-4 border-emerald-700 pl-3 text-sm font-bold uppercase text-emerald-900">
            Parent / Tuteur légal
          </h2>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Nom complet" value={fiche.parent_nom} />
            <Field label="Téléphone" value={fiche.telephone} />
            <Field label="WhatsApp" value={fiche.whatsapp} />
            <div className="border-b border-slate-200 py-2 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Adresse</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{fiche.adresse}</dd>
            </div>
          </dl>
        </section>

        {/* Frais */}
        <section className="mt-6">
          <h2 className="mb-2 border-l-4 border-emerald-700 pl-3 text-sm font-bold uppercase text-emerald-900">
            Frais de scolarité
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="py-2">Versement</th>
                <th className="py-2">Montant</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {(fiche.versements || []).map((m, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2">{i === 0 ? '1er versement (inscription)' : `${i + 1}e versement`}</td>
                  <td className="py-2 font-semibold">{formatMontant(m)}</td>
                  <td className="py-2">
                    {i === 0 ? (
                      <span className="font-semibold text-emerald-700">Payé en ligne (Wave)</span>
                    ) : (
                      <span className="text-slate-500">À régler au centre</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pièces à apporter */}
        <section className="mt-6">
          <h2 className="mb-2 border-l-4 border-emerald-700 pl-3 text-sm font-bold uppercase text-emerald-900">
            Pièces à apporter au centre (originaux)
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {PIECES_PHYSIQUES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 print:border print:bg-white">
          <p className="font-bold">Procédure à suivre :</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Imprimez cette fiche en 2 exemplaires.</li>
            <li>Présentez-vous au Centre Al Haramaine avec les documents listés ci-dessus.</li>
            <li>Le responsable de l&apos;établissement vérifiera votre dossier et signera la fiche.</li>
            <li>L&apos;inscription sera définitivement validée après cette étape.</li>
          </ol>
          <p className="mt-3 text-xs">
            Contact : {PHONE_DISPLAY} / {PHONE_SECONDARY}
          </p>
        </section>

        {/* Signatures */}
        <section className="mt-10 grid gap-8 sm:grid-cols-2 print:mt-16">
          <div>
            <p className="text-xs font-bold uppercase text-slate-600">Signature du parent / tuteur</p>
            <div className="mt-8 border-b border-slate-400" />
            <p className="mt-2 text-xs text-slate-500">Lu et approuvé — Date : ___ / ___ / 2026</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-600">
              Cachet et signature du responsable de l&apos;établissement
            </p>
            <div className="mt-8 border-b border-slate-400" />
            <p className="mt-2 text-xs text-slate-500">Centre Al Haramaine (C.H.M.C)</p>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 print:mt-12">
          Document généré automatiquement — www.alharamaine.site — Ne pas modifier les informations manuscrites du centre.
        </footer>
      </article>

      <style>{`
        @media print {
          body { background: white !important; }
          .fiche-print { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
