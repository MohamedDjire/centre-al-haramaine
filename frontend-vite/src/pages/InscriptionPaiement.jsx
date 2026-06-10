import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';

export default function InscriptionPaiement() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState({ type: 'loading', message: 'Vérification du paiement Wave...' });

  const id = params.get('id');
  const ficheLink = status.inscriptionId && status.ficheToken
    ? `/inscription/fiche?id=${status.inscriptionId}&t=${encodeURIComponent(status.ficheToken)}`
    : null;

  useEffect(() => {
    const result = params.get('s');

    if (!id) {
      setStatus({ type: 'error', message: 'Référence d\'inscription manquante.' });
      return;
    }

    if (result === 'error') {
      setStatus({
        type: 'error',
        message: 'Le paiement Wave n\'a pas abouti. Vous pouvez réessayer depuis le formulaire d\'inscription.',
      });
      return;
    }

    if (result !== 'success') {
      setStatus({ type: 'error', message: 'Paramètres de retour invalides.' });
      return;
    }

    (async () => {
      try {
        const { data } = await api.get(`/inscription_confirm.php?id=${encodeURIComponent(id)}`);
        if (data.ok) {
          sessionStorage.removeItem('chmc_pending_inscription');
          setStatus({
            type: 'success',
            message: data.message || 'Pré-inscription confirmée.',
            matricule: data.matricule,
            ficheToken: data.fiche_token,
            inscriptionId: id,
            statut: data.statut,
          });
        } else {
          setStatus({ type: 'error', message: data.message || 'Confirmation impossible.' });
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Impossible de confirmer le paiement.';
        const pending = err.response?.data?.pending;
        setStatus({
          type: pending ? 'pending' : 'error',
          message: msg,
          inscriptionId: id,
        });
      }
    })();
  }, [params, id]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      {status.type === 'loading' && (
        <>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
          <p className="mt-6 text-slate-600">{status.message}</p>
        </>
      )}

      {status.type === 'success' && (
        <>
          <span className="text-5xl">✅</span>
          <h1 className="mt-4 text-2xl font-bold text-emerald-900">Pré-inscription enregistrée</h1>
          <p className="mt-3 text-slate-600">{status.message}</p>
          {status.matricule && (
            <p className="mt-4 text-lg font-bold text-emerald-800">
              Matricule provisoire : {status.matricule}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-500">Le 1er versement a été enregistré comme payé via Wave.</p>

          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-left text-sm text-emerald-900">
            <p className="font-bold">Étape suivante obligatoire :</p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>Imprimez votre fiche d&apos;inscription (2 exemplaires).</li>
              <li>Présentez-vous au centre avec la fiche et les documents originaux.</li>
              <li>Le responsable signera la fiche pour valider définitivement l&apos;inscription.</li>
            </ol>
          </div>

          {ficheLink && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to={ficheLink}
                className="rounded-full bg-emerald-800 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                🖨️ Voir et imprimer ma fiche
              </Link>
            </div>
          )}

          <Link to="/" className="mt-6 inline-block text-sm text-emerald-700 underline">
            Retour à l&apos;accueil
          </Link>
        </>
      )}

      {(status.type === 'error' || status.type === 'pending') && (
        <>
          <span className="text-5xl">{status.type === 'pending' ? '⏳' : '❌'}</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            {status.type === 'pending' ? 'Paiement en attente' : 'Paiement non confirmé'}
          </h1>
          <p className="mt-3 text-slate-600">{status.message}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/inscription" className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700">
              Réessayer l&apos;inscription
            </Link>
            <Link to="/contact" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Nous contacter
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
