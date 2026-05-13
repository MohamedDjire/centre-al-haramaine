import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-emerald-800 text-white shadow-sm'
      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-emerald-800 text-white'
      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
  }`;

const navLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À propos' },
  { to: '/inscription', label: 'Inscription' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 shadow-md backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/assets/logo-principal.png"
            alt="Centre Al Haramaine"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              C.H.M.C
            </p>
            <p className="text-sm font-semibold text-slate-900">Centre Al Haramaine</p>
          </div>
        </NavLink>

        <nav className="hidden gap-1 md:flex">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} className={linkClass} end={end}>
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 md:hidden"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                className={mobileLinkClass}
                end={end}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
