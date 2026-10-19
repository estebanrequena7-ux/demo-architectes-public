/* ============================================================
   VALCOURT & MARCHON ARCHITECTES — data.js
   ============================================================
   TEMPLATE RÉUTILISABLE · MODE D'EMPLOI
   ────────────────────────────────────────────────────────────
   Pour créer le site d'un nouveau cabinet d'architectes :

   1. Modifiez UNIQUEMENT ce fichier (et le dossier images/).
      Nom, textes, projets, équipe, coordonnées, images :
      tout le contenu est ici. render.js l'injecte dans les pages.

   2. Images : déposez les photos du client dans scripts/ (voir
      scripts/build-images.py : une ligne par image, avec son
      cadrage), puis lancez  python3 scripts/build-images.py
      Le script produit images/<nom>-<largeur>.avif et .webp.
      Ici, une image se déclare ainsi :
        { src: 'cadran-1', alt: 'Description pour les lecteurs
          d’écran', widths: [480, 800, 1200, 1800], ratio: '4/3' }

   3. Écriture des textes :
      - Écrivez normalement, avec des espaces ordinaires.
      - Pas d'espace avant une virgule ou un point.
      - render.js pose lui-même les espaces insécables (avant
        « : ; ! ? », dans les nombres et les unités).
      - *mot* entre astérisques = mot mis en accent (couleur).
      - Les surfaces sont des nombres (surface: 1920), pas du texte.

   4. Mise en ligne : sh scripts/deploy.sh
      Le déploiement génère les pages : un script (scripts/build.mjs)
      injecte ce fichier dans le HTML de chaque page, pour que tout
      le texte soit dans le code source, sans JavaScript. Vous ne
      modifiez toujours que data.js : relancez simplement le
      déploiement après chaque changement de texte.

   5. Ne touchez pas à :
        index.html · projets.html · agence.html
        style.css · tokens.css · main.js · render.js
      Ces fichiers contiennent le design et les animations,
      ils restent identiques pour tous les clients.

   6. Bandeau « démo » : mettez  demo: null  pour le retirer.
      noindex : retirez la balise robots des 3 pages et la ligne
      X-Robots-Tag de _headers au moment de la mise en ligne.
   ============================================================ */

var SITE_DATA = {

  /* ── Identité ───────────────────────────────────────────────── */
  site: {
    name:     'Valcourt & Marchon',
    suffix:   'Architectes',
    city:     'Lyon',
    founded:  2014,
    lang:     'fr',
    // Palette de couleur : 'vert' (vert profond + sauge) ou 'sienne' (terre de Sienne + sable)
    palette:  'vert',
    // Texte du bandeau en bas de page ; null pour le retirer
    demo:     'Démo réalisée par Atelier Requena, cabinet fictif.',
    // Bandeau fixe, visible sur toutes les pages (obligatoire sur une démo) ; null pour le retirer
    banner:   'Site de démonstration – entreprise fictive',
  },

  /* ── Navigation (3 pages) ───────────────────────────────────── */
  nav: [
    { label: 'Accueil',          href: '/',            page: 'home' },
    { label: 'Projets',          href: '/projets',     page: 'projects' },
    { label: 'Agence & contact', href: '/agence',       page: 'agency' },
  ],
  menuLabel: 'Menu',
  menuCloseLabel: 'Fermer',
  skipLabel: 'Aller au contenu',

  /* ── Méta SEO par page ──────────────────────────────────────── */
  meta: {
    home: {
      title: 'Valcourt & Marchon Architectes — Lyon',
      description: 'Cabinet d’architectes à Lyon : logements, équipements publics, réhabilitations et maisons individuelles. Peu de gestes, bien placés.',
    },
    projects: {
      title: 'Projets — Valcourt & Marchon Architectes',
      description: 'Une sélection de six projets dans l’agglomération lyonnaise : logements collectifs, réhabilitation, médiathèque et maisons individuelles.',
    },
    agency: {
      title: 'Agence et contact — Valcourt & Marchon Architectes',
      description: 'Une équipe de six personnes à Lyon 7e. Présentation de l’agence, adresse, plan d’accès et formulaire de contact.',
    },
  },

  /* ── Accueil ────────────────────────────────────────────────── */
  home: {
    eyebrow: 'Architectes · Lyon · Depuis 2014',
    title:   'Peu de gestes, bien placés.',
    hero: {
      // Phrase qui dit tout de suite qui, où, quoi
      statement: 'Cabinet d’architectes à Lyon — logements, réhabilitations, équipements publics',
      primary:   { label: 'Voir nos projets',     href: '/projets' },
      secondary: { label: 'Parler d’un projet',   href: '/agence#contact' },
      project: 'mediatheque',   // projet légendé sur la photo
      image: { src: 'hero', mobile: 'hero-m', ratio: '8/5', mobileRatio: '3/5', widths: [480, 800, 1200, 1800, 2400],
               alt: 'Escalier monolithe en béton clair vu de face : deux volées et un palier dessinent une diagonale sur un mur de béton banché.' },
    },

    // Ce que nous faisons : 3 métiers. `type` = identifiant de data.types (lien vers les projets filtrés),
    // `project` = projet dont la photo de couverture illustre le métier.
    services: {
      label: 'Ce que nous faisons',
      count: 'Trois métiers',
      title: 'Trois métiers, une même exigence.',
      intro: 'Nous sommes un cabinet de six personnes installé à Lyon. Un bâtiment juste dit peu de choses, et les dit bien.',
      items: [
        { title: 'Logements collectifs', type: 'logements', project: 'ormes',
          text: 'Des logements traversants, de vrais extérieurs, des charges maîtrisées.',
          cta: 'Voir les logements' },
        { title: 'Réhabilitation', type: 'rehabilitation', project: 'minoterie',
          text: 'Transformer l’existant plutôt que le démolir : garder la structure, ouvrir la lumière.',
          cta: 'Voir les réhabilitations' },
        { title: 'Équipements publics', type: 'equipement', project: 'mediatheque',
          text: 'Médiathèques, salles, lieux de rencontre : des bâtiments simples, ouverts à tous.',
          cta: 'Voir les équipements' },
      ],
    },

    // Chiffres clés du cabinet (fixés à la main : les six projets du site ne sont qu'une sélection).
    // Pour les calculer depuis ce fichier, remplacez `value: …` par `from: 'years'` (année en cours − site.founded),
    // `from: 'count'` (nombre de projets de data.projects) ou `from: 'surface'` (somme de leurs surfaces).
    stats: {
      label: 'Le cabinet en chiffres',
      count: 'Depuis 2014',
      items: [
        { value: 12,    label: 'années d’activité' },
        { value: 40,    label: 'projets livrés' },
        { value: 38000, label: 'm² construits' },
      ],
    },

    featured: {
      label:  'Projets à la une',
      slugs:  ['cadran', 'minoterie', 'mediatheque', 'verger'],
      of:     'sur',
      note:   'Maisons, logements, équipements : une sélection de six projets dans l’agglomération lyonnaise.',
      cta:    'Voir la sélection',
    },

    steps: {
      label: 'Comment on travaille',
      count: 'Quatre étapes',
      title: 'De l’esquisse à la livraison, les mêmes interlocuteurs.',
      items: [
        { title: 'Esquisse', duration: 'Environ 2 mois',
          text: 'Nous relevons le site, écoutons le programme et proposons un parti en plans et en maquette.' },
        { title: 'Permis', duration: '3 à 5 mois',
          text: 'Nous montons le dossier, le déposons et suivons l’instruction jusqu’à l’autorisation.' },
        { title: 'Chantier', duration: '12 à 24 mois',
          text: 'Nous sommes sur place chaque semaine, avec les entreprises, pour tenir le dessin et les délais.' },
        { title: 'Livraison', duration: 'Garantie d’un an',
          text: 'Réception, levée des réserves, puis suivi pendant l’année de parfait achèvement.' },
      ],
    },

    manifest: {
      label:  'Manifeste',
      text:   'Nous construisons peu, mais pour longtemps. La lumière, la matière et la mesure *suffisent* à faire un lieu.',
    },

    contact: {
      label: 'Contact',
      title: 'Un projet à Lyon ou aux alentours ? *Parlons-en.*',
      text:  'Un premier échange est gratuit. Nous vous répondons sous deux jours ouvrés.',
    },
  },

  /* ── Types de projets (filtre) ──────────────────────────────── */
  types: [
    { id: 'logements',       label: 'Logements' },
    { id: 'rehabilitation',  label: 'Réhabilitation' },
    { id: 'equipement',      label: 'Équipement public' },
    { id: 'maison',          label: 'Maison individuelle' },
  ],

  /* ── Page Projets ───────────────────────────────────────────── */
  projectsPage: {
    eyebrow: 'Projets',
    title:   'Une sélection de six projets.',
    intro:   'Logements, équipements, réhabilitations et maisons : des programmes différents, la même attention au détail.',
    filterLabel: 'Filtrer par type',
    filterAll:   'Tous',
    countOne:    'projet affiché',
    countMany:   'projets affichés',
    back:        'Tous les projets',
    prev:        'Projet précédent',
    next:        'Projet suivant',
    sheet:       'Fiche technique',
    factLabels: {
      place: 'Lieu', year: 'Année', surface: 'Surface', programme: 'Programme',
      mission: 'Mission', client: 'Maîtrise d’ouvrage', type: 'Type',
    },
    surfaceNote: 'm² de surface de plancher',
  },

  /* ── Projets (fictifs) ──────────────────────────────────────── */
  projects: [
    {
      slug: 'cadran', name: 'Le Cadran', type: 'logements',
      place: 'Villeurbanne', year: 2024, surface: 3480,
      programme: '38 logements collectifs, un local d’activité en rez-de-chaussée',
      mission: 'Mission complète', client: 'Promoteur privé',
      intention: 'Des balcons profonds qui font des pièces à vivre en plus.',
      text: [
        'Le Cadran s’élève à l’angle de deux rues de gabarits différents. Le bâtiment se découpe en trois volumes qui descendent vers le plus bas des deux voisins, et chaque logement traverse le plan d’une façade à l’autre.',
        'Les balcons de deux mètres de profondeur sont pensés comme des pièces : on y mange, on y travaille, on y dort l’été. Des volets coulissants en bois filtrent la lumière du sud et protègent des vis-à-vis.',
        'Béton clair teinté dans la masse, bois non traité, menuiseries en aluminium naturel : trois matériaux, aucun enduit à repeindre.',
      ],
      cover: { src: 'cadran-1', ratio: '4/3', widths: [480, 800, 1200, 1800],
               alt: 'Façade de logements en béton clair et volets bois coulissants, vue en angle sous un ciel gris pâle.' },
      images: [
        { src: 'cadran-1', ratio: '4/3', widths: [480, 800, 1200, 1800],
          alt: 'Façade de logements en béton clair et volets bois coulissants, vue en angle sous un ciel gris pâle.',
          caption: 'Façade sur rue, angle sud-est.' },
        { src: 'cadran-3', ratio: '4/5', widths: [480, 800, 1200, 1800],
          alt: 'Hall d’entrée en béton brut : un poteau rond, des murs banchés et un sol sombre.',
          caption: 'Hall d’entrée, béton brut de décoffrage.' },
        { src: 'cadran-2', ratio: '4/3', widths: [480, 800, 1200, 1800],
          alt: 'Angle d’un bâtiment à façade perforée de teinte brique, découpé sur un ciel pâle.',
          caption: 'Garde-corps perforés, détail de l’angle.' },
      ],
    },
    {
      slug: 'minoterie', name: 'La Minoterie', type: 'rehabilitation',
      place: 'Lyon 7e', year: 2023, surface: 2150,
      programme: 'Réhabilitation d’une ancienne minoterie : 22 logements et un atelier',
      mission: 'Mission complète', client: 'Copropriété et investisseur privé',
      intention: 'Garder la structure, ouvrir la lumière.',
      text: [
        'La structure en béton de la minoterie était saine, les planchers généreux, les hauteurs sous plafond rares. Nous avons tout gardé, sauf ce qui empêchait la lumière d’entrer.',
        'Deux failles verticales fendent le bâtiment du toit à la cour. Elles apportent un second éclairage aux logements traversants et accueillent les circulations.',
        'Les murs sont isolés par l’intérieur pour conserver la façade d’origine. L’atelier du rez-de-chaussée occupe l’ancienne salle des machines.',
      ],
      cover: { src: 'minoterie-1', ratio: '4/5', widths: [480, 800, 1200, 1800],
               alt: 'Volume blanc à l’arête vive d’une ancienne minoterie réhabilitée, devant un ciel vert d’eau.' },
      images: [
        { src: 'minoterie-1', ratio: '4/5', widths: [480, 800, 1200, 1800],
          alt: 'Volume blanc à l’arête vive d’une ancienne minoterie réhabilitée, devant un ciel vert d’eau.',
          caption: 'Le volume réhabilité vu depuis la cour.' },
        { src: 'minoterie-2', ratio: '3/2', widths: [480, 800, 1200, 1800],
          alt: 'Courbe d’une dalle de béton clair au-dessus d’un mur piqué de trous de banche.',
          caption: 'Dalle et mur conservés, trous de banche apparents.' },
        { src: 'minoterie-3', ratio: '4/5', widths: [480, 800, 1200, 1800],
          alt: 'Passage étroit entre deux murs de béton, éclairé par une rampe lumineuse.',
          caption: 'Faille de circulation, du hall au toit.' },
      ],
    },
    {
      slug: 'mediatheque', name: 'Médiathèque du Pré-Vert', type: 'equipement',
      place: 'Oullins-Pierre-Bénite', year: 2025, surface: 1920,
      programme: 'Médiathèque, espace jeunesse, salle d’animation de 80 places',
      mission: 'Mission de base et suivi de chantier', client: 'Collectivité publique',
      intention: 'Un escalier monumental pensé comme un lieu de rencontre.',
      text: [
        'La médiathèque s’organise autour d’un escalier de béton clair, large comme une rue, qui relie le rez-de-chaussée aux salles de lecture. On s’y assoit, on y attend, on s’y croise.',
        'Depuis la place, le bâtiment se présente en gradins : trois volumes qui montent en profondeur et abritent chacun un usage, la jeunesse, la lecture, l’animation.',
        'Le béton est lasuré dans la masse et laissé brut. Aucune finition ne cache la structure : le bâtiment se lit comme il est construit.',
      ],
      cover: { src: 'mediatheque-1', ratio: '4/3', widths: [480, 800, 1200, 1800, 2400],
               alt: 'Façade en béton clair en gradins : trois volumes à fenêtres profondes, sous un ciel pâle.' },
      images: [
        { src: 'mediatheque-1', ratio: '4/3', widths: [480, 800, 1200, 1800, 2400],
          alt: 'Façade en béton clair en gradins : trois volumes à fenêtres profondes, sous un ciel pâle.',
          caption: 'Façade sur la place, trois volumes en gradins.' },
        { src: 'mediatheque-2', ratio: '3/2', widths: [480, 800, 1200, 1800],
          alt: 'Escalier en béton clair, vu de face : volées et palier forment une diagonale.',
          caption: 'L’escalier, depuis le hall.' },
        { src: 'mediatheque-3', ratio: '3/2', widths: [480, 800, 1200, 1800],
          alt: 'Grand hall blanc : un mur de béton lisse et un escalier étroit à main courante métallique.',
          caption: 'Salle de lecture, mur de béton lisse.' },
      ],
    },
    {
      slug: 'verger', name: 'Maison du Verger', type: 'maison',
      place: 'Saint-Didier-au-Mont-d’Or', year: 2022, surface: 185,
      programme: 'Maison individuelle pour une famille de quatre personnes',
      mission: 'Mission complète', client: 'Particulier',
      intention: 'Une maison qui s’ouvre sur le verger et se referme sur la rue.',
      text: [
        'Le terrain, en bordure de village, est planté de vieux fruitiers que le projet conserve tous. La maison s’empile en trois niveaux étroits pour laisser le plus de verger possible.',
        'Côté rue, la façade reste presque aveugle et de grandes terrasses en saillie ouvrent côté jardin. Chaque chambre a sa terrasse, le séjour s’ouvre sur toute sa largeur.',
        'Enduit blanc à la chaux, menuiseries noires, brise-soleil coulissants : la maison parle peu et s’efface devant les arbres.',
      ],
      cover: { src: 'verger-1', ratio: '4/3', widths: [480, 800, 1200, 1800, 2400],
               alt: 'Maison cubique blanche à plusieurs niveaux, aux grandes baies vitrées et aux terrasses en saillie.' },
      images: [
        { src: 'verger-1', ratio: '4/3', widths: [480, 800, 1200, 1800, 2400],
          alt: 'Maison cubique blanche à plusieurs niveaux, aux grandes baies vitrées et aux terrasses en saillie.',
          caption: 'Façade côté jardin.' },
        { src: 'verger-2', ratio: '4/5', widths: [480, 800, 1200, 1800],
          alt: 'Mur de béton brut ouvert sur une baie vitrée, avec un bassin d’eau au premier plan.',
          caption: 'Mur du patio et bassin.' },
        { src: 'verger-3', ratio: '3/2', widths: [480, 800, 1200, 1800],
          alt: 'Volumes de béton gris aux arêtes obliques, avec une grande baie vitrée au rez-de-chaussée.',
          caption: 'Annexe en béton, arêtes obliques.' },
      ],
    },
    {
      slug: 'ormes', name: 'Les Ormes', type: 'logements',
      place: 'Caluire-et-Cuire', year: 2023, surface: 920,
      programme: 'Onze logements intermédiaires, jardins privatifs en rez-de-chaussée',
      mission: 'Mission de base', client: 'Bailleur social',
      intention: 'Onze logements qui gardent chacun un morceau de jardin.',
      text: [
        'Le terrain est étroit et en pente. Les logements s’y superposent en gradins : chacun a son extérieur privatif, un jardin au rez-de-chaussée, une grande terrasse aux étages.',
        'Les circulations sont extérieures et ouvertes, ce qui réduit les surfaces communes et laisse plus de place aux logements.',
        'Les façades rose pâle et les garde-corps vitrés ont été choisis avec le voisinage pour s’accorder à la teinte des maisons de la rue.',
      ],
      cover: { src: 'ormes-1', ratio: '4/3', widths: [480, 800, 1200, 1800],
               alt: 'Immeuble blanc rosé à balcons vitrés, vu depuis la rue en contre-plongée.' },
      images: [
        { src: 'ormes-1', ratio: '4/3', widths: [480, 800, 1200, 1800],
          alt: 'Immeuble blanc rosé à balcons vitrés, vu depuis la rue en contre-plongée.',
          caption: 'Façade sur rue.' },
        { src: 'ormes-2', ratio: '4/5', widths: [480, 800, 1200, 1800],
          alt: 'Angle de bâtiment en béton gris, avec une terrasse en retrait sous un ciel pâle.',
          caption: 'Terrasse en retrait, angle nord.' },
        { src: 'ormes-3', ratio: '3/2', widths: [480, 800, 1200, 1800],
          alt: 'Cour intérieure en béton brut : murs banchés et ouvertures cadrées sur un jardin.',
          caption: 'Cour intérieure et circulations ouvertes.' },
      ],
    },
    {
      slug: 'vallon', name: 'Maison du Vallon', type: 'maison',
      place: 'Champagne-au-Mont-d’Or', year: 2024, surface: 210,
      programme: 'Maison individuelle avec atelier de travail',
      mission: 'Mission complète', client: 'Particulier',
      intention: 'Un volume simple, posé dans la pente.',
      text: [
        'La maison est un volume unique, enterré d’un côté et libre de l’autre. Elle suit la pente du terrain : on entre par le haut, on vit en bas, de plain-pied avec le jardin.',
        'Un seul matériau, un béton gris légèrement teinté, couvre murs et toiture. Une unique ouverture, en angle, éclaire l’atelier.',
        'Les pièces sont peu nombreuses, grandes et claires. Le reste est dehors.',
      ],
      cover: { src: 'vallon-1', ratio: '4/3', widths: [480, 800, 1200, 1800],
               alt: 'Grand volume gris à l’angle franc, percé d’une ouverture rectangulaire en bas à gauche.' },
      images: [
        { src: 'vallon-1', ratio: '4/3', widths: [480, 800, 1200, 1800],
          alt: 'Grand volume gris à l’angle franc, percé d’une ouverture rectangulaire en bas à gauche.',
          caption: 'Le volume vu depuis l’aval.' },
        { src: 'vallon-2', ratio: '4/5', widths: [480, 800, 1200, 1800],
          alt: 'Colonnade blanche : piliers fins sous un entablement, sur un fond de ciel clair.',
          caption: 'Portique d’entrée, côté amont.' },
      ],
    },
  ],

  /* ── Page Agence et contact ─────────────────────────────────── */
  agency: {
    eyebrow: 'Agence',
    title:   'Six personnes, un atelier, un seul chantier à la fois.',
    image: { src: 'agence', ratio: '2.2/1', widths: [480, 800, 1200, 1800, 2400],
             alt: 'Immeuble blanc à balcons en gradins, vu en contre-plongée sur un ciel blanc.' },
    imageCaption: 'Détail de façade, photographie libre de droits.',
    intro: [
      'Valcourt & Marchon est né en 2014 de la rencontre de deux architectes qui voulaient dessiner des bâtiments plus simples. Le cabinet compte aujourd’hui six personnes, installées à Lyon 7e.',
      'Nous travaillons pour des particuliers, des bailleurs, des promoteurs et des collectivités. La taille de l’agence nous permet de suivre chaque projet de l’esquisse à la réception, avec les mêmes interlocuteurs.',
    ],
    teamLabel: 'Équipe',
    teamCountLabel: 'Six personnes',
    team: [
      { name: 'Hélène Valcourt', role: 'Architecte, associée',
        text: 'Logements et réhabilitation.',
        image: { src: 'team-1', ratio: '1/1', widths: [480, 800], alt: 'Détail d’une colonnade blanche en contre-plongée.' } },
      { name: 'Louis Marchon', role: 'Architecte, associé',
        text: 'Équipements publics et maisons.',
        image: { src: 'team-2', ratio: '1/1', widths: [480, 800], alt: 'Détail d’une dalle de béton courbe au-dessus d’un mur.' } },
      { name: 'Camille Brunel', role: 'Cheffe de projet',
        text: 'Conception et dossiers de consultation.',
        image: { src: 'team-3', ratio: '1/1', widths: [480, 800], alt: 'Détail d’un angle de bâtiment en béton gris.' } },
      { name: 'Yanis Delorme', role: 'Architecte, chantier',
        text: 'Suivi de chantier et réception.',
        image: { src: 'team-4', ratio: '1/1', widths: [480, 800], alt: 'Détail de volumes de béton en gradins sous un ciel pâle.' } },
    ],
    teamNote: 'Les visuels de l’équipe sont des compositions d’architecture, non des portraits.',

    contactLabel: 'Contact',
    contactTitle: 'Parlons de votre projet.',
    address: { label: 'Agence', lines: ['Lyon'] },
    phone:   { label: 'Téléphone', display: '04 65 71 20 48', href: '+33465712048' },
    email:   { label: 'E-mail', display: 'agence@example.com', href: 'agence@example.com' },
    hours:   { label: 'Horaires', lines: ['Du lundi au vendredi', '9 h – 18 h, sur rendez-vous'] },
    access:  { label: 'Accès', lines: ['Métro B, station Jean Macé', 'Tramway T2, arrêt Jean Macé'] },

    // Plan d’accès : illustration schématique en SVG (coordonnées 0–600 × 0–400)
    map: {
      caption: 'Plan schématique, non à l’échelle.',
      title:   'Plan d’accès à l’agence, Lyon',
      river:   'M-10 70 C 120 40, 200 120, 330 90 S 520 40, 610 70 L 610 -10 L -10 -10 Z',
      streets: [
        'M0 210 L600 210', 'M0 300 L600 300', 'M120 100 L120 400', 'M300 110 L300 400',
        'M470 90 L470 400', 'M0 150 L600 190', 'M60 400 L260 110',
      ],
      main:    'M0 255 L600 255',
      labels:  [
        { x: 24,  y: 44,  text: 'Rhône' },
        { x: 312, y: 384, text: 'Métro Jean Macé' },
      ],
      metro:   { x: 300, y: 255 },
      marker:  { x: 340, y: 300, label: 'Valcourt & Marchon' },
    },

    form: {
      title:   'Écrire à l’agence',
      note:    'Formulaire de démonstration – aucun envoi.',
      fields: {
        name:    { label: 'Nom', placeholder: '' },
        email:   { label: 'E-mail', placeholder: '' },
        phone:   { label: 'Téléphone (facultatif)', placeholder: '' },
        type:    { label: 'Type de projet', placeholder: 'Choisir un type', other: 'Autre' },
        message: { label: 'Votre projet', placeholder: '' },
      },
      submit:  'Envoyer le message',
      errorRequired: 'Ce champ est obligatoire.',
      errorEmail:    'Saisissez une adresse e-mail valide.',
      successTitle: 'Message reçu.',
      successText:  'Formulaire de démonstration – aucun envoi : votre message n’a été transmis à personne et n’a pas été enregistré.',
      reset: 'Écrire un autre message',
    },
  },

  /* ── Pied de page ───────────────────────────────────────────── */
  footer: {
    cta: 'Parlons de votre projet.',
    ctaHref: '/agence#contact',
    copyright: '© Valcourt & Marchon Architectes',
    legal: { label: 'Mentions', href: '/mentions' },
  },

  /* ── Textes d’interface ─────────────────────────────────────── */
  ui: {
    noscript: 'Ce site utilise JavaScript pour afficher son contenu. Merci de l’activer.',
    mainLabel: 'Principale',
    breadcrumbLabel: 'Fil d’Ariane',
    figure: 'Illustration',
    cursor: 'Voir',
  },
};
