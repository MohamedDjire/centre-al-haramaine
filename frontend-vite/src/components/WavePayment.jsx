import { WAVE_NUMBER, wavePaymentWhatsAppLink } from '../config/contact.js';

export default function WavePayment({ compact = false, eleve = '', montant = '' }) {
  const waPay = wavePaymentWhatsAppLink({ eleve, montant });

  if (compact) {
    return (
      <a
        href={waPay}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#1DC8FF] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#0eb5ef]"
      >
        <WaveIcon className="h-5 w-5" />
        Payer par Wave
      </a>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[#1DC8FF]/30 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1DC8FF] text-white shadow-lg">
          <WaveIcon className="h-8 w-8" />
        </div>
        <div className="min-w-[200px] flex-1">
          <h3 className="text-lg font-bold text-slate-900">Paiement par Wave</h3>
          <p className="mt-1 text-sm text-slate-600">
            Envoyez le montant sur le compte Wave du centre, puis confirmez sur WhatsApp avec la capture du reçu.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Numéro Wave</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0077B6]">{WAVE_NUMBER}</p>
          <p className="mt-1 text-xs text-slate-500">Même numéro que WhatsApp</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Étapes</p>
          <ol className="mt-2 space-y-1.5 text-sm text-emerald-900">
            <li>1. Ouvrez l&apos;application <strong>Wave</strong></li>
            <li>2. Envoyez le montant au <strong>{WAVE_NUMBER}</strong></li>
            <li>3. Confirmez sur WhatsApp avec le reçu</li>
          </ol>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={waPay}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#1DC8FF] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0eb5ef]"
        >
          <WaveIcon className="h-5 w-5" />
          Payer et confirmer sur WhatsApp
        </a>
        <a
          href={waPay}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 border-green-600 bg-white px-6 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50"
        >
          Confirmer mon paiement
        </a>
      </div>
    </div>
  );
}

function WaveIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm0 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S6 21.5 6 16 10.5 6 16 6zm-4 7v10h2v-4h3c2.2 0 4-1.8 4-4s-1.8-4-4-4h-5zm2 2h3c1.1 0 2 .9 2 2s-.9 2-2 2h-3v-4z" />
    </svg>
  );
}
