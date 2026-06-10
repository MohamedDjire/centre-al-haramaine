import { NavLink } from 'react-router-dom';

const quickLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/inscription', label: 'Inscription' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-emerald-900 bg-emerald-950 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-principal.png"
              alt="Centre Al Haramaine"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white">C.H.M.C</p>
              <p className="text-xs text-emerald-300">Centre Al Haramaine</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Langues d'enseignement : Arabe — Français et mémorisation du noble Coran.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Liens rapides
          </h3>
          <ul className="space-y-2">
            {quickLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="link-interactive cursor-pointer text-sm text-slate-300 hover:text-emerald-300 hover:underline hover:underline-offset-4"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Abidjan, Abobo PK18
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>
                <a href="tel:+2250505955039" className="link-interactive cursor-pointer hover:text-emerald-300">05 05 95 50 39</a>
                {' / '}
                <a href="tel:+2250747490030" className="link-interactive cursor-pointer hover:text-emerald-300">07 47 49 00 30</a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.584-1.392A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.329-.726-6.033-1.96l-.424-.316-2.727.828.762-2.793-.338-.444A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              <a
                href="https://wa.me/2250505955039"
                target="_blank"
                rel="noreferrer"
                className="link-interactive cursor-pointer hover:text-emerald-300"
              >
                WhatsApp : 05 05 95 50 39
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-900 bg-emerald-950 px-6 py-5">
        <p className="text-center font-arabic text-lg leading-relaxed text-emerald-300" dir="rtl">
          القرآن عزيز لا يأتيه الباطل
        </p>
      </div>

      <div className="border-t border-emerald-900 bg-emerald-950 py-4 text-center text-xs text-slate-400">
        © 2026 Centre Al Haramaine — Tous droits réservés.
      </div>
    </footer>
  );
}
