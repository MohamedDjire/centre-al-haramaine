export default function About() {
  const valeurs = [
    {
      emoji: '🏆',
      titre: 'Excellence',
      description:
        "Nous visons l'excellence dans l'apprentissage du Coran et dans la scolarité classique. Chaque élève est poussé à donner le meilleur de lui-même, dans un cadre qui valorise l'effort et la persévérance.",
    },
    {
      emoji: '📐',
      titre: 'Discipline',
      description:
        "La rigueur et la régularité sont au cœur de notre méthode. Les élèves apprennent le respect des horaires, des enseignants et du cadre scolaire, fondements d'une éducation réussie.",
    },
    {
      emoji: '🤲',
      titre: 'Bienveillance',
      description:
        "L'accompagnement se fait dans la douceur et la compréhension. Nous croyons qu'un environnement bienveillant est la clé pour que chaque enfant s'épanouisse et progresse sereinement.",
    },
    {
      emoji: '🔍',
      titre: 'Transparence',
      description:
        'Les familles sont informées en permanence : frais de scolarité clairement affichés, communication régulière via WhatsApp, et réunions parents-enseignants tout au long de l\u2019année.',
    },
  ];

  const etapesPedagogie = [
    {
      numero: '01',
      titre: 'Mémorisation du Coran (Tahfîdh)',
      description:
        "Les élèves suivent un programme structuré de mémorisation avec des séances quotidiennes de récitation, de révision et d'évaluation. Chaque niveau est validé par un suivi individuel rigoureux.",
    },
    {
      numero: '02',
      titre: 'Enseignement en langue arabe',
      description:
        "Grammaire, conjugaison, expression orale et écrite : l'arabe est enseigné comme langue vivante pour permettre aux élèves de comprendre directement le Coran et les textes de référence.",
    },
    {
      numero: '03',
      titre: 'Scolarité en français',
      description:
        "Le programme en français couvre les matières fondamentales (mathématiques, sciences, français, histoire-géographie) afin que les élèves puissent poursuivre leur cursus dans le système éducatif ivoirien.",
    },
    {
      numero: '04',
      titre: 'Suivi personnalisé',
      description:
        "Chaque élève bénéficie d'un suivi individuel adapté à son rythme d'apprentissage. Des bilans réguliers permettent d'ajuster la pédagogie et de maintenir un dialogue constant avec les familles.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* ── En-tête avec bannière ── */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg">
        <img
          src="/assets/banniere.png"
          alt="Bannière du Centre Al Haramaine"
          className="h-64 w-full object-cover sm:h-80 lg:h-96"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
            C.H.M.C
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
            Centre Al Haramaine pour la Mémorisation du Noble Coran
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-emerald-100 sm:text-base">
            Un établissement dédié à la formation coranique et académique, au service de la jeunesse
            musulmane d'Abidjan et de toute la Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* ── Notre histoire ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Qui sommes-nous
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
            Notre histoire
          </h2>
          <div className="mt-6 h-1 w-16 rounded-full bg-emerald-700" />

          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700">
            <p>
              Le <strong className="text-emerald-900">Centre Al Haramaine pour la Mémorisation du Noble Coran (C.H.M.C)</strong> a
              été fondé avec une ambition claire : offrir aux enfants un cadre d'apprentissage où la
              mémorisation du Saint Coran et l'éducation académique coexistent en parfaite harmonie.
              Situé à <strong className="text-emerald-900">Abidjan, Abobo PK18 Résidentiel</strong>,
              le centre est né de la volonté d'un groupe de croyants convaincus que l'avenir de la
              communauté passe par une jeunesse enracinée dans les valeurs coraniques et armée pour
              les défis du monde moderne.
            </p>
            <p>
              Depuis ses débuts, le centre n'a cessé de grandir, accueillant chaque année de
              nouvelles promotions d'élèves venus de différents quartiers d'Abidjan et parfois
              d'autres villes de Côte d'Ivoire. Grâce à la confiance des familles et au dévouement
              de son équipe pédagogique, le C.H.M.C s'est imposé comme une référence dans le domaine
              de l'enseignement coranique structuré en milieu urbain.
            </p>
            <p>
              L'histoire du centre est aussi celle de ses élèves : des enfants qui, jour après jour,
              mémorisent les versets du Livre d'Allah, progressent en arabe et en français, et
              développent les qualités humaines qui feront d'eux des citoyens accomplis et des
              serviteurs dévoués de leur communauté.
            </p>
          </div>
        </div>
      </section>

      {/* ── Notre mission ── */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-6 text-white shadow-lg sm:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Ce qui nous anime
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Notre mission</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-emerald-400" />

          <p className="mt-8 text-base leading-relaxed text-emerald-50">
            Le Centre Al Haramaine a pour mission de former une génération de jeunes musulmans
            qui allient <strong>la maîtrise du Coran</strong> à une <strong>éducation académique solide</strong>.
            Nous croyons fermement que la mémorisation du Livre d'Allah ne doit pas se faire au
            détriment de la scolarité classique, mais au contraire en synergie avec elle.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold">📖 Encadrement coranique</h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100">
              Un programme de tahfîdh (mémorisation) rigoureux, encadré par des enseignants
              qualifiés qui veillent à la qualité de la récitation (tajwîd), à la régularité des
              révisions et à l'atteinte des objectifs de mémorisation fixés pour chaque élève.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold">🎓 Scolarité classique</h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100">
              En parallèle du programme coranique, les élèves suivent un cursus en français couvrant
              les matières fondamentales : mathématiques, sciences, français, histoire-géographie.
              L'objectif est de garantir leur réussite dans le système éducatif national.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold">🕌 Éducation islamique</h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100">
              Au-delà de la mémorisation, les élèves reçoivent une éducation islamique complète :
              apprentissage des fondements de la foi, de la jurisprudence (fiqh), de la biographie
              prophétique (sîra) et des bonnes manières islamiques (âdâb).
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold">👨‍👩‍👧‍👦 Lien avec les familles</h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100">
              Un suivi régulier est assuré avec les parents via des réunions, des bulletins
              périodiques et un groupe WhatsApp dédié. Les familles sont pleinement impliquées dans
              le parcours de leurs enfants.
            </p>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Ce qui nous définit
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">Nos valeurs</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-emerald-700" />
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600">
            Quatre piliers guident chacune de nos actions et façonnent l'environnement dans lequel
            nos élèves grandissent et s'épanouissent.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valeurs.map((v) => (
            <article
              key={v.titre}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-3xl transition-transform group-hover:scale-110">
                {v.emoji}
              </div>
              <h3 className="mt-4 text-lg font-bold text-emerald-900">{v.titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Notre pédagogie ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Comment nous enseignons
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
            Notre pédagogie
          </h2>
          <div className="mt-6 h-1 w-16 rounded-full bg-emerald-700" />

          <p className="mt-8 text-base leading-relaxed text-slate-700">
            Le Centre Al Haramaine a développé une <strong className="text-emerald-900">double approche pédagogique</strong> unique
            qui articule harmonieusement l'enseignement en langue arabe et le programme académique
            en français. Cette méthode permet aux élèves de naviguer entre deux univers linguistiques
            et culturels, enrichissant ainsi leur vision du monde et multipliant leurs opportunités.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-6">
          {etapesPedagogie.map((e) => (
            <div
              key={e.numero}
              className="flex gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md sm:gap-6 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-lg font-extrabold text-white">
                {e.numero}
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900">{e.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{e.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="font-semibold text-emerald-900">
            🕐 Une journée type au centre
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">07h00</span>
              <span>Accueil et prière du matin (Fajr pour les internes)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">07h30</span>
              <span>Séance de mémorisation du Coran</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">09h30</span>
              <span>Cours de langue arabe (grammaire, expression)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">11h30</span>
              <span>Pause et prière de Dhuhr</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">12h30</span>
              <span>Cours en français (maths, sciences, français)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">15h00</span>
              <span>Révision du Coran et récitation individuelle</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">16h30</span>
              <span>Activités éducatives et sportives</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-emerald-800">17h30</span>
              <span>Fin de journée et sortie des élèves</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Le mot du directeur ── */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white shadow-lg sm:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Un message pour vous
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Le mot du directeur</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-emerald-400" />

          <div className="mt-10 rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur-sm sm:p-10">
            <p className="text-3xl leading-snug font-bold sm:text-4xl" dir="rtl" lang="ar">
              ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾
            </p>
            <p className="mt-4 text-sm italic text-emerald-200">
              « Certes, ce Coran guide vers ce qu'il y a de plus droit. »
              <span className="ml-2 not-italic text-emerald-300">— Sourate Al-Isrâ', verset 9</span>
            </p>
          </div>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-emerald-50">
            <p>
              Chers parents, chers tuteurs,
            </p>
            <p>
              C'est avec une immense gratitude envers Allah ﷻ que nous poursuivons cette noble
              mission d'enseigner et de transmettre le Livre d'Allah à nos enfants. Le Centre
              Al Haramaine est bien plus qu'une école : c'est un espace de vie, de croissance
              spirituelle et intellectuelle, où chaque enfant est considéré comme un dépôt sacré
              (amâna) qui nous a été confié.
            </p>
            <p>
              Notre engagement est de fournir à vos enfants un enseignement de qualité, dans un
              environnement sain et structuré, qui leur permettra de devenir des porteurs du Coran
              (hamalat al-Qur'ân) et des citoyens instruits, capables de contribuer positivement
              à leur société.
            </p>
            <p>
              Nous comptons sur votre soutien, votre confiance et votre implication pour mener
              à bien cette mission. Ensemble, avec l'aide d'Allah, nous bâtissons l'avenir de
              nos enfants.
            </p>
            <p className="mt-6 font-semibold text-emerald-200">
              — La Direction du Centre Al Haramaine
            </p>
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            En quelques chiffres
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
            Le centre en bref
          </h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-emerald-700" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { chiffre: '3', label: 'Langues d\'enseignement', detail: 'Arabe, français, tahfîdh' },
            { chiffre: '2', label: 'Programmes parallèles', detail: 'Coranique et académique' },
            { chiffre: '100%', label: 'Suivi personnalisé', detail: 'Chaque élève est accompagné' },
            { chiffre: '∞', label: 'Engagement', detail: 'Au service du Coran et de la Oumma' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
            >
              <p className="text-3xl font-extrabold text-emerald-800">{item.chiffre}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-900">{item.label}</p>
              <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Logos et cachet officiel ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Identité visuelle
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
            Nos logos et cachet officiel
          </h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-emerald-700" />
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600">
            Le logo et le cachet officiel du Centre Al Haramaine sont utilisés sur tous nos
            documents administratifs, certificats et correspondances. Ils garantissent
            l'authenticité de nos supports.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <img
                src="/assets/logo-principal.png"
                alt="Logo principal du Centre Al Haramaine"
                className="h-36 w-36 object-contain sm:h-44 sm:w-44"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-emerald-900">Logo principal</p>
            <p className="mt-1 text-xs text-slate-500">Utilisé sur le site et les documents</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-6">
              <img
                src="/assets/logo-cachet.png"
                alt="Cachet officiel du Centre Al Haramaine"
                className="h-36 w-36 rounded-full object-contain sm:h-44 sm:w-44"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-emerald-900">Cachet officiel</p>
            <p className="mt-1 text-xs text-slate-500">Apposé sur les certificats et attestations</p>
          </div>
        </div>
      </section>

      {/* ── Localisation ── */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-6 text-white shadow-lg sm:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Où nous trouver
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Notre localisation</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-emerald-400" />

          <div className="mt-8 space-y-4 text-base text-emerald-50">
            <p>
              📍 <strong>Adresse :</strong> Abobo PK18 Résidentiel, Abidjan — Côte d'Ivoire
            </p>
            <p>
              Le centre est facilement accessible depuis les principaux axes routiers d'Abobo.
              N'hésitez pas à nous contacter pour obtenir des indications précises ou pour
              planifier une visite.
            </p>
          </div>

          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm">
            <span className="text-lg">🕌</span>
            <span>
              Les inscriptions sont ouvertes — rejoignez la famille Al Haramaine !
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
