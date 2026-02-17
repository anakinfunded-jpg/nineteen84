export type ScheduledTopic = {
  id: string;
  day_number: number;
  title_hint: string;
  topic: string;
  category: string;
  keywords: string[];
  image_prompt: string;
};

export const scheduledTopics: ScheduledTopic[] = [
  // ============================================================
  // DAYS 1-10: AI FUNDAMENTALS
  // ============================================================
  {
    id: 'day-01',
    day_number: 1,
    title_hint: 'Kaj je globoko učenje in zakaj spreminja svet',
    topic:
      'Napiši obsežen članek o globokem učenju (deep learning) za slovensko občinstvo. Razloži, kaj so nevronske mreže z več plastmi, kako se razlikujejo od klasičnega strojnega učenja in zakaj je globoko učenje revolucionarno za prepoznavanje slik, govora in besedil. Vključi praktične primere uporabe v vsakdanjem življenju (prepoznavanje obrazov, glasovni pomočniki, avtonomna vožnja). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['globoko učenje', 'deep learning', 'nevronske mreže', 'strojno učenje', 'umetna inteligenca'],
    image_prompt:
      'Abstract visualization of deep neural network layers, glowing interconnected nodes in warm salmon and rose gradients against a dark background, digital art style, no text',
  },
  {
    id: 'day-02',
    day_number: 2,
    title_hint: 'Obdelava naravnega jezika: kako AI razume slovenščino',
    topic:
      'Napiši članek o obdelavi naravnega jezika (NLP) s poudarkom na slovenščini. Razloži osnove NLP — tokenizacijo, lematizacijo, analizo sentimenta — in pojasni, zakaj je slovenščina kot morfološko bogat jezik poseben izziv za NLP sisteme. Omeni konkretne primere uporabe NLP v slovenskem prostoru (strojno prevajanje, chatboti, analiza besedil). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['NLP', 'obdelava naravnega jezika', 'slovenščina', 'jezikovna tehnologija', 'analiza besedil'],
    image_prompt:
      'Abstract flowing streams of multilingual text transforming into light particles, warm peach and pink tones on dark background, ethereal digital art, no text no letters',
  },
  {
    id: 'day-03',
    day_number: 3,
    title_hint: 'Računalniški vid: ko stroji začnejo videti',
    topic:
      'Napiši članek o računalniškem vidu (computer vision) za začetnike. Razloži, kako AI analizira slike in video, kakšne so ključne naloge (klasifikacija, detekcija objektov, segmentacija) in katere industrije najbolj uporabljajo računalniški vid (medicina, avtomobilska industrija, varnost, kmetijstvo). Vključi razlago konvolucijskih nevronskih mrež na preprost način. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['računalniški vid', 'computer vision', 'prepoznavanje slik', 'CNN', 'detekcija objektov'],
    image_prompt:
      'Abstract digital eye composed of geometric shapes and light beams scanning a landscape, warm gradient colors salmon to rose, dark moody background, futuristic art, no text',
  },
  {
    id: 'day-04',
    day_number: 4,
    title_hint: 'Nevronske mreže od A do Ž: celoten vodnik',
    topic:
      'Napiši podroben vodnik o nevronskih mrežah za slovensko občinstvo brez tehničnega predznanja. Začni z biološko inspiracijo (človeški možgani), razloži umetni nevron, plasti mreže (vhodna, skrite, izhodna), aktivacijske funkcije in učenje z vzvratnim razširjanjem. Uporabi preproste analogije iz vsakdanjega življenja. Zaključi s pregledom različnih tipov mrež (CNN, RNN, transformerji). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['nevronske mreže', 'umetni nevron', 'učenje', 'aktivacijske funkcije', 'vzvratno razširjanje'],
    image_prompt:
      'Interconnected luminous spheres forming a brain-like network structure, warm salmon and rose light pulses traveling between nodes, dark cosmic background, abstract digital art, no text',
  },
  {
    id: 'day-05',
    day_number: 5,
    title_hint: 'Reinforcement learning: kako se AI uči iz poskusov in napak',
    topic:
      'Napiši članek o spodbujevalnem učenju (reinforcement learning). Razloži osnovni koncept agenta, okolja, nagrade in kazni na razumljiv način. Predstavi slavne primere (AlphaGo, robotika, igre) in pojasni, kako se reinforcement learning razlikuje od nadzorovanega in nenadzorovanega učenja. Omeni praktične uporabe v industriji in potencialne prihodnje aplikacije. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['reinforcement learning', 'spodbujevalno učenje', 'AlphaGo', 'AI agent', 'nagrada'],
    image_prompt:
      'Abstract maze with a glowing path being discovered by a luminous entity, warm peach and coral tones, trial and error visualization with branching paths, dark background, no text',
  },
  {
    id: 'day-06',
    day_number: 6,
    title_hint: 'Generativna umetna inteligenca: od ChatGPT do ustvarjanja slik',
    topic:
      'Napiši članek o generativni umetni inteligenci za slovensko občinstvo. Razloži, kako delujejo veliki jezikovni modeli (LLM), difuzijski modeli za slike in generativni modeli za zvok. Primerjaj različne pristope (GPT, Claude, Midjourney, DALL-E, Stable Diffusion) in pojasni, kako se generativna AI razlikuje od diskriminativne. Vključi konkretne primere uporabe za posameznike in podjetja. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['generativna AI', 'ChatGPT', 'Claude', 'ustvarjanje slik', 'LLM', 'veliki jezikovni modeli'],
    image_prompt:
      'Abstract creative explosion of digital art elements - brushstrokes, musical notes, text fragments - emerging from a central AI core, warm salmon and rose palette, dark background, no text',
  },
  {
    id: 'day-07',
    day_number: 7,
    title_hint: 'Tokenizacija: kako AI razbije besedilo na koščke',
    topic:
      'Napiši tehnični a razumljiv članek o tokenizaciji v kontekstu velikih jezikovnih modelov. Razloži, kaj so tokeni, zakaj AI ne bere besed kot ljudje, kako deluje BPE (Byte Pair Encoding) in SentencePiece, ter zakaj je tokenizacija pomembna za razumevanje stroškov API klicev. Pokaži posebnosti tokenizacije za slovenščino (daljši tokeni, več žetonov na besedo). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['tokenizacija', 'tokeni', 'BPE', 'jezikovni modeli', 'API', 'slovenščina'],
    image_prompt:
      'Abstract visualization of text being broken into colorful floating segments, warm gradient pieces in peach and salmon assembling and disassembling, minimalist dark background, no text no letters',
  },
  {
    id: 'day-08',
    day_number: 8,
    title_hint: 'Embeddingi: kako AI razume pomen besed',
    topic:
      'Napiši članek o embeddingih (vektorskih vložitvah) za slovensko občinstvo. Razloži, kako AI pretvori besede in stavke v številčne vektorje, zakaj so podobni pomeni blizu v vektorskem prostoru in kako to omogoča iskanje, priporočilne sisteme ter semantično razumevanje besedil. Uporabi vizualne analogije (točke v prostoru). Omeni praktične uporabe, vključno z RAG sistemi. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['embeddingi', 'vektorji', 'semantično iskanje', 'vektorski prostor', 'RAG'],
    image_prompt:
      'Abstract 3D space with floating luminous points clustered by similarity, warm peach and rose colored dots forming constellations of meaning, dark cosmic void background, no text',
  },
  {
    id: 'day-09',
    day_number: 9,
    title_hint: 'Fine-tuning: kako prilagodite AI model svojim potrebam',
    topic:
      'Napiši praktičen članek o fine-tuningu AI modelov za slovensko občinstvo. Razloži razliko med predučenim modelom in fino uglašenim modelom, kdaj je fine-tuning smiseln (in kdaj ne), kako pripraviti podatke za fino uglaševanje ter kakšni so stroški in časovni okvirji. Primerjaj fine-tuning z alternativami kot so prompt engineering in RAG. Vključi konkretne primere za slovenska podjetja. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['fine-tuning', 'fino uglaševanje', 'prilagoditev modela', 'podatki za učenje', 'prompt engineering'],
    image_prompt:
      'Abstract visualization of a large structure being carefully refined and adjusted with precise tools of light, warm salmon and gold tones, delicate adjustment metaphor, dark background, no text',
  },
  {
    id: 'day-10',
    day_number: 10,
    title_hint: 'Transfer learning: zakaj AI ne začne od ničle',
    topic:
      'Napiši članek o prenosnem učenju (transfer learning) za slovensko občinstvo. Razloži, zakaj je transfer learning tako pomemben za demokratizacijo AI — kako model, učen na ogromnih podatkih, prenese znanje na specifične naloge z malo podatki. Omeni primere iz prakse (BERT za slovenščino, predučeni slikovni modeli za medicinsko diagnostiko). Pojasni razliko med feature extraction in fine-tuning pristopoma. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['transfer learning', 'prenosno učenje', 'predučeni modeli', 'BERT', 'demokratizacija AI'],
    image_prompt:
      'Abstract flowing knowledge transfer between two luminous brain-like structures, streams of warm light connecting them, peach and rose gradients, dark background suggesting knowledge flow, no text',
  },

  // ============================================================
  // DAYS 11-20: CONTENT CREATION WITH AI
  // ============================================================
  {
    id: 'day-11',
    day_number: 11,
    title_hint: '10 korakov do odličnega blog članka z AI',
    topic:
      'Napiši praktičen vodnik za pisanje blog člankov s pomočjo AI orodij, prilagojen za slovensko občinstvo. Razloži celoten postopek od izbire teme, raziskave ključnih besed, strukturiranja članka, pisanja osnutka z AI, do urejanja in optimizacije. Vključi konkretne nasvete za uporabo platforme 1984 za generiranje blogov v slovenščini. Opozori na pogoste napake (preveč zanašanja na AI, pomanjkanje osebnega stila). Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['blog pisanje', 'AI pisanje', 'vsebinski marketing', 'blog strategija', 'slovensko bloganje'],
    image_prompt:
      'Abstract visualization of a document being crafted with flowing light strokes, warm salmon and peach editorial design elements floating in space, dark background, creative process metaphor, no text',
  },
  {
    id: 'day-12',
    day_number: 12,
    title_hint: 'Kako AI piše opise izdelkov, ki prodajajo',
    topic:
      'Napiši članek o uporabi AI za pisanje opisov izdelkov v spletnih trgovinah. Razloži, kako napisati dober prompt za generiranje prepričljivih opisov, kateri elementi morajo biti prisotni (koristi, ne lastnosti; čustveni sprožilci; SEO ključne besede). Predstavi primere za različne industrije (moda, elektronika, hrana) v slovenščini. Pojasni, kako platforma 1984 pomaga pri masovnem generiranju opisov. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['opisi izdelkov', 'e-trgovina', 'prodajno pisanje', 'copywriting', 'spletna trgovina'],
    image_prompt:
      'Abstract shopping and product elements floating in a digital space, warm gradient gift boxes and price tags composed of light particles, peach and coral palette, dark background, no text',
  },
  {
    id: 'day-13',
    day_number: 13,
    title_hint: 'AI strategija za družbena omrežja: od ideje do objave',
    topic:
      'Napiši članek o uporabi AI za upravljanje družbenih omrežij za slovenska podjetja. Pokrij generiranje idej za objave, pisanje besedil za Instagram, Facebook, LinkedIn in TikTok, prilagajanje tona za vsako platformo ter planiranje vsebinskega koledarja. Vključi konkretne primere promptov v slovenščini in nasvete za avtentičnost kljub uporabi AI. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['družbena omrežja', 'social media', 'Instagram', 'LinkedIn', 'vsebinski koledar', 'AI objave'],
    image_prompt:
      'Abstract social media network visualization with interconnected floating cards and reaction symbols made of warm light, salmon and rose gradient, dark background, modern digital art, no text',
  },
  {
    id: 'day-14',
    day_number: 14,
    title_hint: 'Email marketing z AI: višje odpiralne stopnje v slovenščini',
    topic:
      'Napiši članek o uporabi AI za email marketing v slovenskem jeziku. Pokrij pisanje zadevnih vrstic (subject lines), segmentacijo občinstva, personalizacijo sporočil, A/B testiranje z AI in avtomatizacijo email sekvenc. Vključi statistike o email marketingu in konkretne primere dobrih praks. Pojasni, kako s platformo 1984 ustvariti email vsebine, ki resonirajo s slovenskim občinstvom. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['email marketing', 'newsletter', 'zadevna vrstica', 'personalizacija', 'avtomatizacija'],
    image_prompt:
      'Abstract email envelopes transforming into warm light streams reaching multiple points, peach and salmon gradient, communication network visualization, dark background, no text',
  },
  {
    id: 'day-15',
    day_number: 15,
    title_hint: 'SEO besedila z AI: kako pisati za Google in bralce hkrati',
    topic:
      'Napiši podroben vodnik o pisanju SEO optimiziranih besedil s pomočjo AI za slovenski trg. Razloži strategijo ključnih besed za slovenščino, optimizacijo naslovov (H1, H2), meta opisov, strukturo besedila za iskalnike in pomen notranjega povezovanja. Pojasni, kako uporabiti AI za raziskavo tem in generiranje SEO vsebin, ne da bi žrtvovali berljivost. Vključi specifične nasvete za Google.si. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['SEO', 'optimizacija za iskalnike', 'ključne besede', 'Google', 'meta opisi', 'vsebinski marketing'],
    image_prompt:
      'Abstract search engine visualization with magnifying glass revealing layers of structured content, warm peach and salmon light beams, ranking ladder metaphor, dark background, no text',
  },
  {
    id: 'day-16',
    day_number: 16,
    title_hint: 'AI za oglaševalska besedila: Google Ads in Meta oglasi',
    topic:
      'Napiši članek o uporabi AI za pisanje oglaševalskih besedil za digitalno oglaševanje. Pokrij Google Ads (iskalne oglase, responsive oglase), Meta oglase (Facebook, Instagram) in LinkedIn oglase. Razloži, kako z AI testirati različne variante, prilagoditi besedila ciljnim skupinam in optimizirati konverzije. Vključi primere uspešnih oglasnih besedil v slovenščini. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['oglaševanje', 'Google Ads', 'Facebook oglasi', 'copywriting', 'konverzije', 'digitalni marketing'],
    image_prompt:
      'Abstract digital advertising concept with floating ad frames and click-through visualizations, warm salmon gradient light beams targeting audience dots, dark background, no text',
  },
  {
    id: 'day-17',
    day_number: 17,
    title_hint: 'Storytelling z AI: kako pripovedovati zgodbe, ki prepričajo',
    topic:
      'Napiši članek o uporabi AI za storytelling v poslovnem in marketinškem kontekstu. Razloži osnove dobre zgodbe (junak, konflikt, razrešitev), kako AI pomaga pri strukturiranju pripovedi, generiranju idej za zgodbe blagovnih znamk in pisanju čustveno angažirajočih vsebin. Vključi primere uspešnega storytellinga slovenskih podjetij in kako AI orodja pomagajo ohraniti avtentičnost. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['storytelling', 'pripovedovanje zgodb', 'blagovna znamka', 'vsebinski marketing', 'zgodba'],
    image_prompt:
      'Abstract open book with luminous story elements floating upward - characters, scenes, emotions as warm light particles, peach and rose palette, dark enchanting background, no text',
  },
  {
    id: 'day-18',
    day_number: 18,
    title_hint: 'Kako napisati video skripto z AI v 30 minutah',
    topic:
      'Napiši praktičen vodnik za pisanje video skript s pomočjo AI. Pokrij različne formate (YouTube tutorial, kratki promo video, explainer video, TikTok vsebina) in razloži strukturo dobre skripte (hook, vsebina, CTA). Vključi konkretne prompte za generiranje skript v slovenščini in nasvete za prilagajanje AI-generiranega besedila govorjenemu jeziku. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['video skripta', 'YouTube', 'TikTok', 'video marketing', 'vsebinska produkcija'],
    image_prompt:
      'Abstract film reel and clapperboard dissolving into flowing script lines of warm light, salmon and peach gradient, cinematic creative process visualization, dark background, no text',
  },
  {
    id: 'day-19',
    day_number: 19,
    title_hint: 'Podcast vsebine z AI: od načrtovanja do transkripcije',
    topic:
      'Napiši članek o uporabi AI skozi celoten proces podcastinga. Pokrij generiranje idej za epizode, pisanje orisov in skript, ustvarjanje show notes, transkripcijo epizod z AI, pretvorbo v blog članke in promocijo na družbenih omrežjih. Vključi nasvete za slovenski podcast trg in kako platforma 1984 pomaga pri zvočnih vsebinah (TTS, STT). Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['podcast', 'transkripcija', 'zvočne vsebine', 'show notes', 'TTS', 'STT'],
    image_prompt:
      'Abstract podcast microphone emitting warm sound waves that transform into text and visual elements, peach and salmon gradient flowing audio visualization, dark background, no text',
  },
  {
    id: 'day-20',
    day_number: 20,
    title_hint: 'Newsletter z AI: kako graditi zvesto občinstvo',
    topic:
      'Napiši članek o ustvarjanju newsletterja s pomočjo AI za slovensko občinstvo. Razloži strategijo vsebine (izobraževanje vs. promocija), kako AI pomaga pri redni produkciji, personalizaciji in analizi uspešnosti. Vključi nasvete za gradnjo email seznama, optimizacijo odpiralne stopnje in primere uspešnih newsletterjev. Pojasni, kako s platformo 1984 poenostaviti celoten proces. Članek naj bo dolg 800-1200 besed.',
    category: 'Nasveti',
    keywords: ['newsletter', 'email seznam', 'vsebinska strategija', 'občinstvo', 'lojalnost'],
    image_prompt:
      'Abstract newsletter concept with floating email cards forming a growing community network, warm peach and rose connections between readers, dark background, engagement visualization, no text',
  },

  // ============================================================
  // DAYS 21-30: AI BY INDUSTRY
  // ============================================================
  {
    id: 'day-21',
    day_number: 21,
    title_hint: 'AI v slovenskem pravnem sektorju: priložnosti in izzivi',
    topic:
      'Napiši članek o uporabi AI v pravni stroki v Sloveniji. Pokrij avtomatizirano analizo pogodb, iskanje po sodni praksi, generiranje pravnih dokumentov, due diligence in compliance. Razloži specifične izzive (zakonodajni okvir, zaupnost, slovensko pravo) in priložnosti za odvetniške pisarne. Omeni, kako platforma 1984 pomaga pri pisanju pravnih besedil v slovenščini. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['pravo', 'pravni sektor', 'pogodbe', 'sodna praksa', 'compliance', 'legal tech'],
    image_prompt:
      'Abstract scales of justice intertwined with digital neural pathways, warm salmon and gold light, legal documents transforming into data streams, dark dramatic background, no text',
  },
  {
    id: 'day-22',
    day_number: 22,
    title_hint: 'AI v medicini: od diagnostike do personaliziranega zdravljenja',
    topic:
      'Napiši članek o uporabi AI v zdravstvu s poudarkom na slovenskem kontekstu. Pokrij AI diagnostiko (radiologija, patologija), napovedne modele za bolezni, personalizirano medicino, AI v farmaciji in digitalno zdravje. Omeni slovenske projekte in institucije, ki že uporabljajo AI. Razloži etične vidike in regulativo (GDPR, medicinski podatki). Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['medicina', 'zdravstvo', 'diagnostika', 'personalizirana medicina', 'digitalno zdravje'],
    image_prompt:
      'Abstract medical cross symbol made of interconnected AI nodes and warm light, DNA strands intertwining with neural networks, salmon and rose palette, dark background, no text',
  },
  {
    id: 'day-23',
    day_number: 23,
    title_hint: 'AI v financah: revolucija v bančništvu in investiranju',
    topic:
      'Napiši članek o uporabi AI v finančnem sektorju za slovensko občinstvo. Pokrij algoritemsko trgovanje, odkrivanje goljufij, kreditno ocenjevanje z AI, chatbote za bančništvo, robo-svetovalce in analizo tveganj. Razloži, kako slovenske banke in zavarovalnice že uporabljajo AI ter kakšne so prihodnje priložnosti. Omeni regulativne zahteve (PSD2, AI Act). Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['finance', 'bančništvo', 'investiranje', 'goljufije', 'fintech', 'algoritemsko trgovanje'],
    image_prompt:
      'Abstract financial chart lines transforming into neural network patterns, warm gold and salmon light streams, currency and data visualization fusion, dark background, no text',
  },
  {
    id: 'day-24',
    day_number: 24,
    title_hint: 'AI v turizmu: kako slovenska turistična podjetja izkoristijo umetno inteligenco',
    topic:
      'Napiši članek o uporabi AI v turizmu s poudarkom na slovenskem turističnem sektorju. Pokrij personalizirane priporočilne sisteme, dinamično določanje cen, chatbote za rezervacije, AI-generirane opise nastanitev in destinacij, analizo mnenj gostov in optimizacijo marketinga. Vključi konkretne primere za Slovenijo (Bled, Ljubljana, obala). Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['turizem', 'potovanja', 'rezervacije', 'personalizacija', 'slovenski turizem', 'chatbot'],
    image_prompt:
      'Abstract travel destination elements - mountains, lakes, architecture - rendered as warm light data points connected by AI pathways, peach and salmon palette, dark background, no text',
  },
  {
    id: 'day-25',
    day_number: 25,
    title_hint: 'AI v nepremičninah: pametno trženje in vrednotenje',
    topic:
      'Napiši članek o uporabi AI v nepremičninskem sektorju za slovenski trg. Pokrij avtomatizirano vrednotenje nepremičnin, generiranje opisov za oglase, virtualne ogle, napovedne modele za cene, segmentacijo kupcev in AI-podprto trženje. Razloži, kako lahko slovenske nepremičninske agencije uporabijo platformo 1984 za pisanje oglasov in opisov v slovenščini. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['nepremičnine', 'vrednotenje', 'oglasi', 'trženje nepremičnin', 'napovedni modeli'],
    image_prompt:
      'Abstract house silhouettes connected by warm AI data streams, property value visualization with floating numbers and graphs in salmon and peach tones, dark background, no text',
  },
  {
    id: 'day-26',
    day_number: 26,
    title_hint: 'AI v gostinstvu: od jedilnikov do personalizirane izkušnje',
    topic:
      'Napiši članek o uporabi AI v gostinstvu za slovensko občinstvo. Pokrij optimizacijo jedilnikov, napovedovanje povpraševanja, upravljanje zalog, personalizirane priporočilne sisteme, AI chatbote za rezervacije in analizo ocen na Google ter TripAdvisor. Vključi nasvete za slovenske restavracije in hotele, kako lahko AI izboljša njihovo poslovanje. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['gostinstvo', 'restavracije', 'hoteli', 'jedilnik', 'ocene gostov', 'rezervacije'],
    image_prompt:
      'Abstract restaurant and hospitality elements - plates, utensils, hotel keys - composed of warm digital light particles connected by AI networks, salmon and peach palette, dark background, no text',
  },
  {
    id: 'day-27',
    day_number: 27,
    title_hint: 'AI v športu: podatki, ki zmagujejo tekme',
    topic:
      'Napiši članek o uporabi AI v športu za slovensko občinstvo. Pokrij analizo tekem z AI, napovedovanje rezultatov, personalizirane treninge, preprečevanje poškodb, AI v športnem novinarstvu in navijaškem angažiranju. Omeni primere iz slovenskega športa (košarka, smučanje, kolesarstvo) in kako AI spreminja način treniranja in tekmovanja. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['šport', 'športna analitika', 'treningi', 'napovedovanje', 'slovenski šport'],
    image_prompt:
      'Abstract athletic figure in motion surrounded by flowing data streams and performance metrics in warm light, salmon and peach gradient trails, dynamic composition, dark background, no text',
  },
  {
    id: 'day-28',
    day_number: 28,
    title_hint: 'AI v kmetijstvu: pametno kmetovanje za Slovenijo',
    topic:
      'Napiši članek o uporabi AI v kmetijstvu s poudarkom na slovenskem prostoru. Pokrij precizno kmetijstvo, dronske analize posevkov, napovedovanje vremena z AI, avtomatizirano škropljenje, odkrivanje bolezni rastlin in optimizacijo pridelave. Razloži, zakaj je AI posebej relevanten za slovensko kmetijstvo (majhne parcele, raznolik teren, ekološko kmetovanje). Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['kmetijstvo', 'precizno kmetijstvo', 'droni', 'posevki', 'ekološko kmetovanje'],
    image_prompt:
      'Abstract agricultural landscape with crops monitored by warm light AI sensor networks, drone visualization with data overlay, peach and green accent tones, dark background, no text',
  },
  {
    id: 'day-29',
    day_number: 29,
    title_hint: 'AI v logistiki: pametnejše dobavne verige',
    topic:
      'Napiši članek o uporabi AI v logistiki in dobavnih verigah za slovensko občinstvo. Pokrij optimizacijo poti, napovedovanje povpraševanja, avtonomna skladišča, pametno upravljanje zalog, zadnjo miljo dostave in analitiko v realnem času. Razloži, kako lahko slovenska logistična podjetja (Pošta Slovenije, BTC Logistika) izkoristijo AI za konkurenčno prednost. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['logistika', 'dobavna veriga', 'optimizacija', 'skladiščenje', 'dostava', 'avtomatizacija'],
    image_prompt:
      'Abstract supply chain network with glowing route lines connecting warehouse and delivery nodes, warm salmon and peach gradient paths, efficiency optimization visualization, dark background, no text',
  },
  {
    id: 'day-30',
    day_number: 30,
    title_hint: 'AI v zavarovalništvu: od ocenjevanja tveganj do obravnave škod',
    topic:
      'Napiši članek o uporabi AI v zavarovalništvu za slovensko občinstvo. Pokrij avtomatizirano ocenjevanje tveganj, odkrivanje goljufij, chatbote za stranke, pametno obravnavo škodnih zahtevkov, personalizirane zavarovalne police in telematiko. Razloži, kako lahko slovenske zavarovalnice (Triglav, Generali, Sava) uporabijo AI za boljšo uporabniško izkušnjo in nižje stroške. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['zavarovalništvo', 'tveganja', 'goljufije', 'škodni zahtevki', 'telematika', 'insurtech'],
    image_prompt:
      'Abstract shield symbol protecting digital assets with warm AI analysis streams flowing around it, risk assessment visualization in salmon and gold tones, dark background, no text',
  },

  // ============================================================
  // DAYS 31-40: ADVANCED TECHNIQUES
  // ============================================================
  {
    id: 'day-31',
    day_number: 31,
    title_hint: 'RAG: kako AI prebere vaše dokumente in odgovori na vprašanja',
    topic:
      'Napiši podroben tehnični članek o RAG (Retrieval-Augmented Generation) za slovensko občinstvo. Razloži arhitekturo RAG sistema (indeksiranje dokumentov, vektorsko iskanje, generiranje odgovorov), zakaj je RAG boljši od čistega fine-tuninga za določene naloge in kako preprečuje halucinacije. Vključi praktičen primer implementacije in omeni, kako platforma 1984 uporablja RAG za funkcijo AI Spomin. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['RAG', 'retrieval augmented generation', 'vektorsko iskanje', 'dokumenti', 'halucinacije'],
    image_prompt:
      'Abstract document library with pages transforming into searchable light vectors converging on an answer point, warm peach and salmon gradient, knowledge retrieval visualization, dark background, no text',
  },
  {
    id: 'day-32',
    day_number: 32,
    title_hint: 'Fine-tuning v praksi: kdaj, kako in za koliko',
    topic:
      'Napiši napreden praktičen članek o fine-tuningu AI modelov. Razloži različne pristope (full fine-tuning, LoRA, QLoRA), kako pripraviti kvaliteten dataset, metriko za evalvacijo in stroškovne vidike. Primerjaj fine-tuning pri OpenAI, Anthropic in odprtokodnih modelih. Vključi konkretne primere, kdaj je fine-tuning smiseln za slovenska podjetja in kdaj je bolje uporabiti prompt engineering ali RAG. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['fine-tuning', 'LoRA', 'QLoRA', 'dataset', 'evalvacija', 'optimizacija modela'],
    image_prompt:
      'Abstract AI model being precisely calibrated with fine adjustment tools made of warm light, LoRA adapter rings glowing in salmon and peach, technical refinement visualization, dark background, no text',
  },
  {
    id: 'day-33',
    day_number: 33,
    title_hint: 'Prompt chaining: kako povezati več AI klicev v eno rešitev',
    topic:
      'Napiši članek o prompt chainingu (veriženju promptov) za napredne uporabnike. Razloži, kako razdeliti kompleksno nalogo na manjše korake, vsak obdelan s svojim promptom, in kako rezultat enega koraka postane vhod za naslednjega. Predstavi praktične primere (avtomatizirano pisanje poročil, večstopenjska analiza besedil, generiranje in revidiranje vsebin). Vključi diagrame poteka in konkretne prompte. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['prompt chaining', 'veriženje promptov', 'avtomatizacija', 'workflow', 'večstopenjski proces'],
    image_prompt:
      'Abstract chain of interconnected glowing processing nodes, each transforming data to the next, warm salmon and peach flowing pipeline visualization, dark background, no text',
  },
  {
    id: 'day-34',
    day_number: 34,
    title_hint: 'AI agenti: ko AI postane samostojen delavec',
    topic:
      'Napiši članek o AI agentih za slovensko občinstvo. Razloži, kaj so AI agenti (avtonomni sistemi, ki načrtujejo, izvajajo in se prilagajajo), kako se razlikujejo od preprostih chatbotov, katere okvire uporabljamo (LangChain, AutoGPT, CrewAI) in kakšne so praktične uporabe (raziskovalni agenti, kodirni pomočniki, poslovni avtomati). Omeni tveganja in omejitve trenutne generacije agentov. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['AI agenti', 'avtonomni sistemi', 'LangChain', 'avtomatizacija', 'poslovni procesi'],
    image_prompt:
      'Abstract autonomous AI agent figure navigating a complex task landscape, warm light trails showing decision paths, peach and salmon gradient, problem-solving visualization, dark background, no text',
  },
  {
    id: 'day-35',
    day_number: 35,
    title_hint: 'Multimodalni modeli: AI, ki vidi, sliši in piše',
    topic:
      'Napiši članek o multimodalnih AI modelih za slovensko občinstvo. Razloži, kako modeli kot GPT-4o, Claude in Gemini obdelujejo tekst, slike, zvok in video hkrati. Predstavi praktične uporabe (analiza slik z besedilom, generiranje slik iz opisov, transkribiranje in prevajanje video vsebin). Pojasni, kako platforma 1984 združuje različne modalnosti (besedilo, slike, zvok, OCR). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['multimodalni modeli', 'GPT-4o', 'Claude', 'slike', 'zvok', 'video'],
    image_prompt:
      'Abstract convergence of different media types - text, images, sound waves, video frames - merging into a unified AI core, warm salmon and peach harmonious blend, dark background, no text',
  },
  {
    id: 'day-36',
    day_number: 36,
    title_hint: 'Vektorske baze podatkov: temelj modernih AI aplikacij',
    topic:
      'Napiši tehnični a dostopen članek o vektorskih bazah podatkov. Razloži, kaj so vektorske baze (Pinecone, Weaviate, pgvector, Qdrant), kako deluje približno iskanje najbližjih sosedov (ANN), zakaj so ključne za RAG, priporočilne sisteme in semantično iskanje. Primerjaj različne rešitve in pojasni, kdaj izbrati katero. Omeni, kako platforma 1984 uporablja pgvector za funkcijo AI Spomin. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['vektorske baze', 'pgvector', 'Pinecone', 'ANN', 'semantično iskanje', 'embeddingi'],
    image_prompt:
      'Abstract multidimensional vector space with clustered data points connected by similarity lines, warm peach and salmon gradient clusters, geometric database visualization, dark background, no text',
  },
  {
    id: 'day-37',
    day_number: 37,
    title_hint: 'Few-shot learning: ko AI potrebuje le nekaj primerov',
    topic:
      'Napiši članek o few-shot learningu za slovensko občinstvo. Razloži, kako veliki jezikovni modeli iz le nekaj primerov v promptu razumejo vzorec in ga posnemajo, zakaj je to revolucionarno za podjetja brez velikih datasetov in kako napisati učinkovite few-shot prompte. Primerjaj zero-shot, one-shot in few-shot pristope s konkretnimi primeri v slovenščini. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['few-shot learning', 'zero-shot', 'prompt engineering', 'primeri', 'vzorčno učenje'],
    image_prompt:
      'Abstract visualization of learning from few examples - three small seed lights growing into a full understanding pattern, warm peach and salmon gradient, knowledge amplification metaphor, dark background, no text',
  },
  {
    id: 'day-38',
    day_number: 38,
    title_hint: 'Chain-of-thought: kako AI razmišlja korak za korakom',
    topic:
      'Napiši članek o chain-of-thought (veriga misli) tehniki za promptanje. Razloži, zakaj vprašanje "razloži korak za korakom" dramatično izboljša rezultate AI, kako CoT deluje interno v modelu, kdaj je najbolj učinkovit (matematika, logika, kompleksne analize) in kako ga uporabiti v praksi. Vključi primere dobrih CoT promptov v slovenščini in primerjaj rezultate brez in s CoT. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['chain-of-thought', 'veriga misli', 'prompt engineering', 'razmišljanje', 'logika'],
    image_prompt:
      'Abstract stepping stones of thought leading from question to answer, each step glowing warmer in salmon and peach gradient, logical progression visualization, dark background, no text',
  },
  {
    id: 'day-39',
    day_number: 39,
    title_hint: 'AI orkestracija: upravljanje več modelov za boljše rezultate',
    topic:
      'Napiši članek o AI orkestraciji za slovensko občinstvo. Razloži, kako kombiniranje več AI modelov (npr. Eden za analizo, drugi za pisanje, tretji za preverjanje) daje boljše rezultate kot en sam model. Predstavi koncepte kot so model routing, fallback strategije, ensemble metode in orodja za orkestracijo (LangChain, LlamaIndex). Pojasni, kako platforma 1984 uporablja auto-routing med modeli. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['AI orkestracija', 'model routing', 'ensemble', 'LangChain', 'avtomatizacija'],
    image_prompt:
      'Abstract conductor orchestrating multiple AI model spheres, warm light batons directing data flows between glowing nodes, salmon and peach harmony visualization, dark background, no text',
  },
  {
    id: 'day-40',
    day_number: 40,
    title_hint: 'API integracije: kako vgradite AI v svojo aplikacijo',
    topic:
      'Napiši praktičen članek o integraciji AI API-jev v aplikacije za slovensko razvijalsko občinstvo. Pokrij primerjavo API-jev (OpenAI, Anthropic, Google), avtentikacijo, upravljanje stroškov, rate limiting, streaming odgovorov in error handling. Vključi primere kode (JavaScript/TypeScript) in nasvete za produkcijsko uporabo. Omeni, kako API platforma 1984 poenostavlja dostop za slovenska podjetja. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['API', 'integracija', 'OpenAI', 'Anthropic', 'razvijalci', 'programiranje'],
    image_prompt:
      'Abstract API connection visualization with code brackets and data packets flowing between systems, warm peach and salmon gradient streams, developer tools floating, dark background, no text',
  },

  // ============================================================
  // DAYS 41-50: AI ETHICS & FUTURE
  // ============================================================
  {
    id: 'day-41',
    day_number: 41,
    title_hint: 'Pristranskost AI: zakaj algoritmi niso nevtralni',
    topic:
      'Napiši kritičen članek o pristranskosti v AI sistemih za slovensko občinstvo. Razloži, kako pristranskost nastane (pristranski podatki, nagnjenost razvijalcev, sistemski dejavniki), kakšne so posledice (diskriminacija pri zaposlitvi, kreditiranju, pravosodju) in kako jo preprečujemo. Vključi konkretne primere pristranskosti in razloži, zakaj je to posebej pomembno za manjše jezike kot je slovenščina. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['pristranskost', 'bias', 'diskriminacija', 'etika AI', 'pravičnost', 'podatki'],
    image_prompt:
      'Abstract balanced scale tilting with data bias weights, warm salmon and cool blue contrast showing imbalance, fairness and correction visualization, dark background, no text',
  },
  {
    id: 'day-42',
    day_number: 42,
    title_hint: 'Regulacija AI v Evropi: kaj morate vedeti',
    topic:
      'Napiši informativen članek o regulaciji AI v EU in Sloveniji. Pokrij trenutne zakone (GDPR, Digital Services Act), prihajajoče regulacije in mednarodne primerjave. Razloži vpliv na slovenska podjetja, ki razvijajo ali uporabljajo AI, in kakšne so zahteve za skladnost. Vključi praktične nasvete za podjetja, ki želijo biti skladna z zakonodajo. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['regulacija', 'zakonodaja', 'GDPR', 'skladnost', 'EU', 'Slovenija'],
    image_prompt:
      'Abstract EU parliament dome with radiating regulatory framework lines, warm gold and salmon light representing protection, structured governance visualization, dark background, no text',
  },
  {
    id: 'day-43',
    day_number: 43,
    title_hint: 'EU AI Act: popoln vodnik za slovenska podjetja',
    topic:
      'Napiši podroben članek o EU AI Act za slovensko občinstvo. Razloži štiri ravni tveganja (nesprejemljivo, visoko, omejeno, minimalno), kakšne obveznosti prinaša za podjetja, časovnico implementacije in kazni za neskladnost. Pojasni, kako se AI Act nanaša na vsebinska AI orodja kot je platforma 1984 (minimalno tveganje s transparenčnimi obveznostmi). Vključi praktične korake za pripravo. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['AI Act', 'EU regulacija', 'tveganje', 'skladnost', 'obveznosti', 'kazni'],
    image_prompt:
      'Abstract legislative document transforming into a protective framework around AI systems, warm salmon and gold tones, four risk level tiers visualization, dark background, no text',
  },
  {
    id: 'day-44',
    day_number: 44,
    title_hint: 'Prihodnost dela: katera delovna mesta AI spreminja in katera ustvarja',
    topic:
      'Napiši uravnotežen članek o vplivu AI na trg dela za slovensko občinstvo. Razloži, katera delovna mesta so najbolj izpostavljena avtomatizaciji, katera nova delovna mesta nastajajo, kako se bo spremenila narava dela in katere veščine bodo najpomembnejše. Vključi podatke za Slovenijo (struktura gospodarstva, izobrazba) in konkretne nasvete za posameznike in podjetja, kako se pripraviti. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['prihodnost dela', 'avtomatizacija', 'trg dela', 'veščine', 'prekvalifikacija', 'Slovenija'],
    image_prompt:
      'Abstract human figure and AI entity collaborating at a workstation of the future, warm peach and salmon light, evolving workplace visualization with both organic and digital elements, dark background, no text',
  },
  {
    id: 'day-45',
    day_number: 45,
    title_hint: 'AI in ustvarjalnost: ali nas bo AI nadomestil ali navdihnil?',
    topic:
      'Napiši premišljen članek o razmerju med AI in ustvarjalnostjo. Razloži, kako AI ustvarja umetnost, glasbo, literaturo in dizajn, ali je to res ustvarjalnost ali le sofisticirano posnemanje, in kako ustvarjalci uporabljajo AI kot orodje (ne nadomestek). Vključi mnenja slovenskih umetnikov in ustvarjalcev ter konkretne primere soigre med človekom in AI. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['ustvarjalnost', 'umetnost', 'glasba', 'dizajn', 'AI umetnost', 'kreativnost'],
    image_prompt:
      'Abstract paintbrush held by both human hand and digital AI hand creating art together, warm salmon and rose palette, creative collaboration visualization, dark background, no text',
  },
  {
    id: 'day-46',
    day_number: 46,
    title_hint: 'Okoljski vpliv AI: koliko energije porabi umetna inteligenca',
    topic:
      'Napiši članek o okoljskem vplivu AI za slovensko občinstvo. Razloži porabo energije pri treniranju in zaganjanju velikih modelov, ogljični odtis podatkovnih centrov, porabo vode za hlajenje in primerjave z drugimi industrijami. Predstavi pobude za zeleno AI (učinkovitejši modeli, obnovljiva energija, optimizacija) in kaj lahko Slovenija prispeva. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['okoljski vpliv', 'energija', 'ogljični odtis', 'zelena AI', 'trajnost', 'podatkovni centri'],
    image_prompt:
      'Abstract data center with green energy sources (wind turbines, solar panels) powering AI computation, warm and cool tones balanced, sustainability visualization, dark background, no text',
  },
  {
    id: 'day-47',
    day_number: 47,
    title_hint: 'Deepfake: kako prepoznati lažne vsebine v dobi AI',
    topic:
      'Napiši članek o deepfake tehnologiji za slovensko občinstvo. Razloži, kako delujejo deepfake sistemi (face swap, voice cloning, video manipulacija), kakšne so grožnje (dezinformacije, goljufije, politična manipulacija) in kako se zaščititi. Predstavi orodja za odkrivanje deepfakeov in zakonodajni okvir v EU. Vključi nasvete za medijsko pismenost in kritično razmišljanje. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['deepfake', 'lažne vsebine', 'dezinformacije', 'odkrivanje', 'medijska pismenost'],
    image_prompt:
      'Abstract face being digitally reconstructed with visible seams between real and fake layers, warm and cool contrast tones, detection magnifying glass revealing manipulation, dark background, no text',
  },
  {
    id: 'day-48',
    day_number: 48,
    title_hint: 'AI in intelektualna lastnina: kdo je lastnik AI-generirane vsebine?',
    topic:
      'Napiši članek o intelektualni lastnini v kontekstu AI za slovensko občinstvo. Razloži ključna vprašanja: kdo je avtor AI-generirane vsebine, ali je lahko AI avtor, kako je s pravicami do trenirnih podatkov, kakšne so tožbe (NYT vs. OpenAI, Getty vs. Stability AI) in kaj to pomeni za uporabnike platform kot je 1984. Vključi slovensko in EU perspektivo avtorskega prava. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['intelektualna lastnina', 'avtorske pravice', 'copyright', 'AI vsebine', 'zakonodaja'],
    image_prompt:
      'Abstract copyright symbol merging with AI neural network patterns, warm salmon and gold tones, intellectual property and creation duality visualization, dark background, no text',
  },
  {
    id: 'day-49',
    day_number: 49,
    title_hint: 'AI governance: kako odgovorno upravljamo z umetno inteligenco',
    topic:
      'Napiši članek o upravljanju AI (AI governance) za slovensko občinstvo. Razloži, kaj pomeni odgovorno upravljanje AI na ravni podjetja (interni procesi, etični odbori, revizije) in na ravni države (regulacija, nadzorni organi, standardi). Predstavi okvire za AI governance (OECD, EU, IEEE) in pojasni, kako lahko slovenska podjetja vzpostavijo dobre prakse. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['AI governance', 'upravljanje', 'odgovornost', 'etika', 'standardi', 'OECD'],
    image_prompt:
      'Abstract governance framework with interconnected pillars of oversight surrounding an AI core, warm gold and salmon structured light, accountability visualization, dark background, no text',
  },
  {
    id: 'day-50',
    day_number: 50,
    title_hint: 'Družbeni vpliv AI: kako umetna inteligenca preoblikuje družbo',
    topic:
      'Napiši širok članek o družbenem vplivu AI za slovensko občinstvo. Pokrij vpliv na izobraževanje (AI tutorji, plagiati), zdravstvo (dostopnost, neenakost), demokracijo (dezinformacije, nadzor), ekonomijo (neenakost, produktivnost) in medčloveške odnose (AI spremljevalci, odvisnost). Vključi slovensko perspektivo in poziv k aktivni udeležbi pri oblikovanju AI prihodnosti. Članek naj bo dolg 800-1200 besed.',
    category: 'Novice',
    keywords: ['družbeni vpliv', 'izobraževanje', 'demokracija', 'neenakost', 'prihodnost', 'družba'],
    image_prompt:
      'Abstract human community silhouettes interconnected with AI technology threads, warm peach and salmon gradient representing hope and change, societal transformation visualization, dark background, no text',
  },

  // ============================================================
  // DAYS 51-60: PLATFORM TUTORIALS & TIPS
  // ============================================================
  {
    id: 'day-51',
    day_number: 51,
    title_hint: 'AI Chat na platformi 1984: napredni nasveti za boljše rezultate',
    topic:
      'Napiši podroben vodnik za napredno uporabo AI Chat funkcije na platformi 1984. Pokrij tehnike promptanja (specifičnost, kontekst, ton, format), uporabo sistemskih sporočil, kako dobiti boljše rezultate v slovenščini, primerjavo med modeli (Sonnet vs. Opus) in kdaj izbrati katerega. Vključi 10 konkretnih primerov promptov za različne namene (poslovni, kreativni, akademski). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['AI Chat', '1984 platforma', 'prompt engineering', 'nasveti', 'slovenščina', 'napredna uporaba'],
    image_prompt:
      'Abstract chat interface with expanding conversation bubbles growing more sophisticated, warm salmon and peach gradient, AI conversation mastery visualization, dark background, no text',
  },
  {
    id: 'day-52',
    day_number: 52,
    title_hint: 'Grafika z AI: napredna uporaba generiranja slik na 1984',
    topic:
      'Napiši podroben vodnik za napredno uporabo funkcije generiranja grafik na platformi 1984. Razloži, kako pisati učinkovite image prompte, kako doseči konsistenten stil, kdaj uporabiti inpainting za popravke, kako optimizirati za različne namene (marketing, družbena omrežja, spletna stran) in kakšne so omejitve. Vključi 10 primerov odličnih promptov za slike. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['generiranje slik', 'AI grafika', '1984 platforma', 'image prompt', 'inpainting', 'vizuali'],
    image_prompt:
      'Abstract digital canvas with AI-generated art elements emerging from creative prompts, warm salmon and rose palette, artistic creation process visualization, dark background, no text',
  },
  {
    id: 'day-53',
    day_number: 53,
    title_hint: 'Prevajalnik 1984: triki za profesionalne prevode',
    topic:
      'Napiši podroben vodnik za napredno uporabo AI Prevajalnika na platformi 1984. Razloži, kako doseči najboljše prevode iz in v slovenščino, kako ohranjati terminologijo, kako uporabiti kontekst za boljše prevode, kako prevajati dokumente (PDF, DOCX) in kdaj je bolje uporabiti AI prevod namesto strojnega prevajanja (Google Translate). Vključi primere za različne domene (pravne, medicinske, tehnične prevode). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['prevajanje', 'prevajalnik', '1984 platforma', 'slovenščina', 'profesionalni prevodi'],
    image_prompt:
      'Abstract translation visualization with text flowing between language bubbles connected by AI bridges, warm peach and salmon gradient, multilingual transformation, dark background, no text',
  },
  {
    id: 'day-54',
    day_number: 54,
    title_hint: 'AI Povzetek: kako izvleči bistvo iz dolgih besedil',
    topic:
      'Napiši podroben vodnik za napredno uporabo funkcije AI Povzetek na platformi 1984. Razloži štiri načine povzemanja (kratek, srednji, podroben, alineje), kdaj uporabiti katerega, kako naložiti dolge dokumente (PDF, DOCX, PPTX, XLSX), kako dobiti najboljše rezultate in praktične primere uporabe (povzetki sestankov, akademskih člankov, poročil, pogodb). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['povzetek', 'sumarizacija', '1984 platforma', 'dokumenti', 'analiza besedil'],
    image_prompt:
      'Abstract long document being distilled into a concentrated essence of key points, warm salmon and peach gradient, information compression visualization, dark background, no text',
  },
  {
    id: 'day-55',
    day_number: 55,
    title_hint: 'AI Učenje na 1984: kartice, kvizi in testi iz vaših gradiv',
    topic:
      'Napiši podroben vodnik za uporabo funkcije AI Učenje na platformi 1984. Razloži tri načine učenja (kartice, kviz, test), kako naložiti študijsko gradivo (skripta, zapiski, učbenik v PDF), kako optimizirati generiranje vprašanj in kako učinkovito uporabljati kartice za ponavljanje. Vključi nasvete za dijake, študente in profesionalce, ki se pripravljajo na izpite. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['učenje', 'kartice', 'kviz', 'test', '1984 platforma', 'študij', 'izpiti'],
    image_prompt:
      'Abstract study flashcards and quiz elements floating in an organized learning space, warm peach and salmon gradient, knowledge acquisition visualization, dark background, no text',
  },
  {
    id: 'day-56',
    day_number: 56,
    title_hint: 'AI Dokumenti na 1984: workflow za produktivno pisanje',
    topic:
      'Napiši podroben vodnik za uporabo funkcije AI Dokumenti na platformi 1984. Razloži celoten workflow od ustvarjanja dokumenta, uporabe AI za pisanje in urejanje, do izvoza. Pokrij napredne funkcije (nalaganje referenčnih dokumentov, prilagajanje tona, akademsko pisanje, poslovna pisma). Vključi primere za različne vrste dokumentov (poročila, predlogi, akademski eseji, dopisi). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['dokumenti', 'pisanje', '1984 platforma', 'workflow', 'produktivnost', 'urejanje'],
    image_prompt:
      'Abstract document creation workflow with pages flowing through AI enhancement stages, warm salmon and peach gradient, productivity and writing visualization, dark background, no text',
  },
  {
    id: 'day-57',
    day_number: 57,
    title_hint: 'Zvok z AI: pretvorba besedila v govor in obratno na 1984',
    topic:
      'Napiši podroben vodnik za uporabo zvočnih funkcij na platformi 1984. Razloži pretvorbo besedila v govor (TTS) — kako izbrati glas, optimizirati za slovenščino, uporabiti za podkaste in voiceover. Nato pokrij pretvorbo govora v besedilo (STT) — kako transkribirati sestanke, intervjuje, predavanja. Vključi praktične nasvete za kakovostne rezultate in primere uporabe. Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['TTS', 'STT', 'besedilo v govor', 'govor v besedilo', 'zvok', '1984 platforma', 'transkripcija'],
    image_prompt:
      'Abstract sound waves transforming into text lines and vice versa, warm peach and salmon gradient audio visualization, speech and text duality, dark background, no text',
  },
  {
    id: 'day-58',
    day_number: 58,
    title_hint: 'OCR z AI: kako prebrati besedilo iz slik in dokumentov',
    topic:
      'Napiši podroben vodnik za uporabo OCR funkcije na platformi 1984. Razloži, kako deluje AI-podprt OCR (boljši od klasičnega OCR), kakšne dokumente lahko obdelate (skenirani dokumenti, fotografije tabel, ročno pisani zapiski, računi), kako optimizirati kakovost vhodne slike in praktične primere uporabe (digitalizacija arhivov, obdelava računov, prepoznavanje besedila v slovenščini). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['OCR', 'prepoznavanje besedila', 'skeniranje', 'digitalizacija', '1984 platforma'],
    image_prompt:
      'Abstract scanned document with text being extracted and digitized by warm AI light beams, peach and salmon gradient recognition patterns, OCR process visualization, dark background, no text',
  },
  {
    id: 'day-59',
    day_number: 59,
    title_hint: 'Inpainting masterclass: kako popraviti in izboljšati slike z AI',
    topic:
      'Napiši podroben vodnik za uporabo inpainting funkcije na platformi 1984. Razloži, kaj je inpainting (popravljanje delov slike z AI), kako izbrati območje za popravek, kako napisati dober prompt za zamenjavo elementov, kakšne so omejitve in praktični primeri (odstranitev ozadja, zamenjava objektov, izboljšanje kakovosti, popravek napak na fotografijah). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['inpainting', 'urejanje slik', 'AI slike', '1984 platforma', 'popravki fotografij'],
    image_prompt:
      'Abstract photograph with a section being magically repainted by AI brush strokes of warm light, salmon and peach gradient restoration visualization, before-after metaphor, dark background, no text',
  },
  {
    id: 'day-60',
    day_number: 60,
    title_hint: 'AI Spomin: kako naučiti AI o vašem podjetju in projektih',
    topic:
      'Napiši podroben vodnik za uporabo funkcije AI Spomin na platformi 1984. Razloži, kako AI Spomin deluje (RAG z vektorskimi embeddingi), kako naložiti dokumente podjetja, kako AI nato uporablja te podatke za kontekstualne odgovore, kakšne so omejitve in najboljše prakse. Vključi konkretne scenarije (onboarding novih zaposlenih, baza znanja za support, projektna dokumentacija). Članek naj bo dolg 800-1200 besed.',
    category: 'Vodniki',
    keywords: ['AI Spomin', 'RAG', 'baza znanja', '1984 platforma', 'kontekst', 'dokumenti podjetja'],
    image_prompt:
      'Abstract memory palace with glowing knowledge documents being stored and retrieved by AI, warm peach and salmon gradient, organizational knowledge visualization, dark background, no text',
  },
];
