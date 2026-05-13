import { useState, useRef } from 'react';
import { api } from '../api/client.js';

const niveaux = [
  'Maternelle (4-5 ans)',
  'CP1',
  'CP2',
  'CE1',
  'CE2',
  'CM1',
  'CM2',
];

const STEPS = [
  { id: 1, label: 'Informations élève' },
  { id: 2, label: 'Informations parent' },
  { id: 3, label: 'Pièces jointes' },
];

const initial = {
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

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

function validateFile(file, label) {
  if (!file) return `${label} est obligatoire.`;
  if (file.size > MAX_SIZE) return `${label} ne doit pas dépasser 5 Mo.`;
  if (!ALLOWED_TYPES.includes(file.type)) return `${label} : seuls les formats PDF, JPG et PNG sont acceptés.`;
  return '';
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : isActive
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100'
                      : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isActive || isCompleted ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 mt-[-1.25rem] h-0.5 w-12 rounded-full transition-colors duration-300 sm:w-20 md:w-28 ${
                  currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InputField({ label, name, type = 'text', value, onChange, required = true, placeholder = '', ...rest }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
        {...rest}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder = 'Sélectionnez...', required = true }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ label, name, file, onFile, accept = '.pdf,.jpg,.jpeg,.png', hint }) {
  const inputRef = useRef(null);
  const hasFile = !!file;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`group relative cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          hasFile
            ? 'border-emerald-300 bg-emerald-50/50'
            : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => onFile(name, e)}
          className="hidden"
        />
        {hasFile ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate text-sm font-medium text-emerald-700">{file.name}</span>
            <span className="text-xs text-emerald-600">({formatFileSize(file.size)})</span>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-8 w-8 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="mt-1 text-sm text-slate-500">Cliquez pour sélectionner</p>
          </>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function Inscription() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState({ acte: null, bulletin: null, photo: null });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onFile(name, e) {
    const file = e.target.files?.[0] || null;
    setFiles((f) => ({ ...f, [name]: file }));
  }

  function validateStep(s) {
    if (s === 1) {
      const { nom, prenom, sexe, date_naissance, niveau } = form;
      if (!nom.trim() || !prenom.trim() || !sexe || !date_naissance || !niveau) {
        setStatus({ type: 'error', message: 'Veuillez remplir tous les champs de cette étape.' });
        return false;
      }
    }
    if (s === 2) {
      const { parent_nom, telephone, whatsapp, adresse } = form;
      if (!parent_nom.trim() || !telephone.trim() || !whatsapp.trim() || !adresse.trim()) {
        setStatus({ type: 'error', message: 'Veuillez remplir tous les champs de cette étape.' });
        return false;
      }
    }
    if (s === 3) {
      const errs = [
        validateFile(files.acte, "Acte de naissance"),
        validateFile(files.bulletin, 'Bulletin'),
        validateFile(files.photo, "Photo d'identité"),
      ].filter(Boolean);
      if (errs.length) {
        setStatus({ type: 'error', message: errs.join(' ') });
        return false;
      }
    }
    setStatus({ type: '', message: '' });
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goPrev() {
    setStatus({ type: '', message: '' });
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateStep(3)) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('acte_naissance', files.acte);
    fd.append('bulletin', files.bulletin);
    fd.append('photo', files.photo);

    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const { data } = await api.post('/inscription.php', fd);
      setStatus({ type: 'success', message: data.message || 'Inscription enregistrée avec succès ! Nous vous contacterons prochainement.' });
      setForm(initial);
      setFiles({ acte: null, bulletin: null, photo: null });
      setStep(1);
      formRef.current?.reset();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Une erreur est survenue. Veuillez réessayer.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }

  const summaryFields = [
    { label: 'Nom', value: form.nom },
    { label: 'Prénom', value: form.prenom },
    { label: 'Sexe', value: form.sexe },
    { label: 'Date de naissance', value: form.date_naissance },
    { label: 'Niveau', value: form.niveau },
    { label: 'Parent / Tuteur', value: form.parent_nom },
    { label: 'Téléphone', value: form.telephone },
    { label: 'WhatsApp', value: form.whatsapp },
    { label: 'Adresse', value: form.adresse },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* ── En-tête ── */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Inscription en ligne
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Centre de Formation Islamique Al Haramaine — Remplissez le formulaire ci-dessous
            pour inscrire votre enfant. Toutes les informations sont traitées de manière confidentielle.
          </p>
        </div>

        {/* ── Indicateur d'étapes ── */}
        <div className="mb-8">
          <StepIndicator currentStep={step} />
        </div>

        {/* ── Messages ── */}
        {status.message && (
          <div
            role="alert"
            className={`mb-6 flex items-start gap-3 rounded-xl border px-5 py-4 text-sm ${
              status.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {status.type === 'success' ? (
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <p>{status.message}</p>
          </div>
        )}

        {/* ── Formulaire ── */}
        <form ref={formRef} onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8">

            {/* Étape 1 — Informations élève */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">1</span>
                  Informations de l'élève
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField label="Nom" name="nom" value={form.nom} onChange={onChange} placeholder="Ex : Diallo" />
                  <InputField label="Prénom" name="prenom" value={form.prenom} onChange={onChange} placeholder="Ex : Aminata" />
                  <SelectField
                    label="Sexe"
                    name="sexe"
                    value={form.sexe}
                    onChange={onChange}
                    options={[
                      { value: 'Masculin', label: 'Masculin' },
                      { value: 'Féminin', label: 'Féminin' },
                    ]}
                    placeholder="— Choisir —"
                  />
                  <InputField label="Date de naissance" name="date_naissance" type="date" value={form.date_naissance} onChange={onChange} />
                </div>
                <SelectField
                  label="Niveau souhaité"
                  name="niveau"
                  value={form.niveau}
                  onChange={onChange}
                  options={niveaux}
                  placeholder="— Sélectionnez un niveau —"
                />
              </div>
            )}

            {/* Étape 2 — Informations parent */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">2</span>
                  Informations du parent / tuteur
                </h2>
                <InputField label="Nom complet du parent / tuteur" name="parent_nom" value={form.parent_nom} onChange={onChange} placeholder="Ex : Mamadou Diallo" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={onChange} placeholder="Ex : 66 00 00 00" />
                  <InputField label="WhatsApp" name="whatsapp" type="tel" value={form.whatsapp} onChange={onChange} placeholder="Ex : 66 00 00 00" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="adresse" className="block text-sm font-semibold text-slate-700">
                    Adresse <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="adresse"
                    name="adresse"
                    value={form.adresse}
                    onChange={onChange}
                    rows={3}
                    required
                    placeholder="Quartier, commune, ville..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Étape 3 — Pièces jointes + récapitulatif */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">3</span>
                  Pièces jointes
                </h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  <FileUpload
                    label="Acte de naissance"
                    name="acte"
                    file={files.acte}
                    onFile={onFile}
                    hint="PDF, JPG ou PNG — max 5 Mo"
                  />
                  <FileUpload
                    label="Bulletin scolaire"
                    name="bulletin"
                    file={files.bulletin}
                    onFile={onFile}
                    hint="PDF, JPG ou PNG — max 5 Mo"
                  />
                  <FileUpload
                    label="Photo d'identité"
                    name="photo"
                    file={files.photo}
                    onFile={onFile}
                    accept=".jpg,.jpeg,.png"
                    hint="JPG ou PNG — max 5 Mo"
                  />
                </div>

                {/* Récapitulatif */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="mb-3 text-sm font-bold text-slate-800">Récapitulatif de l'inscription</h3>
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {summaryFields.map(({ label, value }) => (
                      <div key={label} className="flex gap-2">
                        <dt className="font-medium text-slate-500">{label} :</dt>
                        <dd className="font-semibold text-slate-800">{value || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-200 pt-3">
                    {[
                      { label: 'Acte de naissance', file: files.acte },
                      { label: 'Bulletin', file: files.bulletin },
                      { label: 'Photo', file: files.photo },
                    ].map(({ label, file }) => (
                      <span
                        key={label}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          file ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {file ? (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 sm:px-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Précédent
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
              >
                Suivant
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer l'inscription
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* ── Rappel pièces physiques ── */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-3">
            <svg className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Pièces à fournir physiquement au centre
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Après votre pré-inscription en ligne, veuillez vous présenter au centre avec les documents originaux suivants :
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-amber-800">
                {[
                  "Extrait d'acte de naissance ou jugement supplétif (original + copie)",
                  'Dernier bulletin scolaire (original + copie)',
                  "4 photos d'identité récentes",
                  'Certificat de résidence',
                  "Copie de la carte d'identité du parent / tuteur",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
