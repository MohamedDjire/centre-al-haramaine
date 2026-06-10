import { useEffect, useState, useMemo } from 'react';
import { api } from '../api/client.js';
import { actuImageUrl } from '../utils/media.js';

const NIVEAUX = ['Maternelle (4-5 ans)', 'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'];
const MOIS_ORDRE = ['Octobre','Novembre','Décembre','Janvier','Février','Mars','Avril','Mai','Juin'];

const STATUT_LABELS = {
  en_attente_validation: { label: 'À valider', className: 'bg-amber-100 text-amber-800' },
  validee: { label: 'Validée', className: 'bg-emerald-100 text-emerald-800' },
  en_attente_paiement: { label: 'Attente paiement', className: 'bg-slate-100 text-slate-600' },
};

const emptyEdit = {
  id: null, nom: '', prenom: '', sexe: '', date_naissance: '',
  niveau: '', parent_nom: '', telephone: '', whatsapp: '', adresse: '',
};
const fieldLabels = {
  nom: 'Nom', prenom: 'Prénom', sexe: 'Sexe', date_naissance: 'Date de naissance',
  niveau: 'Niveau / Classe', parent_nom: 'Parent / Tuteur', telephone: 'Téléphone',
  whatsapp: 'WhatsApp', adresse: 'Adresse',
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
  const [tab, setTab] = useState('inscriptions');
  const [actus, setActus] = useState([]);
  const [newActu, setNewActu] = useState({ titre: '', contenu: '' });
  const [actuImage, setActuImage] = useState(null);

  const [filterNiveau, setFilterNiveau] = useState('');
  const [filterSexe, setFilterSexe] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const [paiements, setPaiements] = useState([]);
  const [payNiveau, setPayNiveau] = useState('');
  const [paySearch, setPaySearch] = useState('');
  const [payEditId, setPayEditId] = useState(null);
  const [payEditData, setPayEditData] = useState({});
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [elevePaiements, setElevePaiements] = useState([]);

  const base = import.meta.env.VITE_API_URL || 'http://localhost/Centre_Al_Haramaine/backend/api';

  async function checkSession() {
    const token = sessionStorage.getItem('admin_token');
    if (!token) { setSessionOk(false); return false; }
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
    } catch { setMsg('Impossible de charger les inscriptions.'); }
    finally { setLoading(false); }
  }

  async function loadActus() {
    try {
      const { data } = await api.get('/actualites.php');
      setActus(data.actualites || []);
    } catch { /* ignore */ }
  }

  async function loadPaiements() {
    try {
      const { data } = await api.get('/paiements.php?annee_scolaire=2025-2026');
      setPaiements(data.paiements || []);
    } catch { /* ignore */ }
  }

  async function loadElevePaiements(inscriptionId) {
    try {
      const { data } = await api.get(`/paiements.php?inscription_id=${inscriptionId}&annee_scolaire=2025-2026`);
      setElevePaiements(data.paiements || []);
    } catch { setElevePaiements([]); }
  }

  useEffect(() => {
    (async () => {
      const ok = await checkSession();
      if (ok) {
        await loadList();
        await loadActus();
        await loadPaiements();
      }
    })();
  }, []);

  async function login(e) {
    e.preventDefault();
    setMsg(''); setLoading(true);
    try {
      const { data } = await api.post('/login.php', { username: user, password: pass });
      if (data.token) {
        sessionStorage.setItem('admin_token', data.token);
        setSessionOk(true); setPass('');
        await loadList(); await loadActus(); await loadPaiements();
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Connexion refusée.');
    } finally { setLoading(false); }
  }

  async function logout() {
    try { await api.post('/logout.php'); } catch { /* ignore */ }
    sessionStorage.removeItem('admin_token');
    setSessionOk(false); setRows([]);
  }

  async function removeRow(id) {
    if (!window.confirm('Supprimer définitivement cette inscription ?')) return;
    try { await api.post('/inscription_delete.php', { id }); await loadList(); }
    catch { setMsg('Erreur lors de la suppression.'); }
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      await api.post('/inscription_update.php', edit, { headers: { 'Content-Type': 'application/json' } });
      setEdit(emptyEdit); setMsg(''); await loadList();
    } catch { setMsg('Erreur lors de la modification.'); }
  }

  async function downloadFile(id, type) {
    const token = sessionStorage.getItem('admin_token');
    try {
      const res = await fetch(`${base}/download.php?id=${id}&type=${type}`, {
        method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { setMsg('Téléchargement impossible.'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${type}_${id}`; a.click();
      URL.revokeObjectURL(url);
    } catch { setMsg('Erreur réseau lors du téléchargement.'); }
  }

  async function generateMatricules() {
    try {
      const { data } = await api.post('/matricule_generate.php');
      setMsg(`${data.updated || 0} matricule(s) généré(s).`);
      await loadList();
    } catch { setMsg('Erreur lors de la génération des matricules.'); }
  }

  async function initPaiements(inscriptionId) {
    try {
      await api.post('/paiement_init.php', { inscription_id: inscriptionId });
      await loadPaiements();
      if (selectedEleve) await loadElevePaiements(inscriptionId);
    } catch { setMsg('Erreur initialisation paiements.'); }
  }

  async function initAllPaiements() {
    setLoading(true);
    for (const r of rows) {
      try {
        await api.post('/paiement_init.php', { inscription_id: r.id });
      } catch { /* skip */ }
    }
    await loadPaiements();
    setLoading(false);
    setMsg('Paiements initialisés pour tous les élèves.');
  }

  async function savePayEdit() {
    if (!payEditId) return;
    try {
      await api.post('/paiement_update.php', { id: payEditId, ...payEditData });
      setPayEditId(null); setPayEditData({});
      await loadPaiements();
      if (selectedEleve) await loadElevePaiements(selectedEleve);
    } catch { setMsg('Erreur mise à jour paiement.'); }
  }

  async function exportCSV(type = 'eleves') {
    const token = sessionStorage.getItem('admin_token');
    const params = new URLSearchParams({ type });
    if (filterNiveau) params.set('niveau', filterNiveau);
    if (filterSexe) params.set('sexe', filterSexe);
    if (type === 'paiements') params.set('annee_scolaire', '2025-2026');
    const url = `${base}/export_csv.php?${params.toString()}`;
    try {
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) { setMsg('Export impossible.'); return; }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `liste_${type}_${filterNiveau || 'tous'}_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch { setMsg('Erreur export CSV.'); }
  }

  async function createActu(e) {
    e.preventDefault();
    if (!newActu.titre.trim() || !newActu.contenu.trim()) return;
    const fd = new FormData();
    fd.append('titre', newActu.titre);
    fd.append('contenu', newActu.contenu);
    if (actuImage) fd.append('image', actuImage);
    try {
      await api.post('/actualite_create.php', fd);
      setNewActu({ titre: '', contenu: '' }); setActuImage(null);
      await loadActus();
    } catch { setMsg('Erreur lors de la publication.'); }
  }

  async function validateInscription(id) {
    if (!window.confirm('Confirmer la validation après vérification sur place et signature de la fiche ?')) return;
    try {
      const { data } = await api.post('/inscription_validate.php', { id });
      setMsg(data.message || 'Inscription validée.');
      await loadList();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur lors de la validation.');
    }
  }

  async function deleteActu(id) {
    if (!window.confirm('Supprimer cette actualité ?')) return;
    try { await api.post('/actualite_delete.php', { id }); await loadActus(); }
    catch { setMsg('Erreur lors de la suppression.'); }
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterNiveau && r.niveau !== filterNiveau) return false;
      if (filterSexe && r.sexe !== filterSexe) return false;
      if (filterStatut && (r.statut || 'validee') !== filterStatut) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (r.nom || '').toLowerCase().includes(q) ||
          (r.prenom || '').toLowerCase().includes(q) ||
          (r.telephone || '').includes(q) ||
          (r.matricule || '').toLowerCase().includes(q) ||
          (r.parent_nom || '').toLowerCase().includes(q) ||
          String(r.id).includes(q);
      }
      return true;
    });
  }, [rows, search, filterNiveau, filterSexe, filterStatut]);

  const stats = useMemo(() => {
    const byNiveau = {};
    rows.forEach(r => {
      const n = r.niveau || 'Non défini';
      if (!byNiveau[n]) byNiveau[n] = { total: 0, M: 0, F: 0 };
      byNiveau[n].total++;
      if (r.sexe === 'Masculin') byNiveau[n].M++;
      else if (r.sexe === 'Féminin') byNiveau[n].F++;
    });
    return byNiveau;
  }, [rows]);

  const payResume = useMemo(() => {
    const byEleve = {};
    paiements.forEach(p => {
      const key = p.inscription_id;
      if (!byEleve[key]) {
        byEleve[key] = { id: key, nom: p.nom, prenom: p.prenom, matricule: p.matricule, niveau: p.niveau, sexe: p.sexe, total: 0, paye: 0, moisPaye: 0, moisTotal: 0 };
      }
      byEleve[key].total += parseFloat(p.montant) || 0;
      byEleve[key].paye += parseFloat(p.montant_paye) || 0;
      byEleve[key].moisTotal++;
      if (p.statut === 'paye') byEleve[key].moisPaye++;
    });
    let arr = Object.values(byEleve);
    if (payNiveau) arr = arr.filter(e => e.niveau === payNiveau);
    if (paySearch.trim()) {
      const q = paySearch.toLowerCase();
      arr = arr.filter(e => (e.nom || '').toLowerCase().includes(q) || (e.prenom || '').toLowerCase().includes(q) || (e.matricule || '').toLowerCase().includes(q));
    }
    return arr;
  }, [paiements, payNiveau, paySearch]);

  /* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
  if (!sessionOk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-4">
        <div className="animate-scale-in w-full max-w-md">
          <div className="mb-8 text-center">
            <img src="/assets/logo-principal.png" alt="Logo" className="mx-auto h-20 w-20 rounded-full ring-4 ring-emerald-400/30 transition-transform duration-500 hover:scale-105" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <h1 className="mt-4 text-2xl font-bold text-white">Administration</h1>
            <p className="mt-1 text-sm text-emerald-200">Centre Al Haramaine — C.H.M.C</p>
          </div>
          <div className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
            <h2 className="text-lg font-semibold text-white">Connexion sécurisée</h2>
            <p className="mt-1 text-xs text-emerald-300">Accès réservé au personnel autorisé.</p>
            {msg && <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{msg}</div>}
            <form className="mt-6 space-y-5" onSubmit={login}>
              <label className="block">
                <span className="text-sm font-medium text-emerald-100">Identifiant</span>
                <input className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" placeholder="Votre identifiant" required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-emerald-100">Mot de passe</span>
                <input type="password" className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" placeholder="••••••••" required />
              </label>
              <button type="submit" disabled={loading} className="btn-interactive w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 hover:shadow-emerald-900/30 disabled:opacity-50">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-200">
              <strong>Espace protégé</strong> — Cette page est réservée à l&apos;administration du centre.
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════ DASHBOARD ═══════════════════════ */
  const tabClass = (t) =>
    `btn-interactive flex-1 cursor-pointer rounded-md px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 sm:text-sm ${
      tab === t
        ? 'scale-[1.02] bg-white text-emerald-800 shadow-md'
        : 'text-slate-500 hover:bg-white/60 hover:text-emerald-700'
    }`;

  const statCards = [
    { label: 'Total élèves', value: rows.length },
    {
      label: 'Garçons / Filles',
      value: `${rows.filter((r) => r.sexe === 'Masculin').length} / ${rows.filter((r) => r.sexe === 'Féminin').length}`,
    },
    { label: 'Classes', value: Object.keys(stats).length },
    { label: 'Actualités', value: actus.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="animate-slide-down border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-principal.png" alt="Logo" className="h-10 w-10 rounded-full ring-2 ring-emerald-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div>
              <h1 className="text-lg font-bold text-emerald-950">Administration C.H.M.C</h1>
              <p className="text-xs text-slate-500">Gestion complète du centre</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { loadList(); loadPaiements(); loadActus(); }} className="btn-interactive cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Rafraîchir
            </button>
            <button type="button" onClick={logout} className="btn-interactive cursor-pointer rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="animate-fade-in mx-auto max-w-7xl px-4 py-6">
        {msg && (
          <div className="animate-slide-down mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {msg}
            <button type="button" className="ml-2 font-bold" onClick={() => setMsg('')}>✕</button>
          </div>
        )}

        {/* ── Statistiques rapides ── */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className="hover-lift animate-fade-in-up rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="text-xs font-medium uppercase text-slate-400">{card.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-900 transition-transform duration-300 hover:scale-105">{card.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 transition-all duration-300">
          <button type="button" onClick={() => setTab('inscriptions')} className={tabClass('inscriptions')}>
            Inscriptions ({rows.length})
          </button>
          <button type="button" onClick={() => setTab('classes')} className={tabClass('classes')}>
            Classes
          </button>
          <button type="button" onClick={() => setTab('paiements')} className={tabClass('paiements')}>
            Paiements
          </button>
          <button type="button" onClick={() => setTab('actualites')} className={tabClass('actualites')}>
            Actualités ({actus.length})
          </button>
        </div>

        {/* ═══════════════════════ TAB: INSCRIPTIONS ═══════════════════════ */}
        {tab === 'inscriptions' && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input type="text" placeholder="Rechercher (nom, matricule, téléphone...)" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>
              <select value={filterNiveau} onChange={(e) => setFilterNiveau(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
                <option value="">Toutes les classes</option>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={filterSexe} onChange={(e) => setFilterSexe(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
                <option value="">Tous les sexes</option>
                <option value="Masculin">Garçons</option>
                <option value="Féminin">Filles</option>
              </select>
              <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
                <option value="">Tous les statuts</option>
                <option value="en_attente_validation">À valider (fiche à signer)</option>
                <option value="validee">Validées</option>
              </select>
              <button type="button" onClick={generateMatricules} title="Format : 3 lettres du nom + année naissance + année scolaire + initiale du prénom (ex. DIA1526M)" className="rounded-lg bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
                Générer matricules
              </button>
              <button type="button" onClick={() => exportCSV('eleves')} className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-800 hover:bg-blue-100">
                Exporter CSV
              </button>
              <div className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800">
                {filtered.length} élève{filtered.length > 1 ? 's' : ''}
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
                        <th className="px-3 py-3">Matricule</th>
                        <th className="px-3 py-3">Statut</th>
                        <th className="px-3 py-3">Élève</th>
                        <th className="px-3 py-3">Classe</th>
                        <th className="px-3 py-3">Sexe</th>
                        <th className="px-3 py-3">Parent</th>
                        <th className="px-3 py-3">Tél.</th>
                        <th className="px-3 py-3">WhatsApp</th>
                        <th className="px-3 py-3">Date inscr.</th>
                        <th className="px-3 py-3">Docs</th>
                        <th className="px-3 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((r) => (
                        <tr key={r.id} className="transition-colors duration-200 hover:bg-emerald-50/50">
                          <td className="px-3 py-3 font-mono text-xs font-bold text-emerald-700">{r.matricule || <span className="text-slate-300">—</span>}</td>
                          <td className="px-3 py-3">
                            {(() => {
                              const s = STATUT_LABELS[r.statut || 'validee'] || STATUT_LABELS.validee;
                              return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.className}`}>{s.label}</span>;
                            })()}
                          </td>
                          <td className="px-3 py-3">
                            <p className="font-medium text-slate-900">{r.prenom} {r.nom}</p>
                            <p className="text-xs text-slate-500">né(e) le {r.date_naissance}</p>
                          </td>
                          <td className="px-3 py-3">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">{r.niveau}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.sexe === 'Masculin' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                              {r.sexe === 'Masculin' ? 'M' : 'F'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm">{r.parent_nom}</td>
                          <td className="px-3 py-3 text-xs">{r.telephone}</td>
                          <td className="px-3 py-3 text-xs">
                            <a href={`https://wa.me/${(r.whatsapp || '').replace(/\s/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 underline">{r.whatsapp}</a>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-500">{r.created_at?.split(' ')[0]}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1">
                              {['acte', 'bulletin', 'photo'].map((type) => (
                                <button key={type} type="button" className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200" onClick={() => downloadFile(r.id, type)} title={type}>
                                  {type === 'acte' ? '📄' : type === 'bulletin' ? '📋' : '📷'}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-1">
                              {r.statut === 'en_attente_validation' && (
                                <button type="button" className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-200" onClick={() => validateInscription(r.id)} title="Valider après signature sur place">
                                  ✓ Valider
                                </button>
                              )}
                              {r.fiche_token && (
                                <a href={`/inscription/fiche?id=${r.id}&t=${encodeURIComponent(r.fiche_token)}`} target="_blank" rel="noreferrer" className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                                  Fiche
                                </a>
                              )}
                              <button type="button" className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100" onClick={() => setEdit({
                                id: r.id, nom: r.nom, prenom: r.prenom, sexe: r.sexe,
                                date_naissance: r.date_naissance, niveau: r.niveau,
                                parent_nom: r.parent_nom, telephone: r.telephone,
                                whatsapp: r.whatsapp, adresse: r.adresse,
                              })}>
                                Modifier
                              </button>
                              <button type="button" className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100" onClick={() => removeRow(r.id)}>
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={11} className="px-4 py-12 text-center text-slate-400">{search || filterNiveau || filterSexe || filterStatut ? 'Aucun résultat pour ces filtres.' : 'Aucune inscription pour le moment.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal modification */}
            {edit.id && (
              <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <form className="animate-scale-in w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" onSubmit={saveEdit}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-emerald-950">Modifier l&apos;inscription #{edit.id}</h2>
                    <button type="button" className="text-2xl text-slate-400 hover:text-slate-700" onClick={() => setEdit(emptyEdit)}>✕</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.keys(emptyEdit).filter((k) => k !== 'id').map((key) => (
                      <label key={key} className="block text-sm">
                        <span className="font-medium text-slate-700">{fieldLabels[key] || key}</span>
                        {key === 'adresse' ? (
                          <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={edit[key]} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} rows={2} required />
                        ) : key === 'sexe' ? (
                          <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={edit[key]} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} required>
                            <option value="">—</option>
                            <option value="Masculin">Masculin</option>
                            <option value="Féminin">Féminin</option>
                          </select>
                        ) : key === 'niveau' ? (
                          <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={edit[key]} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} required>
                            <option value="">—</option>
                            {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        ) : (
                          <input type={key === 'date_naissance' ? 'date' : 'text'} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" value={edit[key]} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} required />
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={() => setEdit(emptyEdit)}>Annuler</button>
                    <button type="submit" className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Enregistrer</button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════ TAB: CLASSES ═══════════════════════ */}
        {tab === 'classes' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => exportCSV('eleves')} className="rounded-lg bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-800 hover:bg-blue-100">
                Exporter toutes les listes (CSV)
              </button>
            </div>

            {NIVEAUX.map(niveau => {
              const eleves = rows.filter(r => r.niveau === niveau);
              if (eleves.length === 0) return null;
              const garcons = eleves.filter(r => r.sexe === 'Masculin');
              const filles = eleves.filter(r => r.sexe === 'Féminin');
              return (
                <div key={niveau} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-emerald-50 px-4 py-3">
                    <div>
                      <h3 className="text-base font-bold text-emerald-900">{niveau}</h3>
                      <p className="text-xs text-emerald-700">{eleves.length} élève{eleves.length > 1 ? 's' : ''} — {garcons.length} garçon{garcons.length > 1 ? 's' : ''}, {filles.length} fille{filles.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setFilterNiveau(niveau); setFilterSexe('Masculin'); setTab('inscriptions'); }} className="rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                        Garçons
                      </button>
                      <button type="button" onClick={() => { setFilterNiveau(niveau); setFilterSexe('Féminin'); setTab('inscriptions'); }} className="rounded bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100">
                        Filles
                      </button>
                      <button type="button" onClick={() => { setFilterNiveau(niveau); setFilterSexe(''); setTab('inscriptions'); }} className="rounded bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200">
                        Voir tout
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Matricule</th>
                          <th className="px-4 py-2">Nom &amp; Prénom</th>
                          <th className="px-4 py-2">Sexe</th>
                          <th className="px-4 py-2">Date naiss.</th>
                          <th className="px-4 py-2">Parent</th>
                          <th className="px-4 py-2">Tél.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {eleves.map(r => (
                          <tr key={r.id} className="transition-colors duration-200 hover:bg-emerald-50/50">
                            <td className="px-4 py-2 font-mono text-xs font-bold text-emerald-700">{r.matricule || '—'}</td>
                            <td className="px-4 py-2 font-medium">{r.prenom} {r.nom}</td>
                            <td className="px-4 py-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.sexe === 'Masculin' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                                {r.sexe === 'Masculin' ? 'G' : 'F'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-xs text-slate-500">{r.date_naissance}</td>
                            <td className="px-4 py-2 text-sm">{r.parent_nom}</td>
                            <td className="px-4 py-2 text-xs">{r.telephone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {rows.length === 0 && (
              <div className="rounded-xl bg-white p-12 text-center text-slate-400 shadow-sm">Aucune inscription enregistrée.</div>
            )}
          </div>
        )}

        {/* ═══════════════════════ TAB: PAIEMENTS ═══════════════════════ */}
        {tab === 'paiements' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input type="text" placeholder="Rechercher un élève..." value={paySearch} onChange={(e) => setPaySearch(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>
              <select value={payNiveau} onChange={(e) => setPayNiveau(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
                <option value="">Toutes les classes</option>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button type="button" onClick={initAllPaiements} disabled={loading} className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50">
                {loading ? 'En cours...' : 'Initialiser paiements (tous)'}
              </button>
              <button type="button" onClick={() => exportCSV('paiements')} className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-800 hover:bg-blue-100">
                Exporter paiements (CSV)
              </button>
            </div>

            {/* Résumé par élève */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Matricule</th>
                      <th className="px-3 py-3">Élève</th>
                      <th className="px-3 py-3">Classe</th>
                      <th className="px-3 py-3">Total dû</th>
                      <th className="px-3 py-3">Total payé</th>
                      <th className="px-3 py-3">Reste</th>
                      <th className="px-3 py-3">Mois payés</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payResume.map((e) => {
                      const reste = e.total - e.paye;
                      const pct = e.total > 0 ? Math.round((e.paye / e.total) * 100) : 0;
                      return (
                        <tr key={e.id} className="transition-colors duration-200 hover:bg-emerald-50/50">
                          <td className="px-3 py-3 font-mono text-xs font-bold text-emerald-700">{e.matricule || '—'}</td>
                          <td className="px-3 py-3 font-medium">{e.prenom} {e.nom}</td>
                          <td className="px-3 py-3"><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">{e.niveau}</span></td>
                          <td className="px-3 py-3 text-xs font-semibold">{e.total.toLocaleString('fr-FR')} F</td>
                          <td className="px-3 py-3 text-xs font-semibold text-emerald-700">{e.paye.toLocaleString('fr-FR')} F</td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-bold ${reste > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              {reste.toLocaleString('fr-FR')} F
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-500">{e.moisPaye}/{e.moisTotal}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <button type="button" onClick={() => { setSelectedEleve(e.id); loadElevePaiements(e.id); }} className="rounded bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
                              Détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {payResume.length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                        {paiements.length === 0 ? 'Aucun paiement initialisé. Cliquez sur "Initialiser paiements" pour commencer.' : 'Aucun résultat.'}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal détail paiements d'un élève */}
            {selectedEleve && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-emerald-950">
                      Paiements — {elevePaiements[0]?.prenom} {elevePaiements[0]?.nom} ({elevePaiements[0]?.matricule || 'N/A'})
                    </h2>
                    <button type="button" className="text-2xl text-slate-400 hover:text-slate-700" onClick={() => { setSelectedEleve(null); setPayEditId(null); }}>✕</button>
                  </div>
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Mois</th>
                        <th className="px-3 py-2">Montant dû</th>
                        <th className="px-3 py-2">Payé</th>
                        <th className="px-3 py-2">Statut</th>
                        <th className="px-3 py-2">Date paiem.</th>
                        <th className="px-3 py-2">Note</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {elevePaiements.map((p) => (
                        <tr key={p.id} className="transition-colors duration-200 hover:bg-emerald-50/50">
                          <td className="px-3 py-2 font-semibold">{p.mois}</td>
                          <td className="px-3 py-2 text-xs">{parseFloat(p.montant).toLocaleString('fr-FR')} F</td>
                          {payEditId === p.id ? (
                            <>
                              <td className="px-3 py-2">
                                <input type="number" className="w-24 rounded border border-slate-300 px-2 py-1 text-xs" value={payEditData.montant_paye ?? ''} onChange={(e) => setPayEditData({ ...payEditData, montant_paye: e.target.value })} />
                              </td>
                              <td className="px-3 py-2">
                                <select className="rounded border border-slate-300 px-2 py-1 text-xs" value={payEditData.statut ?? ''} onChange={(e) => setPayEditData({ ...payEditData, statut: e.target.value })}>
                                  <option value="non_paye">Non payé</option>
                                  <option value="partiel">Partiel</option>
                                  <option value="paye">Payé</option>
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <input type="date" className="rounded border border-slate-300 px-2 py-1 text-xs" value={payEditData.date_paiement ?? ''} onChange={(e) => setPayEditData({ ...payEditData, date_paiement: e.target.value })} />
                              </td>
                              <td className="px-3 py-2">
                                <input type="text" className="w-28 rounded border border-slate-300 px-2 py-1 text-xs" placeholder="Note..." value={payEditData.note ?? ''} onChange={(e) => setPayEditData({ ...payEditData, note: e.target.value })} />
                              </td>
                              <td className="px-3 py-2 flex gap-1">
                                <button type="button" onClick={savePayEdit} className="rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-500">OK</button>
                                <button type="button" onClick={() => setPayEditId(null)} className="rounded bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300">Non</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-3 py-2 text-xs font-semibold text-emerald-700">{parseFloat(p.montant_paye).toLocaleString('fr-FR')} F</td>
                              <td className="px-3 py-2">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                  p.statut === 'paye' ? 'bg-emerald-100 text-emerald-800' :
                                  p.statut === 'partiel' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {p.statut === 'paye' ? 'Payé' : p.statut === 'partiel' ? 'Partiel' : 'Non payé'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-xs text-slate-500">{p.date_paiement || '—'}</td>
                              <td className="px-3 py-2 text-xs text-slate-400">{p.note || '—'}</td>
                              <td className="px-3 py-2">
                                <button type="button" onClick={() => {
                                  setPayEditId(p.id);
                                  setPayEditData({ montant_paye: p.montant_paye, statut: p.statut, date_paiement: p.date_paiement || '', note: p.note || '' });
                                }} className="rounded bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100">
                                  Modifier
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {elevePaiements.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          Aucun paiement initialisé pour cet élève.
                          <button type="button" onClick={() => initPaiements(selectedEleve)} className="ml-2 text-emerald-700 underline hover:text-emerald-900">Initialiser maintenant</button>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════ TAB: ACTUALITÉS ═══════════════════════ */}
        {tab === 'actualites' && (
          <div className="space-y-6">
            <form onSubmit={createActu} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-emerald-950">Publier une actualité</h2>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Titre</span>
                  <input type="text" className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none" value={newActu.titre} onChange={(e) => setNewActu({ ...newActu, titre: e.target.value })} placeholder="Titre de l'actualité" required />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Contenu</span>
                  <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none" value={newActu.contenu} onChange={(e) => setNewActu({ ...newActu, contenu: e.target.value })} rows={4} placeholder="Contenu de l'actualité..." required />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Image (optionnel)</span>
                  <input type="file" accept="image/*" className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100" onChange={(e) => setActuImage(e.target.files[0] || null)} />
                </label>
                <button type="submit" className="rounded-lg bg-emerald-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Publier</button>
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-bold text-emerald-950">Actualités publiées</h2>
              </div>
              {actus.length === 0 ? (
                <p className="px-6 py-12 text-center text-slate-400">Aucune actualité publiée.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {actus.map((a) => (
                    <div key={a.id} className="flex items-start gap-4 px-6 py-4">
                      {a.image && (
                        <img src={actuImageUrl(a.image, 128)} alt="" className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{a.titre}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.contenu}</p>
                        <p className="mt-1 text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <button type="button" onClick={() => deleteActu(a.id)} className="rounded bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">Supprimer</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
