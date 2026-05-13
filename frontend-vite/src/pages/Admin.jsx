import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const emptyEdit = {
  id: null,
  nom: '',
  prenom: '',
  sexe: '',
  date_naissance: '',
  niveau: '',
  parent_nom: '',
  telephone: '',
  whatsapp: '',
  adresse: '',
};

const fieldLabels = {
  nom: 'Nom',
  prenom: 'Prénom',
  sexe: 'Sexe',
  date_naissance: 'Date de naissance',
  niveau: 'Niveau',
  parent_nom: 'Parent / Tuteur',
  telephone: 'Téléphone',
  whatsapp: 'WhatsApp',
  adresse: 'Adresse',
};

export default function Admin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [sessionOk, setSessionOk] = useState(!!sessionStorage.getItem('admin_token'));
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [edit, setEdit] = useState(emptyEdit);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const base = import.meta.env.VITE_API_URL || 'http://localhost/Centre_Al_Haramaine/backend/api';

  async function checkSession() {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      setSessionOk(false);
      return false;
    }
    try {
      const { data } = await api.get('/session.php');
      const ok = !!data.ok;
      setSessionOk(ok);
      if (!ok) sessionStorage.removeItem('admin_token');
      return ok;
    } catch {
      sessionStorage.removeItem('admin_token');
      setSessionOk(false);
      return false;
    }
  }

  async function loadList() {
    setLoading(true);
    try {
      const { data } = await api.get('/inscriptions.php');
      setRows(data.inscriptions || []);
    } catch {
      setMsg('Impossible de charger les inscriptions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const ok = await checkSession();
      if (ok) await loadList();
    })();
  }, []);

  async function login(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const { data } = await api.post('/login.php', { username: user, password: pass });
      if (data.token) {
        sessionStorage.setItem('admin_token', data.token);
        setSessionOk(true);
        setPass('');
        await loadList();
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Connexion refusée.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api.post('/logout.php');
    } catch { /* ignore */ }
    sessionStorage.removeItem('admin_token');
    setSessionOk(false);
    setRows([]);
  }

  async function removeRow(id) {
    if (!window.confirm('Supprimer définitivement cette inscription ?')) return;
    try {
      await api.post('/inscription_delete.php', { id });
      await loadList();
    } catch {
      setMsg('Erreur lors de la suppression.');
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      await api.post('/inscription_update.php', edit, {
        headers: { 'Content-Type': 'application/json' },
      });
      setEdit(emptyEdit);
      setMsg('');
      await loadList();
    } catch {
      setMsg('Erreur lors de la modification.');
    }
  }

  async function downloadFile(id, type) {
    const token = sessionStorage.getItem('admin_token');
    try {
      const res = await fetch(`${base}/download.php?id=${id}&type=${type}`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        setMsg('Téléchargement impossible.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${id}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMsg('Erreur réseau lors du téléchargement.');
    }
  }

  const filtered = rows.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.nom || '').toLowerCase().includes(q) ||
      (r.prenom || '').toLowerCase().includes(q) ||
      (r.telephone || '').includes(q) ||
      (r.parent_nom || '').toLowerCase().includes(q) ||
      String(r.id).includes(q)
    );
  });

  if (!sessionOk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <img
              src="/assets/logo-principal.png"
              alt="Logo"
              className="mx-auto h-20 w-20 rounded-full ring-4 ring-emerald-400/30"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <h1 className="mt-4 text-2xl font-bold text-white">Administration</h1>
            <p className="mt-1 text-sm text-emerald-200">Centre Al Haramaine — C.H.M.C</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
            <h2 className="text-lg font-semibold text-white">Connexion sécurisée</h2>
            <p className="mt-1 text-xs text-emerald-300">Accès réservé au personnel autorisé.</p>

            {msg && (
              <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {msg}
              </div>
            )}

            <form className="mt-6 space-y-5" onSubmit={login}>
              <label className="block">
                <span className="text-sm font-medium text-emerald-100">Identifiant</span>
                <input
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  autoComplete="username"
                  placeholder="Votre identifiant"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-emerald-100">Mot de passe</span>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-200">
              <strong>🔒 Espace protégé</strong> — Cette page est réservée à l'administration du centre.
              Ne partagez jamais vos identifiants.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-principal.png"
              alt="Logo"
              className="h-10 w-10 rounded-full ring-2 ring-emerald-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <h1 className="text-lg font-bold text-emerald-950">Administration C.H.M.C</h1>
              <p className="text-xs text-slate-500">Gestion des inscriptions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {rows.length} inscription{rows.length > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={loadList}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              ↻ Rafraîchir
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {msg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
            <button type="button" className="ml-2 font-bold" onClick={() => setMsg('')}>✕</button>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un élève (nom, prénom, téléphone, ID)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
          <div className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800">
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">Chargement...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Élève</th>
                    <th className="px-4 py-3">Niveau</th>
                    <th className="px-4 py-3">Parent / Tuteur</th>
                    <th className="px-4 py-3">Téléphone</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="px-4 py-3">Date inscr.</th>
                    <th className="px-4 py-3">Documents</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{r.prenom} {r.nom}</p>
                        <p className="text-xs text-slate-500">{r.sexe} — né(e) le {r.date_naissance}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          {r.niveau}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{r.parent_nom}</td>
                      <td className="px-4 py-3 text-xs">{r.telephone}</td>
                      <td className="px-4 py-3 text-xs">
                        <a href={`https://wa.me/${(r.whatsapp || '').replace(/\s/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                          {r.whatsapp}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{r.created_at?.split(' ')[0]}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {['acte', 'bulletin', 'photo'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                              onClick={() => downloadFile(r.id, type)}
                            >
                              {type === 'acte' ? '📄' : type === 'bulletin' ? '📋' : '📷'}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                            onClick={() => setEdit({
                              id: r.id, nom: r.nom, prenom: r.prenom, sexe: r.sexe,
                              date_naissance: r.date_naissance, niveau: r.niveau,
                              parent_nom: r.parent_nom, telephone: r.telephone,
                              whatsapp: r.whatsapp, adresse: r.adresse,
                            })}
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            type="button"
                            className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                            onClick={() => removeRow(r.id)}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                        {search ? 'Aucun résultat pour cette recherche.' : 'Aucune inscription pour le moment.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {edit.id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
              onSubmit={saveEdit}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-emerald-950">
                  Modifier l'inscription #{edit.id}
                </h2>
                <button
                  type="button"
                  className="text-2xl text-slate-400 hover:text-slate-700"
                  onClick={() => setEdit(emptyEdit)}
                >
                  ✕
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.keys(emptyEdit)
                  .filter((k) => k !== 'id')
                  .map((key) => (
                    <label key={key} className="block text-sm">
                      <span className="font-medium text-slate-700">{fieldLabels[key] || key}</span>
                      {key === 'adresse' ? (
                        <textarea
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          value={edit[key]}
                          onChange={(e) => setEdit({ ...edit, [key]: e.target.value })}
                          rows={2}
                          required
                        />
                      ) : key === 'sexe' ? (
                        <select
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          value={edit[key]}
                          onChange={(e) => setEdit({ ...edit, [key]: e.target.value })}
                          required
                        >
                          <option value="">—</option>
                          <option value="Masculin">Masculin</option>
                          <option value="Féminin">Féminin</option>
                        </select>
                      ) : (
                        <input
                          type={key === 'date_naissance' ? 'date' : 'text'}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          value={edit[key]}
                          onChange={(e) => setEdit({ ...edit, [key]: e.target.value })}
                          required
                        />
                      )}
                    </label>
                  ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => setEdit(emptyEdit)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
