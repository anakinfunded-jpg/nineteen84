export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  fields: TemplateField[];
}

export const categories = [
  "Družbena omrežja",
  "Marketing",
  "Spletna stran",
  "Komunikacija",
] as const;

export const templates: Template[] = [
  // ── Spletna stran ──
  {
    id: "opis-izdelka",
    name: "Opis izdelka",
    description: "Prepričljiv opis za spletno trgovino",
    icon: "ShoppingBag",
    category: "Spletna stran",
    fields: [
      { id: "ime", label: "Ime izdelka", type: "text", placeholder: "npr. Brezžične slušalke ProMax", required: true },
      { id: "opis", label: "Kratek opis", type: "textarea", placeholder: "Na kratko opišite izdelek...", required: true },
      { id: "lastnosti", label: "Ključne lastnosti", type: "textarea", placeholder: "Naštejte glavne lastnosti (ločene z vejico)...", required: false },
      { id: "ton", label: "Ton", type: "select", placeholder: "", required: true, options: ["Profesionalno", "Prijazno", "Navdušujoče", "Luksuzno"] },
    ],
  },
  {
    id: "opis-storitve",
    name: "Opis storitve",
    description: "Predstavitev storitve za spletno stran",
    icon: "Wrench",
    category: "Spletna stran",
    fields: [
      { id: "ime", label: "Ime storitve", type: "text", placeholder: "npr. Spletno oblikovanje", required: true },
      { id: "opis", label: "Opis storitve", type: "textarea", placeholder: "Opišite storitev in kaj vključuje...", required: true },
      { id: "ciljna_publika", label: "Ciljna publika", type: "text", placeholder: "npr. mala podjetja, startupovi", required: false },
    ],
  },
  {
    id: "o-nas",
    name: "O nas",
    description: "Besedilo za rubriko 'O nas'",
    icon: "Users",
    category: "Spletna stran",
    fields: [
      { id: "podjetje", label: "Ime podjetja", type: "text", placeholder: "npr. Studio Kreativa d.o.o.", required: true },
      { id: "industrija", label: "Panoga", type: "text", placeholder: "npr. digitalni marketing", required: true },
      { id: "vrednote", label: "Vrednote in poslanstvo", type: "textarea", placeholder: "Kaj Vas poganja? Kaj je Vaše poslanstvo?", required: false },
    ],
  },
  {
    id: "spletna-stran",
    name: "Besedilo za spletno stran",
    description: "Vsebina za glavne podstrani",
    icon: "Globe",
    category: "Spletna stran",
    fields: [
      { id: "podjetje", label: "Podjetje", type: "text", placeholder: "npr. Studio Kreativa d.o.o.", required: true },
      { id: "storitve", label: "Storitve / ponudba", type: "textarea", placeholder: "Opišite Vaše storitve ali ponudbo...", required: true },
      { id: "ton", label: "Ton", type: "select", placeholder: "", required: true, options: ["Profesionalno", "Prijazno", "Moderno"] },
    ],
  },
  {
    id: "seo-meta-opis",
    name: "SEO meta opis",
    description: "Optimiziran meta opis za iskalnike",
    icon: "Search",
    category: "Spletna stran",
    fields: [
      { id: "stran", label: "Ime strani", type: "text", placeholder: "npr. Domača stran, Storitve, Kontakt", required: true },
      { id: "kljucne_besede", label: "Ključne besede", type: "text", placeholder: "npr. spletno oblikovanje, Ljubljana", required: true },
      { id: "opis", label: "Kratek opis strani", type: "textarea", placeholder: "Kaj najde obiskovalec na tej strani?", required: false },
    ],
  },

  // ── Družbena omrežja ──
  {
    id: "objava-facebook",
    name: "Objava za Facebook",
    description: "Privlačna objava za Facebook stran",
    icon: "Share2",
    category: "Družbena omrežja",
    fields: [
      { id: "tema", label: "Tema objave", type: "text", placeholder: "npr. Lansiranje novega izdelka", required: true },
      { id: "podrobnosti", label: "Podrobnosti", type: "textarea", placeholder: "Več o čem želite pisati...", required: false },
      { id: "ton", label: "Ton", type: "select", placeholder: "", required: true, options: ["Sproščeno", "Profesionalno", "Humoristično", "Informativno"] },
    ],
  },
  {
    id: "objava-instagram",
    name: "Objava za Instagram",
    description: "Kreativen opis za Instagram objavo",
    icon: "Camera",
    category: "Družbena omrežja",
    fields: [
      { id: "tema", label: "Tema objave", type: "text", placeholder: "npr. Za kulisami našega studia", required: true },
      { id: "podrobnosti", label: "Podrobnosti", type: "textarea", placeholder: "Opišite sliko ali video...", required: false },
      { id: "hashtagi", label: "Vključi hashtage", type: "select", placeholder: "", required: true, options: ["Da", "Ne"] },
    ],
  },
  {
    id: "objava-linkedin",
    name: "Objava za LinkedIn",
    description: "Strokovna objava za LinkedIn",
    icon: "Briefcase",
    category: "Družbena omrežja",
    fields: [
      { id: "tema", label: "Tema", type: "text", placeholder: "npr. Trendi v digitalnem marketingu 2026", required: true },
      { id: "industrija", label: "Panoga", type: "text", placeholder: "npr. tehnologija, finance", required: false },
      { id: "tocke", label: "Ključne točke", type: "textarea", placeholder: "Kaj želite poudariti?", required: false },
    ],
  },

  // ── Marketing ──
  {
    id: "oglasno-besedilo",
    name: "Oglaševalsko besedilo",
    description: "Besedilo za plačane oglase",
    icon: "Megaphone",
    category: "Marketing",
    fields: [
      { id: "izdelek", label: "Izdelek / storitev", type: "text", placeholder: "npr. Online tečaj fotografije", required: true },
      { id: "ciljna_publika", label: "Ciljna publika", type: "text", placeholder: "npr. začetniki v fotografiji, 25-40 let", required: true },
      { id: "platforma", label: "Platforma", type: "select", placeholder: "", required: true, options: ["Google Ads", "Facebook / Instagram", "LinkedIn"] },
    ],
  },
  {
    id: "naslovi-oglasov",
    name: "Naslovi za oglase",
    description: "Udarni naslovi za oglase",
    icon: "Type",
    category: "Marketing",
    fields: [
      { id: "izdelek", label: "Izdelek / storitev", type: "text", placeholder: "npr. CRM programska oprema", required: true },
      { id: "prednost", label: "Ključna prednost", type: "text", placeholder: "npr. prihranite 10 ur na teden", required: true },
      { id: "stevilo", label: "Število naslovov", type: "select", placeholder: "", required: true, options: ["5", "10", "15"] },
    ],
  },
  {
    id: "prodajno-pismo",
    name: "Prodajno pismo",
    description: "Prepričljivo pismo za prodajo",
    icon: "TrendingUp",
    category: "Marketing",
    fields: [
      { id: "izdelek", label: "Izdelek / storitev", type: "text", placeholder: "npr. Premium coaching paket", required: true },
      { id: "problem", label: "Problem, ki ga rešuje", type: "textarea", placeholder: "Kateri problem rešujete za stranko?", required: true },
      { id: "ciljna_publika", label: "Ciljna publika", type: "text", placeholder: "npr. podjetniki, vodje ekip", required: false },
    ],
  },

  // ── Komunikacija ──
  {
    id: "e-posta",
    name: "E-poštno sporočilo",
    description: "Profesionalno e-poštno sporočilo",
    icon: "Mail",
    category: "Komunikacija",
    fields: [
      { id: "namen", label: "Namen sporočila", type: "text", placeholder: "npr. Ponudba za sodelovanje", required: true },
      { id: "prejemnik", label: "Tip prejemnika", type: "text", placeholder: "npr. potencialna stranka, poslovni partner", required: true },
      { id: "tocke", label: "Ključne točke", type: "textarea", placeholder: "Kaj želite sporočiti?", required: false },
    ],
  },
  {
    id: "blog-uvod",
    name: "Blog uvod",
    description: "Privlačen uvodni odstavek za blog",
    icon: "BookOpen",
    category: "Komunikacija",
    fields: [
      { id: "naslov", label: "Naslov članka", type: "text", placeholder: "npr. 10 nasvetov za boljši SEO", required: true },
      { id: "kljucne_besede", label: "Ključne besede", type: "text", placeholder: "npr. SEO, optimizacija, iskalniki", required: false },
      { id: "tema", label: "O čem govori članek", type: "textarea", placeholder: "Na kratko opišite vsebino članka...", required: false },
    ],
  },
  {
    id: "novica-mediji",
    name: "Novica za medije",
    description: "Press release za medije",
    icon: "Newspaper",
    category: "Komunikacija",
    fields: [
      { id: "naslov", label: "Naslov novice", type: "text", placeholder: "npr. Lansiranje novega produkta", required: true },
      { id: "podrobnosti", label: "Podrobnosti", type: "textarea", placeholder: "Kaj, kdaj, kje, zakaj?", required: true },
      { id: "podjetje", label: "Ime podjetja", type: "text", placeholder: "npr. Studio Kreativa d.o.o.", required: true },
    ],
  },
  {
    id: "povabilo-dogodek",
    name: "Povabilo na dogodek",
    description: "Privlačno povabilo na Vaš dogodek",
    icon: "CalendarDays",
    category: "Komunikacija",
    fields: [
      { id: "dogodek", label: "Ime dogodka", type: "text", placeholder: "npr. Konferenca DigiMarket 2026", required: true },
      { id: "datum_lokacija", label: "Datum in lokacija", type: "text", placeholder: "npr. 15. marec 2026, GR Ljubljana", required: true },
      { id: "opis", label: "Opis dogodka", type: "textarea", placeholder: "Kaj se bo dogajalo, zakaj priti?", required: false },
    ],
  },
];
