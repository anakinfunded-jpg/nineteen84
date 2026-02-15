# 1984 — DO THIS NOW

Your project folder: **D:\nineteen84**

---

## STEP 1: Install Claude Code (2 min)

1. Click **Start**, type **PowerShell**, right-click → **Run as administrator**
2. Paste this, press Enter:

```
irm https://claude.ai/install.ps1 | iex
```

3. Wait for it to finish
4. **Close PowerShell** (click the X)
5. Open PowerShell again (same way)
6. Type this, press Enter:

```
claude --version
```

✅ You see a version number → move to Step 2

---

## STEP 2: Install Node.js (2 min)

1. Open browser, go to **https://nodejs.org**
2. Click the big green **"Download Node.js (LTS)"** button
3. Run the file → click **Next → Next → Next → Install → Finish**
4. **Close PowerShell**, open it again
5. Type:

```
node --version
```

✅ You see `v20.x` or `v22.x` → move to Step 3

---

## STEP 3: Check if you have Git (30 sec)

In PowerShell, type:

```
git --version
```

✅ You see a version number → skip to Step 4
❌ "Not recognized" → go to **https://git-scm.com/downloads/win**, download, install, restart PowerShell

---

## STEP 4: Create 4 free accounts (10 min)

Open a text file on your Desktop, call it `1984-keys.txt`. You'll save all keys here.

### Account 1: Supabase (your database)
1. Go to **https://supabase.com/dashboard** → sign up
2. Click **New Project**
3. Name: `nineteen84` | Password: make one up, **save it** | Region: **EU West**
4. Wait 2 min for setup
5. Go to **Settings** (gear icon) → **API**
6. Copy into your text file:
   - Project URL (starts with `https://`)
   - anon public key
   - service_role key (click Reveal)

### Account 2: Stripe (payments)
1. Go to **https://dashboard.stripe.com/register** → sign up
2. Go to **Developers** → **API keys**
3. Copy into your text file:
   - Publishable key (`pk_test_...`)
   - Secret key (`sk_test_...`)

### Account 3: OpenAI (AI images)
1. Go to **https://platform.openai.com/signup** → sign up
2. Go to **API keys** → **Create new secret key**
3. Copy into your text file (`sk-...`)

### Account 4: Resend (outreach emails)
1. Go to **https://resend.com/signup** → sign up
2. Go to **API Keys** → **Create API key**
3. Copy into your text file (`re_...`)

✅ You have 8 keys saved in `1984-keys.txt` → move to Step 5

---

## STEP 5: Launch Claude Code (the fun part)

1. Open PowerShell
2. Type:

```
D:
cd D:\nineteen84
claude
```

3. **First time:** it asks you to log in
   - Choose **"Claude app account"**
   - Browser opens → log in with your Claude Max account
   - Come back to PowerShell → should say connected

4. You're now inside Claude Code. It's waiting for your instructions.

---

## STEP 6: Paste Prompt 1 — Project Setup

Copy-paste this ENTIRE block into Claude Code and press Enter:

```
I'm building a Slovenian AI content creation platform called "1984". The domain will be 1984.si. Set up a new Next.js 14 project with TypeScript and App Router in the current directory. Do these things in order:

1. Run: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
   (If it asks questions, choose: Yes to TypeScript, Yes to ESLint, Yes to Tailwind, Yes to App Router, No to src directory, Yes to import alias @/*)

2. Install these packages:
   npm install @anthropic-ai/sdk openai @supabase/supabase-js @supabase/ssr stripe resend lucide-react

3. Set up shadcn/ui:
   npx shadcn@latest init
   (Choose: dark theme, zinc base color, yes to CSS variables)

4. Create a .env.local file with these placeholder variables:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

Tell me when everything is installed and ready.
```

⏳ Wait 2-3 minutes. Claude Code will create files and install packages.

---

## STEP 7: Paste your API keys

When Claude Code says it's done, paste this — but **replace the placeholder values with your actual keys** from `1984-keys.txt`:

```
Update the .env.local file with these values:

NEXT_PUBLIC_SUPABASE_URL=https://PASTE-YOUR-URL-HERE.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE-YOUR-ANON-KEY-HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE-YOUR-SERVICE-ROLE-KEY-HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE-YOUR-KEY-HERE
STRIPE_SECRET_KEY=sk_test_PASTE-YOUR-KEY-HERE
STRIPE_WEBHOOK_SECRET=whsec_placeholder
OPENAI_API_KEY=sk-PASTE-YOUR-KEY-HERE
RESEND_API_KEY=re_PASTE-YOUR-KEY-HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## STEP 8: Paste Prompt 2 — Build the landing page

This is the big one. Copy-paste this ENTIRE block:

```
Now create a CLAUDE.md file in the project root and then build the full landing page.

CLAUDE.md should contain these project rules:
- Platform name: 1984 (domain: 1984.si)
- Slovenian AI content creation platform, like Editee.com for Czech Republic
- DARK THEME ONLY. Page bg: #171717, surfaces: #181818, navbar: #191919, hover: #242424
- CTA button gradient: linear-gradient(90deg, #FFB288, #FEB089, #EE94B0) — salmon to rose
- Logo gradient: linear-gradient(90deg, #EFBC9F, #D797A6, #FF9ED1) — peach to hot pink
- Text color: #E1E1E1 off-white (NOT pure white). Pure #FFFFFF only on CTA button text
- Fonts: "Instrument Serif" from Google Fonts for BIG section headings (weight 400, letter-spacing 0.01em). "Plus Jakarta Sans" from Google Fonts for everything else (nav, body, buttons)
- Glass morphism cards: backdrop-blur-xl bg-white/[0.02] border border-white/[0.06]
- CTA buttons: gradient fill, pill shape (rounded-full), dark text #171717
- Borders: rgba(255,255,255,0.06) — nearly invisible
- Animations: fade-in + slide-up on scroll (800ms ease-out), stagger 50-100ms per child element
- AI routing: Claude Haiku 4.5 by default (cheap), Sonnet 4.5 only for premium
- All user-facing text in Slovenian

Set up tailwind.config.ts with all the brand colors, fonts, gradients, and shadows.
Set up app/globals.css with Google Fonts imports and CSS variables.
Build app/layout.tsx with dark theme and metadata (title: "1984 | AI, ki piše slovensko").

Then build the landing page at app/page.tsx — ALL text in Slovenian:

NAVBAR:
- Left: "1984" as the logo in gradient text (peach-to-hotpink gradient, serif font, bold)
- Center links: Funkcije, Cenik, O nas
- Right: "Prijava" text link + "Začni brezplačno" gradient CTA button (pill shape)
- Navbar has subtle bottom border rgba(255,255,255,0.06)

HERO SECTION:
- Small eyebrow label: "AI platforma za slovenščino" in salmon accent color #FEB089
- Big serif heading (Instrument Serif): "Veliki brat\nza vaša besedila." (play on 1984 / Big Brother theme)
- Subtitle: "Prva slovenska AI aplikacija za ustvarjanje marketinških vsebin. Opisi izdelkov, objave za družbena omrežja, e-maili, blogi — vse v brezhibni slovenščini."
- Two buttons: "Preizkusi brezplačno" (gradient fill CTA) + "Poglej funkcije" (outline with gradient border)
- Subtle radial glow effect behind hero: radial-gradient(ellipse, rgba(254,176,137,0.04), transparent)

FEATURES SECTION:
- Eyebrow label: "Funkcije"
- Serif heading: "Vse kar potrebujete za\npopolno slovensko vsebino"
- 6 cards in responsive grid (glass morphism), each with lucide-react icon, title, description:
  1. AI Chat (MessageSquare) — "Pogovarjajte se z AI v naravni slovenščini"
  2. AI Besedila (FileText) — "40+ predlog za marketinška besedila"
  3. AI Grafika (Image) — "Generirajte profesionalne slike"
  4. AI Dokumenti (FileEdit) — "Urejajte in izboljšajte dokumente"
  5. AI Prevajalnik (Languages) — "Prevajajte med 6 jeziki"
  6. AI Zvok (Headphones) — "Pretvorite besedilo v govor"
- Cards hover: translateY(-4px) + subtle glow shadow

PRICING SECTION:
- Eyebrow: "Cenik"
- Serif heading: "Preprosti in transparentni paketi"
- 3 pricing cards side by side:
  1. Osnovno — €14,90/mesec — 20.000 besed, 200 slik, AI Chat, 15 predlog, E-poštna podpora
  2. Profesionalno (with "PRILJUBLJENO" badge, slightly larger/highlighted) — €24,90/mesec — 50.000 besed, 500 slik, Vse predloge, Visoka kakovost, Prednostna podpora
  3. Poslovno — €39,90/mesec — 100.000 besed, 1.000 slik, API dostop, Lastni podatki, Telefonska podpora
- Each card has a CTA button: "Začni brezplačno"
- Note below: "Vsi paketi vključujejo 5-dnevno brezplačno preizkusno obdobje."

FOOTER:
- "1984" logo in gradient
- Tagline: "AI, ki piše slovensko."
- Link columns: Produkt (Funkcije, Cenik, Blog) | Podjetje (O nas, Kontakt, Kariere) | Pravno (Pogoji uporabe, Zasebnost)
- "© 2026 1984. Vse pravice pridržane."

IMPORTANT: All animations must work — use IntersectionObserver for scroll-triggered fade-ins with stagger. Hover effects on all interactive elements. The page must feel premium and polished.

After building everything, run: npm run dev
Then tell me to open http://localhost:3000 in my browser.
```

⏳ This takes 3-5 minutes. When it finishes, open your browser and go to **http://localhost:3000**

🎉 **You should see your 1984 landing page.**

---

## WHAT TO DO TOMORROW AND AFTER

Paste these into Claude Code **one per day**:

**Day 2 — Authentication:**
```
Read CLAUDE.md. Build Supabase auth: login page at app/(marketing)/prijava/page.tsx and register page at app/(marketing)/registracija/page.tsx. Both in Slovenian, dark design. Add Google OAuth. Create authenticated layout at app/(app)/layout.tsx with dark sidebar (Nadzorna plošča, AI Chat, AI Besedila, AI Grafika, AI Dokumenti, AI Prevajalnik). Protect all /app routes. Create dashboard at app/(app)/dashboard/page.tsx.
```

**Day 3 — AI Text Generation (core product):**
```
Read CLAUDE.md. Build the AI system: lib/ai/client.ts (routes to Haiku by default, Sonnet when premium), lib/ai/prompts.ts (Slovenian system prompts), lib/ai/templates.ts (15 Slovenian templates). Build app/api/ai/generate/route.ts and app/(app)/besedila/page.tsx with template selector grid + generation interface.
```

**Day 4 — AI Chat:**
```
Read CLAUDE.md. Build AI chat: app/api/ai/chat/route.ts (streaming), app/(app)/chat/page.tsx (conversation UI, Slovenian system prompt, history in Supabase). Dark theme.
```

**Day 5 — AI Images:**
```
Read CLAUDE.md. Build AI image generation: app/api/ai/image/route.ts (DALL-E 3), app/(app)/grafika/page.tsx (Slovenian input, gallery, download). Dark theme.
```

**Day 6 — Payments:**
```
Read CLAUDE.md. Build Stripe: 3 EUR plans, checkout, webhooks, subscription management page at app/(app)/narocnina/page.tsx. Credit system (track words + images per user per month). 5-day free trial. All Slovenian.
```

**Day 7 — Outreach System:**
```
Read CLAUDE.md. Build automated email outreach: Supabase tables (outreach_contacts, outreach_campaigns, outreach_sends), Resend integration, 3 Slovenian cold email templates, daily cron via Vercel, open/click tracking, GDPR unsubscribe. Admin page at app/(app)/admin/outreach/page.tsx.
```

---

## QUICK REFERENCE

| If you need to... | Do this |
|---|---|
| Open your project | PowerShell → `D:` then `cd D:\nineteen84` then `claude` |
| See your website | Browser → `http://localhost:3000` |
| Start the dev server | In Claude Code: "Run npm run dev" |
| Fix an error | "I'm getting this error: [paste it]. Fix it." |
| Claude Code is slow | Type `/compact` |
| Start fresh conversation | Type `/clear` |
| Exit Claude Code | Type `/quit` |
| See costs | Type `/cost` |

---

## GO DO STEP 1 NOW.
