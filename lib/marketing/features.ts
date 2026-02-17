import {
  MessageSquare,
  FileText,
  Image as ImageIcon,
  FilePenLine,
  Languages,
  Volume2,
  Eye,
  Paintbrush,
  Replace,
  Brain,
  ArrowRightLeft,
  BookOpenText,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  slug: string;
  title: string;
  shortDesc: string;
  icon: LucideIcon;
  category: string;
  heroTitle: string;
  heroDescription: string;
  appPath: string;
  sections: {
    title: string;
    description: string;
    points: string[];
    screenshotKey?: string; // placeholder key for dashboard screenshots
  }[];
  faq: { q: string; a: string }[];
};

export const features: Feature[] = [
  {
    slug: "ai-chat",
    title: "AI Chat",
    shortDesc: "Pogovarjajte se z AI v naravni slovenščini. Takojšnji odgovori, kreativne ideje in pomoč pri pisanju.",
    icon: MessageSquare,
    category: "Besedila",
    heroTitle: "AI Chat v slovenščini",
    heroDescription: "Pogovarjajte se z najnaprednejšimi AI modeli v naravni slovenščini. Pridobite takojšnje odgovore, kreativne ideje, pomoč pri pisanju in analizi — 24 ur na dan, 7 dni v tednu.",
    appPath: "/ai-chat",
    sections: [
      {
        title: "Naravni pogovor v slovenščini",
        description: "AI Chat razume kontekst, sledi pogovoru in odgovarja v brezhibni slovenščini. Ni potrebe po angleških navodilih — preprosto pišite, kot bi se pogovarjali s kolegom.",
        points: [
          "Popolno razumevanje slovenščine",
          "Ohranjanje konteksta celotnega pogovora",
          "Prilagodljiv ton — formalno ali sproščeno",
        ],
        screenshotKey: "ai-chat-conversation",
      },
      {
        title: "Takojšnja pomoč pri pisanju",
        description: "Potrebujete e-mail, opis izdelka ali objavo za družbena omrežja? AI Chat vam pomaga napisati, izboljšati ali preoblikovati katero koli besedilo v nekaj sekundah.",
        points: [
          "Generiranje besedil iz kratkih navodil",
          "Izboljšava obstoječih besedil",
          "Prilagajanje tona in sloga",
        ],
        screenshotKey: "ai-chat-writing",
      },
      {
        title: "Pametno usmerjanje modelov",
        description: "Za preproste naloge se avtomatsko uporabi hiter model, za zahtevne pa naprednejši. Vedno dobite optimalno razmerje med hitrostjo in kakovostjo.",
        points: [
          "Samodejno usmerjanje glede na zahtevnost",
          "Hitri odgovori za preprosta vprašanja",
          "Napredni model za kompleksne analize",
        ],
        screenshotKey: "ai-chat-routing",
      },
    ],
    faq: [
      { q: "Katere AI modele uporablja AI Chat?", a: "AI Chat uporablja Claude Sonnet 4.5 za hitrejše odgovore in Claude Opus 4.6 za zahtevnejše naloge. Profesionalni in poslovni paketi imajo dostop do najzmogljivejšega modela." },
      { q: "Ali AI Chat razume slovenščino?", a: "Da, AI Chat je optimiziran za slovenščino. Razume kontekst, slovnico in kulturne posebnosti slovenskega jezika." },
      { q: "Koliko sporočil lahko pošljem?", a: "Število sporočil je omejeno z vašo mesečno kvoto besed. Brezplačni preizkus vključuje 2.000 besed, plačljivi paketi pa od 20.000 do 150.000 besed." },
      { q: "Ali se pogovori shranjujejo?", a: "Da, vaši pogovori se shranjujejo in so dostopni kadarkoli. Lahko jih tudi izbrišete." },
    ],
  },
  {
    slug: "ai-besedila",
    title: "AI Besedila",
    shortDesc: "40+ predlog za marketinška besedila. Opisi izdelkov, e-maili, objave za družbena omrežja in več.",
    icon: FileText,
    category: "Besedila",
    heroTitle: "AI Besedila za marketing",
    heroDescription: "Ustvarite profesionalna marketinška besedila v nekaj sekundah. Več kot 40 predlog za e-maile, opise izdelkov, objave za družbena omrežja, blogovske objave in oglase — vse v brezhibni slovenščini.",
    appPath: "/ai-besedila",
    sections: [
      {
        title: "40+ profesionalnih predlog",
        description: "Izbirajte med široko paleto preizkušenih predlog za vsako vrsto marketinškega besedila. Od AIDA formule do objav za Instagram — vsaka predloga je optimizirana za rezultate.",
        points: [
          "Predloge za družbena omrežja (Instagram, Facebook, LinkedIn)",
          "E-poštne predloge (prodajne, spremljevalne, novice)",
          "SEO opisi, opisi izdelkov, oglasi",
        ],
        screenshotKey: "ai-besedila-templates",
      },
      {
        title: "Iz 3 besed v celoten članek",
        description: "Vnesite le naslov ali kratke ključne besede in AI ustvari celovito besedilo. Blog objava v 60 sekundah, e-mail v 30 sekundah.",
        points: [
          "Hitro generiranje iz kratkih navodil",
          "Človeški ton in naravni slog",
          "Brez blokiranja pisanja",
        ],
        screenshotKey: "ai-besedila-generate",
      },
      {
        title: "Besedila, ki prodajajo",
        description: "Vsaka predloga temelji na preizkušenih copywriting formulah (AIDA, PAS, BAB). Rezultat so besedila, ki pritegnejo pozornost in spodbujajo k dejanju.",
        points: [
          "Preizkušene copywriting formule",
          "Prilagodljiv ton za vsako blagovno znamko",
          "Optimizirano za konverzije",
        ],
        screenshotKey: "ai-besedila-copywriting",
      },
    ],
    faq: [
      { q: "Koliko predlog je na voljo?", a: "Na voljo je več kot 40 predlog, ki pokrivajo vse ključne marketinške kanale — od družbenih omrežij do e-pošte in SEO." },
      { q: "Ali so besedila unikatna?", a: "Da, vsako generirano besedilo je unikatno in originalno. AI ne kopira obstoječih vsebin." },
      { q: "Ali lahko prilagodim ton besedila?", a: "Da, pri vsaki predlogi lahko določite želeni ton — formalno, sproščeno, prepričljivo ali informativno." },
      { q: "V katerih jezikih lahko generiram besedila?", a: "Primarno v slovenščini, vendar AI razume tudi angleščino, nemščino in druge jezike." },
    ],
  },
  {
    slug: "ai-grafika",
    title: "AI Grafika",
    shortDesc: "Generirajte profesionalne slike z umetno inteligenco. Realistične fotografije, ilustracije in grafike.",
    icon: ImageIcon,
    category: "Grafika",
    heroTitle: "AI Grafika in slike",
    heroDescription: "Ustvarite edinstvene, profesionalne slike v nekaj sekundah. Opišite željeno sliko v slovenščini in AI jo bo ustvaril — brez licenčnin, brez omejitev avtorskih pravic.",
    appPath: "/ai-grafika",
    sections: [
      {
        title: "Profesionalne slike v sekundah",
        description: "Opišite sliko v nekaj besedah in AI jo ustvari. Izbirajte med različnimi slogi, velikostmi in kakovostjo — od realističnih fotografij do umetniških ilustracij.",
        points: [
          "Realistične fotografije in ilustracije",
          "3 velikosti: kvadrat, pokončno, ležeče",
          "Standardna in HD kakovost",
        ],
        screenshotKey: "ai-grafika-gallery",
      },
      {
        title: "Brez avtorskih pravic",
        description: "Vse generirane slike so vaša last. Uporabite jih komercialno, na družbenih omrežjih, v oglasih ali na spletni strani — brez dodatnih stroškov ali licenc.",
        points: [
          "Polno lastništvo generiranih slik",
          "Komercialna uporaba brez omejitev",
          "Ni licenčnih stroškov",
        ],
        screenshotKey: "ai-grafika-rights",
      },
      {
        title: "Galerija in upravljanje",
        description: "Vse vaše generirane slike so shranjene v osebni galeriji. Pregledujte, prenašajte in upravljajte svojo zbirko kadarkoli.",
        points: [
          "Osebna galerija slik",
          "Enostavno prenašanje v PNG formatu",
          "Zgodovina vseh generiranih slik",
        ],
        screenshotKey: "ai-grafika-manage",
      },
    ],
    faq: [
      { q: "Kateri AI model se uporablja za slike?", a: "Za generiranje slik uporabljamo DALL-E 3 od OpenAI, enega najnaprednejših modelov za ustvarjanje slik." },
      { q: "V kakšni ločljivosti so slike?", a: "Slike so generirane v ločljivosti do 1792×1024 pikslov (ali obratno), odvisno od izbrane orientacije." },
      { q: "Ali so slike unikatne?", a: "Da, vsaka slika je generirana na novo in je popolnoma unikatna." },
      { q: "Koliko slik lahko generiram?", a: "Odvisno od paketa — od 10 slik (brezplačni preizkus) do 800 slik mesečno (poslovni paket)." },
    ],
  },
  {
    slug: "ai-dokumenti",
    title: "AI Dokumenti",
    shortDesc: "Urejajte, izboljšajte in pretvorite dokumente z AI pomočnikom.",
    icon: FilePenLine,
    category: "Besedila",
    heroTitle: "AI Dokumenti",
    heroDescription: "Izboljšajte svoje dokumente z AI. Naložite besedilo, izberite navodilo — izboljšaj, skrajšaj, podaljšaj, poenostavi ali prilagodi ton — in dobite rezultat v trenutku.",
    appPath: "/ai-dokumenti",
    sections: [
      {
        title: "Pametno urejanje besedil",
        description: "Prilepite besedilo in izberite, kaj želite: izboljšajte slog, popravite slovnico, skrajšajte ali podaljšajte. AI ohrani vaše sporočilo in izboljša kakovost pisanja.",
        points: [
          "Izboljšava sloga in berljivosti",
          "Popravki slovnice in pravopisa",
          "Skrajševanje ali podaljševanje besedil",
        ],
        screenshotKey: "ai-dokumenti-edit",
      },
      {
        title: "Prilagajanje tona",
        description: "Pretvorite formalno besedilo v sproščeno, tehnično v enostavno ali ravno obratno. AI razume kontekst in ohrani bistvo vašega sporočila.",
        points: [
          "Formalno, sproščeno, prepričljivo",
          "Poenostavitev tehničnih besedil",
          "Ohranjanje ključnih informacij",
        ],
        screenshotKey: "ai-dokumenti-tone",
      },
    ],
    faq: [
      { q: "Katere operacije so na voljo?", a: "Na voljo so: izboljšava, skrajšanje, podaljšanje, poenostavitev, sprememba tona, popravek slovnice in več." },
      { q: "Ali je moje besedilo varno?", a: "Da, vaša besedila se ne shranjujejo trajno in se ne uporabljajo za treniranje AI modelov." },
    ],
  },
  {
    slug: "ai-prevajalnik",
    title: "AI Prevajalnik",
    shortDesc: "Natančno prevajanje med 40+ jeziki z razumevanjem konteksta.",
    icon: Languages,
    category: "Besedila",
    heroTitle: "AI Prevajalnik",
    heroDescription: "Prevajajte besedila med 40+ jeziki, vključno s slovenščino, angleščino, nemščino, francoščino, italijanščino in španščino. AI razume kontekst in kulturne nianse — rezultat so naravni prevodi, ne dobesedni.",
    appPath: "/ai-prevajalnik",
    sections: [
      {
        title: "Kontekstualno prevajanje",
        description: "Za razliko od klasičnih prevajalnikov AI razume kontekst celotnega besedila. Rezultat so naravni prevodi, ki zvenijo, kot bi jih napisal domači govorec.",
        points: [
          "Razumevanje konteksta in pomena",
          "Naravni, tekoči prevodi",
          "Ohranjanje tona izvirnika",
        ],
        screenshotKey: "ai-prevajalnik-translate",
      },
      {
        title: "6 jezikov",
        description: "Prevajajte med slovenščino, angleščino, nemščino, francoščino, italijanščino in španščino. Vsak jezikovni par je optimiziran za natančnost.",
        points: [
          "Slovenščina, angleščina, nemščina",
          "Francoščina, italijanščina, španščina",
          "Vsi jezikovni pari podprti",
        ],
        screenshotKey: "ai-prevajalnik-languages",
      },
    ],
    faq: [
      { q: "Kako natančni so prevodi?", a: "AI prevajalnik daje izjemno natančne prevode, še posebej za slovenščino. Za strokovna besedila priporočamo pregled." },
      { q: "Koliko besedila lahko prevedem?", a: "Omejitev je vezana na vašo mesečno kvoto besed. Prevedeno besedilo se šteje v kvoto." },
    ],
  },
  {
    slug: "ai-zvok",
    title: "AI Zvok",
    shortDesc: "Pretvorite besedilo v naravni govor ali govor v besedilo. 6 glasov, prilagodljiva hitrost.",
    icon: Volume2,
    category: "Zvok",
    heroTitle: "AI Zvok — besedilo v govor in govor v besedilo",
    heroDescription: "Pretvorite katero koli besedilo v naravno zveneči govor z izbiro med 6 glasovi. Ali pa naložite zvočni posnetek in ga pretvorite v besedilo — idealno za transkripcije sestankov, predavanj in intervjujev.",
    appPath: "/ai-zvok",
    sections: [
      {
        title: "Besedilo v govor (TTS)",
        description: "Izberite med 6 profesionalnimi glasovi in prilagodite hitrost govora. Rezultat prenesete kot MP3 datoteko za uporabo v podcastih, videoposnetkih ali prezentacijah.",
        points: [
          "6 različnih glasov (moški in ženski)",
          "Prilagodljiva hitrost (0.25x–4x)",
          "Prenos v MP3 formatu",
        ],
        screenshotKey: "ai-zvok-tts",
      },
      {
        title: "Govor v besedilo (STT)",
        description: "Naložite zvočni posnetek ali posnemite neposredno v brskalniku. AI bo prepisal govor v besedilo z visoko natančnostjo — podpira slovenščino.",
        points: [
          "Podpora za slovenščino",
          "Snemanje neposredno v brskalniku",
          "Podpora za MP3, WAV, M4A, WebM",
        ],
        screenshotKey: "ai-zvok-stt",
      },
    ],
    faq: [
      { q: "Ali govor zveni naravno?", a: "Da, uporabljamo najnovejšo OpenAI TTS tehnologijo, ki proizvaja izjemno naravno zveneči govor." },
      { q: "Katere formate zvočnih datotek podpirate?", a: "Za prepisovanje podpiramo MP3, WAV, M4A in WebM formate do 25 MB." },
      { q: "Ali STT podpira slovenščino?", a: "Da, prepisovanje govora v besedilo podpira slovenščino ter številne druge jezike." },
    ],
  },
  {
    slug: "ai-vid",
    title: "Računalniški vid",
    shortDesc: "Naložite sliko in pridobite podroben opis ali izvlecite besedilo (OCR).",
    icon: Eye,
    category: "Analiza",
    heroTitle: "Računalniški vid — analiza slik in OCR",
    heroDescription: "Naložite katero koli sliko in AI jo bo analiziral. Izbirajte med dvema načinoma: pridobite podroben opis slike v slovenščini ali izvlecite vse besedilo iz slike (OCR).",
    appPath: "/ai-vid",
    sections: [
      {
        title: "Opis slike",
        description: "AI analizira vsebino slike in ustvari podroben opis v slovenščini. Idealno za dostopnost, katalogiziranje slik ali generiranje opisov za spletne strani.",
        points: [
          "Podrobni opisi v slovenščini",
          "Analiza vsebine, barv in kompozicije",
          "Pretočno prikazovanje rezultatov",
        ],
        screenshotKey: "ai-vid-describe",
      },
      {
        title: "Izvlečenje besedila (OCR)",
        description: "Naložite fotografijo dokumenta, računa, menija ali katere koli slike z besedilom. AI bo izvlekel vse besedilo in ohranil formatiranje.",
        points: [
          "Izvlečenje besedila iz slik",
          "Ohranjanje formatiranja",
          "Podpora za dokumente, račune, menije",
        ],
        screenshotKey: "ai-vid-ocr",
      },
    ],
    faq: [
      { q: "Katere formate slik podpirate?", a: "Podpiramo JPG, PNG, WebP in GIF formate do 4 MB." },
      { q: "Kako natančno je izvlečenje besedila?", a: "AI uporablja napredne vizualne modele za zelo natančno prepoznavanje besedila, tudi iz fotografij pod kotom." },
    ],
  },
  {
    slug: "ai-inpainting",
    title: "AI Inpainting",
    shortDesc: "Označite del slike in opišite, kaj naj AI nariše namesto tega.",
    icon: Paintbrush,
    category: "Grafika",
    heroTitle: "AI Inpainting — urejanje slik z AI",
    heroDescription: "Naložite sliko, z čopičem označite območje, ki ga želite spremeniti, in opišite, kaj naj AI nariše. Idealno za odstranjevanje objektov, spreminjanje ozadij ali dodajanje elementov.",
    appPath: "/ai-inpainting",
    sections: [
      {
        title: "Intuitiven urejevalnik na platnu",
        description: "Naložite sliko in z nastavljivo velikostjo čopiča označite območje za urejanje. Urejevalnik deluje neposredno v brskalniku — ni potrebe po nameščanju programske opreme.",
        points: [
          "Čopič z nastavljivo velikostjo",
          "Deluje v brskalniku",
          "Enostavno čiščenje in ponovni poskus",
        ],
        screenshotKey: "ai-inpainting-canvas",
      },
      {
        title: "AI zapolni označeno območje",
        description: "Opišite, kaj naj AI nariše na označenem območju. AI upošteva okolico slike in ustvari naraven, skladen rezultat.",
        points: [
          "Naravno vključevanje v okolico",
          "Tekstovni opis želenega rezultata",
          "Prenos rezultata v PNG formatu",
        ],
        screenshotKey: "ai-inpainting-result",
      },
    ],
    faq: [
      { q: "Kako deluje inpainting?", a: "Slika se prilagodi na 1024×1024, nato z čopičem označite območje. AI na podlagi vašega opisa zapolni to območje." },
      { q: "Ali moram namestiti kakšno programsko opremo?", a: "Ne, urejevalnik deluje popolnoma v brskalniku. Potrebujete le sodobni brskalnik." },
    ],
  },
  {
    slug: "ai-zamenjava",
    title: "Najdi in spremeni",
    shortDesc: "Opišite, kaj želite najti na sliki in s čim zamenjati — AI opravi ostalo.",
    icon: Replace,
    category: "Grafika",
    heroTitle: "Najdi in spremeni v slikah",
    heroDescription: "Naložite sliko, opišite, kaj želite najti (npr. 'rdeč avto') in s čim zamenjati (npr. 'moder avto'). AI najde element in ga zamenja — brez ročnega označevanja.",
    appPath: "/ai-zamenjava",
    sections: [
      {
        title: "Enostavno besedilno urejanje",
        description: "Ni potrebe po čopičih ali maskah. Preprosto opišite, kaj želite spremeniti, in AI bo sam našel in zamenjal element na sliki.",
        points: [
          "Brez ročnega označevanja",
          "Besedilni opis iskanja in zamenjave",
          "Primerjava pred/po",
        ],
        screenshotKey: "ai-zamenjava-compare",
      },
    ],
    faq: [
      { q: "Kako natančna je zamenjava?", a: "AI uporablja napredne vizualne modele za zelo natančno iskanje in zamenjavo elementov. Za najboljše rezultate uporabite jasne opise." },
    ],
  },
  {
    slug: "ai-spomin",
    title: "AI Spomin",
    shortDesc: "Naložite dokumente in postavljajte vprašanja — AI odgovarja na podlagi vaše baze znanja.",
    icon: Brain,
    category: "Analiza",
    heroTitle: "AI Spomin — vaša baza znanja",
    heroDescription: "Naložite dokumente o vašem podjetju, izdelkih ali panogi. AI si jih zapomni in odgovarja na vprašanja na podlagi vaših podatkov — kot osebni asistent, ki pozna vaše poslovanje.",
    appPath: "/ai-spomin",
    sections: [
      {
        title: "Nalaganje dokumentov",
        description: "Naložite besedilne datoteke ali prilepite vsebino neposredno. AI razdeli dokumente na segmente in jih shrani za kasnejše iskanje.",
        points: [
          "Podpora za TXT, MD, CSV, JSON",
          "Prilepljanje besedila neposredno",
          "Upravljanje in brisanje dokumentov",
        ],
        screenshotKey: "ai-spomin-upload",
      },
      {
        title: "Postavite vprašanje o dokumentih",
        description: "Postavite vprašanje v naravnem jeziku in AI poišče ustrezne informacije v vaših dokumentih ter ustvari natančen odgovor z navedbo virov.",
        points: [
          "Iskanje po vseh dokumentih hkrati",
          "Natančni odgovori z viri",
          "Pretočno prikazovanje odgovorov",
        ],
        screenshotKey: "ai-spomin-query",
      },
    ],
    faq: [
      { q: "Koliko dokumentov lahko naložim?", a: "Odvisno od paketa — od 5 (brezplačni preizkus) do 250 (poslovni paket)." },
      { q: "Ali so moji dokumenti varni?", a: "Da, vaši dokumenti so shranjeni varno in so dostopni le vam. Drugi uporabniki nimajo dostopa." },
      { q: "Kako deluje iskanje?", a: "AI uporablja vektorsko iskanje (embeddings), ki razume pomen besedila, ne le ključne besede." },
    ],
  },
  {
    slug: "pretvorniki",
    title: "Pretvorniki",
    shortDesc: "Pretvorite datoteke med formati — slike, besedila, JSON in CSV.",
    icon: ArrowRightLeft,
    category: "Orodja",
    heroTitle: "Pretvorniki datotek",
    heroDescription: "Hitro pretvorite datoteke med različnimi formati neposredno v brskalniku. Pretvorba slik (PNG, JPG, WebP), besedila v PDF, Markdown v HTML in JSON v CSV — brez nalaganja na strežnik.",
    appPath: "/pretvorniki",
    sections: [
      {
        title: "Pretvorba v brskalniku",
        description: "Vse pretvorbe se izvajajo neposredno v vašem brskalniku — datoteke se ne nalagajo na strežnik. Hitro, varno in brez čakanja.",
        points: [
          "Slike: PNG ↔ JPG ↔ WebP",
          "Besedilo v PDF (TXT → PDF)",
          "Markdown v HTML",
          "JSON ↔ CSV",
        ],
        screenshotKey: "pretvorniki-ui",
      },
    ],
    faq: [
      { q: "Ali se datoteke nalagajo na strežnik?", a: "Ne, vse pretvorbe se izvajajo lokalno v vašem brskalniku. Vaše datoteke nikoli ne zapustijo vašega računalnika." },
      { q: "Katere pretvorbe so na voljo?", a: "Podpiramo pretvorbo slik (PNG, JPG, WebP), besedila v PDF, Markdown v HTML ter JSON v CSV in obratno." },
    ],
  },
  {
    slug: "ai-povzetek",
    title: "AI Povzetek",
    shortDesc: "Naložite dokument ali prilepite besedilo in pridobite takojšen povzetek v slovenščini.",
    icon: BookOpenText,
    category: "Učenje",
    heroTitle: "AI Povzetek — takojšnji povzetki",
    heroDescription: "Naložite PDF, DOCX, PPTX ali XLSX datoteko ali prilepite besedilo in pridobite jasen, strukturiran povzetek v slovenščini. Izbirajte med 4 načini povzemanja — od kratkih do podrobnih.",
    appPath: "/ai-povzetek",
    sections: [
      {
        title: "4 načini povzemanja",
        description: "Izberite način povzemanja glede na vaše potrebe: kratek povzetek za hiter pregled, srednji za uravnotežen pregled, podroben za temeljito razumevanje ali ključne točke za strukturiran seznam.",
        points: [
          "Kratek povzetek — bistvo v nekaj stavkih",
          "Srednji povzetek — uravnotežen pregled",
          "Podroben povzetek — temeljita analiza",
          "Ključne točke — strukturiran seznam",
        ],
        screenshotKey: "ai-povzetek-modes",
      },
      {
        title: "Podpora za datoteke",
        description: "Naložite dokumente v najpogostejših formatih — PDF, DOCX, PPTX in XLSX. AI izvleče besedilo in ustvari povzetek, ne glede na format izvirnika.",
        points: [
          "PDF dokumenti",
          "Word dokumenti (DOCX)",
          "PowerPoint predstavitve (PPTX)",
          "Excel preglednice (XLSX)",
        ],
        screenshotKey: "ai-povzetek-upload",
      },
      {
        title: "Pretočno prikazovanje",
        description: "Povzetek se prikazuje sproti, medtem ko ga AI ustvarja. Ni čakanja na celoten rezultat — besedilo se izpisuje v realnem času.",
        points: [
          "Rezultat v realnem času",
          "Brez čakanja na celoten povzetek",
          "Kopiranje in nadaljnja uporaba",
        ],
        screenshotKey: "ai-povzetek-stream",
      },
    ],
    faq: [
      { q: "Katere datoteke lahko naložim?", a: "Podpiramo PDF, DOCX, PPTX in XLSX formate. Lahko pa tudi prilepite besedilo neposredno." },
      { q: "Kako dolg je lahko dokument?", a: "AI lahko obdela dokumente do nekaj tisoč besed. Za zelo dolge dokumente priporočamo povzemanje po poglavjih." },
      { q: "Ali povzetek ohranja ključne informacije?", a: "Da, AI identificira najpomembnejše informacije in jih vključi v povzetek, ne glede na izbrani način." },
      { q: "Ali lahko povzamem besedilo v tujem jeziku?", a: "Da, AI razume besedila v številnih jezikih in ustvari povzetek v slovenščini." },
    ],
  },
  {
    slug: "ai-ucenje",
    title: "AI Učenje",
    shortDesc: "Ustvarite učne kartice, kvize in preizkuse iz kateregakoli besedila ali dokumenta.",
    icon: GraduationCap,
    category: "Učenje",
    heroTitle: "AI Učenje — učno gradivo v sekundah",
    heroDescription: "Naložite dokument ali prilepite besedilo in AI ustvari učne kartice, kvize ali preizkuse. Idealno za študente, dijake in učitelje — pripravite se na izpite hitreje kot kdajkoli.",
    appPath: "/ai-ucenje",
    sections: [
      {
        title: "Učne kartice",
        description: "AI ustvari kartice z vprašanji na eni strani in odgovori na drugi. Idealno za učenje definicij, pojmov in ključnih dejstev iz kateregakoli gradiva.",
        points: [
          "Vprašanje in odgovor na vsaki kartici",
          "Samodejno generiranje iz besedila",
          "Podpora za vse predmete in teme",
        ],
        screenshotKey: "ai-ucenje-cards",
      },
      {
        title: "Kvizi z ocenjevanjem",
        description: "Ustvarite kvize z večizbirnimi vprašanji. AI generira vprašanja, možne odgovore in pravilne rešitve — preverite svoje znanje v nekaj klikih.",
        points: [
          "Večizbirna vprašanja",
          "Samodejno ocenjevanje",
          "Razlaga pravilnih odgovorov",
        ],
        screenshotKey: "ai-ucenje-quiz",
      },
      {
        title: "Preizkusi",
        description: "Pripravite se na izpite z generiranimi preizkusi. AI ustvari vprašanja različnih zahtevnostnih stopenj za temeljito preverjanje znanja.",
        points: [
          "Vprašanja različnih zahtevnosti",
          "Simulacija izpitnih pogojev",
          "Podrobne rešitve",
        ],
        screenshotKey: "ai-ucenje-test",
      },
    ],
    faq: [
      { q: "Iz katerih gradiv lahko ustvarim učno gradivo?", a: "Iz kateregakoli besedila — učbenikov, skript, zapiskov, člankov. Naložite PDF, DOCX, PPTX ali XLSX ali prilepite besedilo." },
      { q: "Ali so vprašanja kakovostna?", a: "Da, AI generira vprašanja, ki pokrivajo ključne koncepte in dejstva iz gradiva. Za najboljše rezultate uporabite jasno strukturirano besedilo." },
      { q: "Ali lahko izberem število kartic ali vprašanj?", a: "AI samodejno prilagodi število glede na obseg gradiva. Običajno generira 5–15 kartic ali vprašanj." },
      { q: "V katerem jeziku so učne kartice?", a: "V slovenščini. AI razume tudi tujejezična gradiva in ustvari kartice v slovenščini." },
    ],
  },
];

export const categories = [
  { name: "Besedila", color: "#FEB089" },
  { name: "Grafika", color: "#EE94B0" },
  { name: "Zvok", color: "#D797A6" },
  { name: "Analiza", color: "#EFBC9F" },
  { name: "Učenje", color: "#B8A9E8" },
  { name: "Orodja", color: "#FF9ED1" },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
