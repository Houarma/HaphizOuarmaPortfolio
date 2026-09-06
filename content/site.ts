// ---------------------------------------------------------------------------
// Every word on the site lives here. Edit this file, not the components.
// ---------------------------------------------------------------------------

export const mediumProfile = "https://medium.com/@ouarmahaphiz02";

export const site = {
  // Drives canonical URLs, Open Graph tags, the sitemap and the JSON-LD graph.
  url: "https://haphizouarma.com",
  domain: "haphizouarma.com",

  name: "Haphiz Ouarma",
  legalName: "Haphiz OUARMA",
  role: "Engineering student, ENSA Oujda · Founder, Horizon's",

  // The <title> leads with the name for branded search; the description stays
  // under ~155 characters so Google does not truncate it.
  title: "Haphiz Ouarma — AI & Data Engineer, Founder of Horizon's",
  tagline: "AI & Data Engineer · Founder of Horizon's",
  description:
    "AI and data engineer, founder of Horizon's. I build software for African markets and study controlled experiments, causal inference and machine learning.",

  // These become schema.org `knowsAbout`: the subjects this person has
  // knowledge of. Names belong in `name` and `alternateName`, and the country
  // in `nationality` — listing either here would say something false about
  // what is known, and read as keyword stuffing. Machine learning, AI and
  // computer science lead, because that is the recognition being sought.
  keywords: [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "computer science",
    "neural networks",
    "computer vision",
    "natural language processing",
    "retrieval-augmented generation",
    "AI engineer",
    "data engineer",
    "online controlled experiments",
    "causal inference",
    "variance reduction",
    "CUPED",
    "experimentation platform",
    "econometrics",
    "statistics",
    "system design",
    "Horizon's",
    "Horizon's Academy",
    "AfroBite",
    "agriAI",
    "African tech ecosystem",
    "mobile money engineering",
    "ENSA Oujda",
  ],

  links: {
    email: "ouarmahaphiz02@gmail.com",
    github: "https://github.com/Houarma",
    linkedin: "https://www.linkedin.com/in/haphiz-ouarma-882670301/",
    medium: mediumProfile,
  },
};

// --- Hero -------------------------------------------------------------------

export const hero = {
  thesis:
    "I build software for West African markets, and I study how to make trustworthy decisions from the data those systems produce.",
  elaboration:
    "The experimentation literature was written inside companies with effectively unlimited traffic. The products I work on run on low-end devices, over constrained networks, for user bases counted in thousands. That is the regime where variance reduction stops being an optimisation and becomes the thing that decides whether you can learn anything at all.",
  figure: {
    caption:
      "Simulated 95% confidence intervals for the same underlying lift, by sample size. Below roughly 10³ users the interval covers zero: the effect is real and undetectable. Variance reduction moves the last row off zero without collecting more data.",
    rows: [
      { label: "n = 10⁶", sublabel: "the literature's regime", halfWidth: 0.09, treated: false },
      { label: "n = 10⁴", sublabel: "mid-size product", halfWidth: 0.33, treated: false },
      { label: "n = 10³", sublabel: "where I work", halfWidth: 1.0, treated: false },
      { label: "n = 10³", sublabel: "with CUPED", halfWidth: 0.42, treated: true },
    ],
    estimate: 0.55, // point estimate, in the same units as halfWidth
  },
};

// --- Research ---------------------------------------------------------------

export type ResearchItem = {
  title: string;
  chip: string;
  date: string;
  blurb: string;
  cover: string;
  tags: string[];
  href?: string;
};

export const research: ResearchItem[] = [
  {
    title:
      "From Statistical Foundations to Trustworthy Online Experimentation",
    chip: "Survey",
    date: "Aug 2026",
    blurb:
      "Six months of the practitioner literature, synthesised: Delta Method variance estimation, CUPED and CUPAC for sensitivity, and how to choose a test under skew. A survey, not yet an original contribution.",
    cover: "/media/Blogs/blog-survey.webp",
    tags: ["Delta Method", "CUPED · CUPAC", "Choosing a test"],
    href: "https://medium.com/@ouarmahaphiz02/from-statistical-foundations-to-modern-online-controlled-experiments-variance-estimation-variance-bf74ebdd8371",
  },
];

// --- Systems ----------------------------------------------------------------

export type SystemItem = {
  name: string;
  tagline: string;
  status: string;
  body: string;
  metrics: { value: string; label: string }[];
  stack: string[];
};

export const systems: SystemItem[] = [
  {
    name: "AfroBite",
    tagline: "Food delivery for Burkina Faso and Côte d'Ivoire",
    status: "In production",
    body: "No delivery platform served West African payment habits, so the payment layer had to be built rather than integrated. Four Flutter applications — customer, restaurant, courier, admin — over a fully serverless backend, with a BCEAO-compliant ring-fenced wallet, sub-second courier tracking, and adaptive video tuned for low-end devices. Built with a team, taken through closed testing and into production.",
    metrics: [
      { value: "4", label: "apps" },
      { value: "56", label: "cloud functions" },
      { value: "35+", label: "collections" },
      { value: "3", label: "mobile money providers" },
    ],
    stack: ["Flutter", "Firebase", "Node.js", "Mapbox", "LigdiCash"],
  },
  {
    name: "agriAI",
    tagline: "Agricultural intelligence for Burkinabè agripreneurs",
    status: "Team of 4, led",
    body: "Precision agriculture is useless if it assumes a smartphone and a stable connection. The platform reaches farmers inside WhatsApp — soil analysis, crop-disease diagnosis from photographs, a seven-day forecast turned into irrigation instructions, and field mapping — with sign-in by SMS rather than email. It answers in French today; Mooré, Dioula and Fulfuldé are being built. Positioning was refined with a consulting agronomist against national B2B prospects.",
    metrics: [
      { value: "4", label: "modules" },
      { value: "28", label: "documented architecture decisions" },
    ],
    stack: ["Flutter", "Firebase", "WhatsApp API"],
  },
  {
    name: "QCM Platform",
    tagline: "Assessment automation for instructors",
    status: "Full-stack, containerised",
    body: "The whole exam lifecycle — generation, distribution, grading, analytics — with AI question generation, instant grading, and score-based clustering that surfaces students at risk before the end of term. Built as containerised microservices so each service could be reasoned about independently.",
    metrics: [
      { value: "3", label: "services" },
      { value: "0", label: "manually graded papers" },
    ],
    stack: ["Next.js", "Spring Boot", "FastAPI", "PostgreSQL", "Firebase", "Groq"],
  },
];

// --- Horizon's --------------------------------------------------------------

export const horizons = {
  title: "Horizon's",
  lede: "The venture is also the laboratory.",
  body: [
    "Horizon's Academy is an e-learning platform for francophone Africa, starting with a quantitative analysis and data science track. It exists because the skills that make an engineer employable anywhere are taught almost nowhere on the continent in French, at a price that works.",
    "It is also, deliberately, a place to run experiments. Every product decision is A/B tested on an experimentation engine I am building rather than buying, because a third-party tool would hide exactly the layer I want to study: assignment, metric definition, and sensitivity at small sample sizes. Pricing is segmented by purchasing power first, then tested within each segment, with guardrails so that no user is ever shown an unstable price.",
    "The research questions in the section above come from here. A platform with a thousand active learners is not a limitation on the experimentation work — it is the case the literature has not treated.",
  ],
  pillars: [
    { label: "Layer 1", text: "Deterministic assignment, feature flags, an analytics event schema carrying variant and segment everywhere, significance testing." },
    { label: "Layer 2", text: "CUPED, stratification, sequential testing, sensitivity methods — developed in parallel and written up publicly." },
  ],
};

// --- Now --------------------------------------------------------------------

export const now = {
  updated: "August 2026",
  items: [
    "Building the V1 of Horizon's Academy: a modular monolith in TypeScript, NestJS and Next.js on PostgreSQL, with the experimentation layer built in from the first commit rather than bolted on.",
    "Extending the variance-reduction work from review to contribution: quantifying how CUPED and stratification behave in the low-traffic regime, using Horizon's as the testbed.",
    "Preparing an application to a research-based MSc in Computer Science, with experimentation and causal inference as the intended focus.",
  ],
};

// --- About ------------------------------------------------------------------

export const about = {
  paragraphs: [
    "I am from Burkina Faso and study at the National School of Applied Sciences of Oujda, in Morocco, in the engineering cycle in artificial intelligence. Before that, two years of preparatory classes.",
    "I spent the summer of 2025 at the General Directorate of Taxes in Ouagadougou, working on a human resources management system and on the digitalisation of administrative workflows under the institution's 2023–2027 strategic plan. It was the first time I saw how much of a system's difficulty is institutional rather than technical.",
    "Most of what I build is aimed at the same thing: an African technology ecosystem that produces its own infrastructure, its own research and its own talent, rather than importing all three.",
  ],
  education: [
    { school: "ENSA Oujda", detail: "Engineering degree, artificial intelligence", period: "2025 – 2028" },
    { school: "ENSA Oujda", detail: "Preparatory classes for engineering studies", period: "2023 – 2025" },
  ],
  certifications: [
    { name: "Econometrics: Methods and Applications", issuer: "Erasmus University Rotterdam", date: "Jul 2026" },
    { name: "Linear Regression for Business Statistics", issuer: "Rice University", date: "Apr 2026" },
    { name: "Probability and Statistics: To p or not to p?", issuer: "University of London", date: "Mar 2026" },
    { name: "Introduction to Statistics", issuer: "Stanford University", date: "Feb 2026" },
    { name: "Introduction to Statistical Analysis: Hypothesis Testing", issuer: "SAS", date: "Feb 2026" },
    { name: "Mathematics for Machine Learning", issuer: "Imperial College London", date: "Dec 2025" },
  ],
};

// ---------------------------------------------------------------------------
// Bento layout — the first screen. Mirrors the reference mockup one for one:
// identity line, availability pill, call-to-action, then five cards.
// ---------------------------------------------------------------------------

export const identity = {
  greeting: "Hi, I'm",
  name: "Haphiz Ouarma!",
  linePrefix: "I'm a",
  role: "Founder",
  lineJoin: "at",
  org: "Horizon's.",
  availability: "Open to research",
  ctaLabel: "Book a call",
  blurb:
    "Feel free to explore the research and the systems it comes from—I'd love to connect.",
  avatar: "/media/avatar.webp",
};

// --- Card 1 · Experience ----------------------------------------------------

export type ExperienceItem = {
  role: string;
  meta: string;
  // Entries dated past today are the trajectory, not the record. They are
  // marked so the card can render them as such.
  planned?: boolean;
};

export const experience: ExperienceItem[] = [
  {
    role: "PhD, Computer Science — AI",
    meta: "2031 · UC Berkeley",
    planned: true,
  },
  {
    role: "MSc Computer Science, thesis",
    meta: "2028–2030 · McGill",
    planned: true,
  },
  {
    role: "Research intern at Mila",
    meta: "2028 · Structured reasoning in LLMs",
    planned: true,
  },
  {
    role: "Data engineer at Capgemini",
    meta: "2027 · Internship",
    planned: true,
  },
  {
    role: "Data science & cloud at ENSA Oujda",
    meta: "2025–2028 · National scholarship",
  },
  {
    role: "Software engineer at DGI",
    meta: "2025 · Ouagadougou · Internship",
  },
  {
    role: "Prep classes at ENSA Oujda",
    meta: "2023–2025 · National scholarship",
  },
];

// --- Card 2 · What I'm building --------------------------------------------

export const building = {
  title: "Systems in production",
  linkLabel: "Browse on GitHub",
  covers: [
    { src: "/media/project/experimentation.webp", alt: "Experimentation platform" },
    { src: "/media/project/afrobite.webp", alt: "AfroBite", focus: "object-left" },
    { src: "/media/project/qcm.webp", alt: "QCM Platform" },
  ],
};

// --- Card 3 · What I'm reading ---------------------------------------------
// Read in order; the card opens on the first and leafs through the rest.

export type Book = { title: string; author: string; cover: string };

export const reading: Book[] = [
  {
    title: "Improving the Sensitivity of Online Controlled Experiments",
    author: "Deng, Xu, Kohavi & Walker",
    cover: "/media/books/cuped.webp",
  },
  {
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher M. Bishop",
    cover: "/media/books/bishop.webp",
  },
  {
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    cover: "/media/books/attention.webp",
  },
  {
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    author: "Lewis et al.",
    cover: "/media/books/rag.webp",
  },
  {
    title: "Quand la machine apprend",
    author: "Yann Le Cun",
    cover: "/media/books/lecun.webp",
  },
  {
    title: "Introduction to Econometrics",
    author: "Christopher Dougherty",
    cover: "/media/books/dougherty.webp",
  },
  {
    title: "Économétrie — cours et exercices corrigés",
    author: "Régis Bourbonnais",
    cover: "/media/books/bourbonnais.webp",
  },
];

// --- Card 4 · Map -----------------------------------------------------------

export const place = {
  city: "MONTREAL",
  country: "CANADA",
  coords: "45.5017° N, 73.5673° W",
  map: "/media/map.svg",
};

// --- Card 5 · How I work ----------------------------------------------------

export type WorkStep = { step: string; title: string; body: string };

export const howIWork: WorkStep[] = [
  {
    step: "Step 01",
    title: "01 Framing the question",
    body: "Before anything is built or measured, the claim is written down: what is being asserted, what evidence would support it, and what result would make me abandon it. Most questions dissolve at this stage. The ones that survive are worth years.",
  },
  {
    step: "Step 02",
    title: "02 Reading the field first",
    body: "Whatever I am about to build, someone has studied a version of it. Experimentation, causal inference, representation learning — I read until I can say where the field actually stops, rather than where I happened to start.",
  },
  {
    step: "Step 03",
    title: "03 Building the smallest system",
    body: "The narrowest thing that can carry real traffic and still be measured. Constraints get settled in production, not in a document: low-end devices, thin networks, payment habits, language, device class.",
  },
  {
    step: "Step 04",
    title: "04 Measuring under constraint",
    body: "Variance reduction, stratification and sequential testing, with guardrails so no user ever sees an unstable experience. At a thousand users this is not an optimisation — it decides whether anything can be learned at all.",
  },
  {
    step: "Step 05",
    title: "05 Writing it down, teaching it forward",
    body: "Every result is published with its limit stated as plainly as its finding, then turned into something someone else can use — a course, a repository, a paper. Knowledge compounds only when it is shared.",
  },
];

// --- Navigation -------------------------------------------------------------

export const nav = [
  { label: "About me", href: "/#about-me" },
  { label: "The practice", href: "/#practice" },
  { label: "Systems", href: "/#systems" },
  { label: "Blogs & Research", href: "/#research" },
  { label: "The work", href: "/#thesis" },
  { label: "Contact", href: "/#contact" },
];

// --- About me ---------------------------------------------------------------
// The section between the identity block and the bento. Its shape follows the
// reference template: label, statement, two calls to action, a portrait, and a
// four-card panel of proof.

export const aboutMe = {
  label: "About Me",
  headline:
    "The future of Africa will not be defined by the technologies it consumes,",
  headlineAccent: "but by the technologies it creates.",
  lead: "I'm Haphiz Ouarma — AI and data engineer, and founder of Horizon's. I don't see technology as an industry; I see it as infrastructure for human progress. Every product I build and every course I design serves one purpose: making advanced technology understandable, accessible and useful for the next generation of African builders.",
  cta: "Get In Touch",
  portrait: "/media/portrait.webp",

  principle: {
    title: "Systems That Outlive Their Founders",
    tags: [
      "Controlled experiments",
      "Causal inference",
      "Representation learning",
      "System design",
    ],
    rotated: "Education",
  },
};

// The bento's bottom-left slot. Flip this to "map" to put the Montreal card
// back in place of the principle card.
export const bentoSlot: "principle" | "map" = "principle";

// --- Footer -----------------------------------------------------------------
// The first entry is the highlighted pill, as in the reference.

export const footerNav = [
  { label: "Home", href: "/#top" },
  { label: "About me", href: "/#about-me" },
  { label: "Systems", href: "/#systems" },
  { label: "Research", href: "/#research" },
  { label: "Contact", href: "/#contact" },
];

// --- Newsletter -------------------------------------------------------------
// The card straddles the page and the footer band, as in the reference.

export const newsletter = {
  title: "Subscribe to the newsletter",
  lead: "Notes on controlled experiments, data analysis, machine learning, deep learning and system design — what I am building, measuring, and getting wrong along the way.",
  placeholder: "Enter your email",
  cta: "Subscribe",
  fineprint:
    "By subscribing you agree to receive occasional emails from Haphiz Ouarma. No spam, unsubscribe at any time.",
};

// --- The Practice -----------------------------------------------------------
// The bento grid, promoted to a section of its own alongside About Me.

export const practice = {
  label: "The Practice",
  headline: "Where I have been, what I am building,",
  headlineAccent: "and how I go about it.",
};

// --- The work ---------------------------------------------------------------
// Laid out after the reference: a short statement top-left, a specification
// paragraph top-right, an oversized wordmark, then the map plate.

export const theWork = {
  headlineA: "Building for the markets",
  headlineB: "the literature skipped,",
  headlineAccent: "and measuring them anyway.",
  spec: "My work spans data and AI — machine learning, deep learning, and controlled experimentation from a thousand users to a million. The literature assumes unlimited traffic; what I build runs on low-end devices, over thin networks, for user bases counted in thousands.",
  specVision:
    "I am not learning to become the best at it. I am learning to build what lets a generation of Africans create, innovate and export technology of their own. Africa does not need to wait for its future — it has to build it.",
  wordmark: "Africa",
  cta: { label: "Read the research", href: "/#research" },
  cards: [
    {
      icon: "eye" as const,
      title: "My vision",
      body: "Where many see a market, I see immense scientific and technological potential. Africa should stop being only a consumer of technology and become a continent that invents, publishes, builds and exports its own.",
    },
    {
      icon: "rocket" as const,
      title: "Why Horizon's",
      body: "Horizon's is the vehicle for that vision — the place where research, entrepreneurship and education meet, and where ideas are turned into durable impact.",
    },
    {
      icon: "cap" as const,
      title: "Why the Academy",
      body: "Everything I learn, I want to pass on. Training builders is the most durable way to multiply the work and to raise the next generation of African engineers.",
    },
    {
      icon: "bulb" as const,
      title: "Why I learn daily",
      body: "Every new skill brings the mission closer: build technology that is useful, share the knowledge behind it, and help Africa become a centre of innovation.",
    },
  ],
};

// --- Systems showcase -------------------------------------------------------
// One slide per product: two screens in the phones, three cards explaining it.
// Swap the screen paths for real captures dropped in /media/prod.

export type ShowcaseSlide = {
  name: string;
  screens: [string, string];
  cards: { title: string; body: string }[];
};

export const showcase: ShowcaseSlide[] = [
  {
    name: "AfroBite · Site",
    screens: ["/media/prod/site-home.webp", "/media/prod/site-discover.webp"],
    cards: [
      {
        title: "Shipped, not a prototype",
        body: "afrobite.app is live and serving a v1.0 download page. The marketing site, the four applications and the backend went out together.",
      },
      {
        title: "Fifteen seconds, filmed in the kitchen",
        body: "The promise is stated plainly on the page: every dish is a short clip shot where it was actually cooked, so you taste it before you tap.",
      },
      {
        title: "One language across five surfaces",
        body: "Site, customer, restaurant, courier and admin share a design system and a single backend — including the light and dark themes.",
      },
    ],
  },
  {
    name: "AfroBite · Client",
    screens: [
      "/media/prod/afrobite-home.webp",
      "/media/prod/afrobite-tracking.webp",
    ],
    cards: [
      {
        title: "Priced in FCFA, not converted",
        body: "The catalogue, the currency and the categories are local — a 100 FCFA plate of attiéké sits beside a 4 200 FCFA burger, delivered in Ouagadougou.",
      },
      {
        title: "Four states, one event stream",
        body: "Picked up, en route, arrived, delivered. The customer's map and the courier's app read the same events, so the two can never disagree.",
      },
      {
        title: "The courier, one tap away",
        body: "Call or message straight from the tracking screen — on a thin network a phone call still closes the last hundred metres faster than a chat thread.",
      },
    ],
  },
  {
    name: "AfroBite · Découvertes",
    screens: [
      "/media/prod/afrobite-welcome.webp",
      "/media/prod/afrobite-discover.webp",
    ],
    cards: [
      {
        title: "A video feed that sells",
        body: "Restaurants post vertical clips; the dish, its price and an add-to-cart sit on the video itself, so discovery and ordering become one gesture.",
      },
      {
        title: "Tuned for low-end devices",
        body: "Video is adapted to the handset and the connection rather than shipped at a single bitrate and hoped for.",
      },
      {
        title: "Order without an account",
        body: "Guest checkout is a first-class path. Asking for an email before the first order is how you lose the first order.",
      },
    ],
  },
  {
    name: "AfroBite · Resto",
    screens: [
      "/media/prod/resto-login.webp",
      "/media/prod/resto-onboarding.webp",
    ],
    cards: [
      {
        title: "The merchant side, shipped too",
        body: "A separate application for restaurants — menu, orders and deliveries — with its own authentication and its own dashboard.",
      },
      {
        title: "Onboarding that survives reality",
        body: "Logo, address dropped as a GPS pin, WhatsApp number: the fields a Ouagadougou restaurant can actually fill, checked by the team before going live.",
      },
      {
        title: "Four apps, one backend",
        body: "Customer, restaurant, courier and admin, sharing 56 cloud functions and more than 35 collections.",
      },
    ],
  },
  {
    name: "AfroBite · Support",
    screens: [
      "/media/prod/support-intro.webp",
      "/media/prod/support-scope.webp",
    ],
    cards: [
      {
        title: "Support where users already are",
        body: "An official WhatsApp assistant — in Burkina Faso, a support channel that needs an app install is a support channel nobody uses.",
      },
      {
        title: "It does the work, not just the talk",
        body: "Order status, payment help, complaints and refund requests are handled in the thread, and handed to a human when it cannot answer.",
      },
      {
        title: "Scoped on purpose",
        body: "The assistant answers on AfroBite and declines the rest. The boundary is part of the design, not an afterthought.",
      },
    ],
  },
  {
    name: "agriAI",
    screens: [
      "/media/prod/agriai-onboarding.webp",
      "/media/prod/agriai-login.webp",
    ],
    cards: [
      {
        title: "Soil, plant, weather",
        body: "Three tools in one place: soil analysis, crop-disease diagnosis from a photograph, and a forecast that arrives with agronomic advice attached.",
      },
      {
        title: "A phone number is the account",
        body: "Sign-in by SMS on a +226 number. No email, no password — the credentials a Burkinabè farmer actually has.",
      },
      {
        title: "Team of four, led",
        body: "Four modules and twenty-eight documented architecture decisions, positioned with a consulting agronomist against national B2B prospects.",
      },
    ],
  },
  {
    name: "agriAI · WhatsApp",
    screens: [
      "/media/prod/agriai-weather.webp",
      "/media/prod/agriai-scope.webp",
    ],
    cards: [
      {
        title: "Advice, not data",
        body: "A dropped pin returns seven days of weather already turned into instructions: water stress ahead, irrigate early, mulch if you can.",
      },
      {
        title: "No install, no data plan",
        body: "The whole advisory runs inside a WhatsApp thread — reach does not depend on a Play Store download or a smartphone.",
      },
      {
        title: "An assistant that knows its limits",
        body: "It answers on crops, soils and their monitoring, and refuses everything else. A narrow scope is what makes the advice trustworthy.",
      },
    ],
  },
  {
    name: "QCM Platform",
    screens: ["/media/prod/qcm-landing.webp", "/media/prod/qcm-about.webp"],
    cards: [
      {
        title: "AI drafts, the teacher decides",
        body: "Question generation runs on Groq; the instructor edits, publishes and keeps the last word on every item that reaches a student.",
      },
      {
        title: "Marking and analysis, same screen",
        body: "Average score per test, recent papers and their state — active or draft — sit beside the results rather than in a separate export.",
      },
      {
        title: "A stack chosen per service",
        body: "Next.js for the interface, Spring Boot and FastAPI behind it, PostgreSQL and Firebase for state — each service reasoned about, and failed, on its own.",
      },
    ],
  },
];
