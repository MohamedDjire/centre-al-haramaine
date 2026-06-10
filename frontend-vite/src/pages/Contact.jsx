import WavePayment from '../components/WavePayment.jsx';
import { PHONE_DISPLAY, PHONE_SECONDARY, PHONE_SECONDARY_TEL, PHONE_TEL, whatsappLink } from '../config/contact.js';

export default function Contact() {
  const horaires = [
    { jour: 'Lundi – Vendredi', heures: '07 h 30 – 17 h 00' },
    { jour: 'Samedi', heures: '08 h 00 – 12 h 00' },
    { jour: 'Dimanche', heures: 'Fermé' },
  ];

  return (
    <div className="space-y-10">
      {/* ── En-tête ── */}
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">
          Nous contacter
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
          Pour toute question sur les inscriptions, les niveaux ou les frais,
          n'hésitez pas à joindre l'administration du Centre Al Haramaine.
        </p>
      </section>

      {/* ── 3 cartes de contact ── */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Téléphone */}
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <h2 className="text-lg font-bold text-emerald-900">Téléphone</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <a href={`tel:${PHONE_TEL}`} className="block font-medium text-emerald-800 hover:underline">
              {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE_SECONDARY_TEL}`} className="block font-medium text-emerald-800 hover:underline">
              {PHONE_SECONDARY}
            </a>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.01a9.865 9.865 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </span>
          <h2 className="text-lg font-bold text-emerald-900">WhatsApp</h2>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-green-700 hover:underline"
          >
            {PHONE_DISPLAY}
          </a>
          <p className="mt-1 text-xs text-slate-500">Réponse rapide — paiement Wave sur ce numéro</p>
        </div>

        {/* Adresse */}
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-1">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <h2 className="text-lg font-bold text-emerald-900">Adresse</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Abidjan, Abobo PK18
            <br />
            Bois Sec Marché
            <br />
            Derrière le moulin
          </p>
        </div>
      </section>

      {/* ── Paiement Wave ── */}
      <WavePayment />

      {/* ── Horaires d'ouverture ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-emerald-900">Horaires d'ouverture</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {horaires.map(({ jour, heures }) => (
            <li key={jour} className="flex items-center justify-between py-3 text-sm">
              <span className="font-medium text-slate-700">{jour}</span>
              <span className={heures === 'Fermé' ? 'font-semibold text-red-600' : 'font-semibold text-emerald-800'}>
                {heures}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA WhatsApp ── */}
      <section className="rounded-2xl bg-emerald-900 px-6 py-10 text-center text-white shadow-sm sm:px-10">
        <h2 className="text-2xl font-bold">Rejoignez le groupe WhatsApp</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-emerald-200">
          Restez informé des inscriptions, des événements et des annonces du
          Centre Al Haramaine directement sur WhatsApp.
        </p>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-emerald-900 shadow transition hover:bg-emerald-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.01a9.865 9.865 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          Écrire sur WhatsApp
        </a>
      </section>

      {/* ── Bannière ── */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <img
          src="/assets/banniere.png"
          alt="Bannière du Centre Al Haramaine pour la Mémorisation du Noble Coran"
          className="h-auto w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </section>

      {/* ── Informations supplémentaires ── */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-amber-900">Informations importantes</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-800">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-amber-600">●</span>
            La présence du parent ou du tuteur légal est <strong>obligatoire</strong> lors de l'inscription de tout élève mineur.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-amber-600">●</span>
            Veuillez vous munir d'une pièce d'identité et de deux photos d'identité de l'élève.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-amber-600">●</span>
            Les inscriptions se font sur place, aux horaires d'ouverture indiqués ci-dessus.
          </li>
        </ul>
      </section>
    </div>
  );
}
