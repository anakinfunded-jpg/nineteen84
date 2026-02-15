# 1984 — Claude Code Project Blueprint

## Complete Setup Guide for Building the Slovenian AI Content Platform

---

## Table of Contents

1. [Design System (Mantra-Inspired)](#1-design-system)
2. [Project Setup with Claude Code](#2-project-setup)
3. [Architecture: Dual-Tier AI (Haiku → Sonnet)](#3-architecture)
4. [Core Features — MVP Build Order](#4-core-features)
5. [Automated Outreach System](#5-automated-outreach)
6. [Slovenian System Prompts](#6-slovenian-prompts)
7. [Claude Code Commands Cheat Sheet](#7-claude-code-commands)

---

## 1. Design System (Mantra-Inspired)

### Brand: 1984

**Tagline:** "Umetna inteligenca za slovensko besedo"
(Artificial intelligence for the Slovenian word)

### Color Palette (pixel-sampled from mantrachain.io screenshot)

These hex values were extracted directly from the mantrachain.io screenshot
using pixel sampling at exact coordinates. They are NOT approximations.

```css
:root {
  /* === BACKGROUNDS — Sampled from page body and surfaces ===
     Pixel source: body bg at (10,100) = #171717, center at (847,747) = #181818
     Navbar at (847,15) = #191919 */
  --bg-primary: #171717;          /* Page background (sampled #171717) */
  --bg-secondary: #181818;        /* Card/section bg (sampled #181818) */
  --bg-tertiary: #191919;          /* Navbar bg, elevated (sampled #191919) */
  --bg-hover: #242424;             /* Hover states (sampled #242424) */

  /* === ACCENT COLORS — The Mantra signature salmon-to-rose gradient ===
     CTA buttons sampled: #FFB288 (warm peach, left), #FEB089 (salmon, center), #EE94B0 (rose, right)
     Logo gradient: #EFBC9F (warm peach) → #D797A6 (dusty rose) → #FF9ED1 (hot pink)
     Average logo color: #D797A6 */
  --accent-primary: #FEB089;       /* Primary salmon — most frequent accent pixel */
  --accent-peach: #FFB288;         /* Warm peach end of CTA gradient */
  --accent-rose: #EE94B0;          /* Rose pink end of CTA gradient */
  --accent-hotpink: #FF9ED1;       /* Logo hot pink end */
  --accent-dusty: #D797A6;         /* Logo midtone dusty rose */
  --accent-tan: #EFBC9F;           /* Logo warm peach end */
  --accent-gradient-cta: linear-gradient(90deg, #FFB288 0%, #FEB089 40%, #EE94B0 100%);
  --accent-gradient-logo: linear-gradient(90deg, #EFBC9F 0%, #D797A6 50%, #FF9ED1 100%);
  --accent-glow: rgba(254, 176, 137, 0.04);  /* Extremely subtle glow */

  /* === TEXT — Mantra uses OFF-WHITE, not pure white ===
     Heading text sampled: #E1E1E1, #E2E2E2, #E0E0E0 (all in same range)
     Body text sampled: #E0E0E0, #E1E1E1 (same as headings!)
     Pure #FFFFFF only appears on MANTRA Zone button text
     Muted text: #929292 (used very sparingly) */
  --text-primary: #E1E1E1;          /* Headings — soft off-white (NOT #FFF!) */
  --text-secondary: #E0E0E0;        /* Body text (same off-white range) */
  --text-body: #E0E0E0;             /* Identical to secondary */
  --text-emphasis: #FFFFFF;          /* RARE — only CTA text and specific emphasis */
  --text-muted: #929292;             /* Muted labels, used sparingly */
  --text-accent: #FEB089;           /* Accent text, active links */

  /* === BORDERS & DIVIDERS ===
     Mantra uses very subtle white borders at ~8% opacity
     Navbar/card edges are barely visible against the #171717 bg */
  --border-default: rgba(255, 255, 255, 0.06);  /* Ultra-subtle dividers */
  --border-hover: rgba(255, 255, 255, 0.12);    /* Hover state borders */
  --border-accent: rgba(254, 176, 137, 0.25);   /* Salmon accent borders */

  /* === STATUS === */
  --success: #22C55E;
  --warning: #F5A623;
  --error: #EF4444;
  --info: #3B82F6;

  /* === SHADOWS & EFFECTS === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 60px rgba(254, 176, 137, 0.08);

  /* === RADIUS (Mantra uses generous rounding on buttons, moderate on cards) === */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;   /* CTA buttons use full pill radius */
}
```

### Typography (analyzed from mantrachain.io rendering)

The Mantra site uses TWO distinct font categories:
1. **Section headings** ("Permissionless Chain for Permissioned Applications") — a **SERIF / editorial display** font
2. **Nav links, body text, buttons** — a clean **geometric sans-serif**

```css
/* HEADING FONT — Instrument Serif (closest match to Mantra's editorial serif headings)
   Alternative: DM Serif Display, Playfair Display, or Lora
   The key characteristic: elegant, thin serifs, generous letter-spacing */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

/* BODY/UI FONT — Plus Jakarta Sans (geometric sans-serif matching Mantra's nav/body) */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  /* Serif display font for big headings */
  --font-display: 'Instrument Serif', Georgia, serif;

  /* Sans-serif for nav, body, buttons, UI */
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;

  /* SIZING SCALE */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px — nav links, small labels */
  --text-base: 1rem;      /* 16px — body text */
  --text-lg: 1.125rem;    /* 18px — subtitle text */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px — section headings */
  --text-5xl: 3rem;       /* 48px — big headings */
  --text-6xl: 3.75rem;    /* 60px — hero heading (serif) */

  /* HEADING STYLE: Mantra headings are light-weight, generous tracking */
  /* letter-spacing: 0.01em on headings */
  /* font-weight: 400 (regular) on serif headings — NOT bold */
}
```

### Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#171717',          // Page background (pixel-sampled)
          surface: '#181818',     // Card/section bg (pixel-sampled)
          elevated: '#191919',    // Navbar, elevated surfaces (pixel-sampled)
          hover: '#242424',       // Hover states (pixel-sampled)
          salmon: '#FEB089',      // Primary CTA color (most frequent accent pixel)
          peach: '#FFB288',       // Warm end of button gradient
          rose: '#EE94B0',        // Cool/pink end of button gradient
          hotpink: '#FF9ED1',     // Logo hot pink end
          dusty: '#D797A6',       // Logo mid-tone (dusty rose)
          tan: '#EFBC9F',         // Logo warm end
        },
        txt: {
          heading: '#E1E1E1',     // Headings — soft off-white (NOT pure #FFF)
          body: '#E0E0E0',        // Body text (same off-white range)
          emphasis: '#FFFFFF',    // Rare pure white — button text, emphasis only
          muted: '#929292',       // Muted labels (used sparingly)
        }
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],       // SERIF for big headings
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],  // Sans for nav/body/UI
      },
      backgroundImage: {
        // CTA button gradient: warm salmon → pink rose
        'brand-gradient': 'linear-gradient(90deg, #FFB288 0%, #FEB089 40%, #EE94B0 100%)',
        // Logo text gradient: warm peach → dusty rose → hot pink
        'brand-gradient-logo': 'linear-gradient(90deg, #EFBC9F 0%, #D797A6 50%, #FF9ED1 100%)',
        // Subtle hero background glow
        'subtle-glow': 'radial-gradient(ellipse at center, rgba(254,176,137,0.04) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 60px rgba(254, 176, 137, 0.06)',
        'glow-lg': '0 0 100px rgba(254, 176, 137, 0.10)',
        'glow-btn': '0 0 30px rgba(254, 176, 137, 0.15)',
      },
    },
  },
}
```

### Key UI Patterns (pixel-verified from mantrachain.io)

**Background system:**
- Page: `#171717` — Cards: `#181818` — Navbar: `#191919` — Hover: `#242424`
- No light mode. Ever.

**Typography:**
- Big section headings → `font-display` (Instrument Serif), weight 400, tracking `0.01em`
- Nav, body, buttons → `font-body` (Plus Jakarta Sans), weight 400-600
- Text color: `#E1E1E1` off-white for headings AND body (NOT pure white)
- Pure `#FFFFFF` used ONLY on button text and rare emphasis

**CTA Buttons:**
- Solid gradient fill: `linear-gradient(90deg, #FFB288, #FEB089, #EE94B0)`
- Pill radius (`rounded-full`)
- Text: `#171717` (dark on light button)
- Hover: slight `scale(1.02)` + `shadow-glow-btn`, 200ms ease

**Secondary/outline buttons:**
- Transparent bg, gradient border (1px), off-white text
- Border effect: use `border-image: linear-gradient(...)` or pseudo-element trick

**"MANTRA Zone" style button:**
- White border at ~60% opacity, white text, pill radius

**Glass cards:**
- `backdrop-blur-xl bg-white/[0.02] border border-white/[0.06]`
- Borders are VERY subtle — nearly invisible

**Gradient text (for logo/accents):**
- `bg-clip-text text-transparent bg-brand-gradient-logo`

**Animations (observed from live site):**
- Hero text: fade-in + slide-up on load, 800ms ease-out, 100ms stagger per line
- Hero 3D illustration: slow continuous rotation (~20s infinite, CSS transform)
- Cards on scroll: fade-in + scale(0.95→1.0) via IntersectionObserver
- Nav links hover: opacity 0.7→1.0, 200ms ease
- CTA hover: scale(1.02) + glow shadow grow, 200ms ease
- Section reveals: scroll-triggered, children stagger 50ms delay each
- Subtle floating particles in hero bg area

---

## 2. Project Setup with Claude Code

### Prerequisites

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Or via Homebrew
brew install claude-code
```

### Initialize Project

Open your terminal and run:

```bash
# Create and enter project directory
mkdir nineteen84 && cd nineteen84

# Start Claude Code
claude

# Then tell Claude Code:
```

### First Claude Code Prompt (copy-paste this entire block):

```
Create a Next.js 14 (App Router) project called "nineteen84" with the following setup:

STACK:
- Next.js 14+ with App Router (TypeScript)
- Tailwind CSS v3 + shadcn/ui
- Supabase for auth + database
- Stripe for payments
- Anthropic Claude API for AI text generation
- OpenAI API for DALL-E image generation

STRUCTURE:
nineteen84/
├── app/
│   ├── (marketing)/          # Public pages (landing, pricing, blog)
│   │   ├── page.tsx          # Landing page
│   │   ├── cenik/page.tsx    # Pricing page
│   │   └── layout.tsx
│   ├── (app)/                # Authenticated app
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx     # AI Chat
│   │   ├── besedila/page.tsx # AI Text templates
│   │   ├── grafika/page.tsx  # AI Images
│   │   ├── dokumenti/page.tsx # AI Documents editor
│   │   ├── prevajalnik/page.tsx # Translator
│   │   └── layout.tsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── generate/route.ts    # Text generation endpoint
│   │   │   ├── chat/route.ts        # Chat endpoint
│   │   │   ├── image/route.ts       # Image generation endpoint
│   │   │   └── translate/route.ts   # Translation endpoint
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   └── outreach/
│   │       └── send/route.ts        # Automated outreach
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn components
│   ├── marketing/            # Landing page components
│   ├── app/                  # Dashboard components
│   └── shared/               # Shared (navbar, footer)
├── lib/
│   ├── ai/
│   │   ├── client.ts         # AI router (Haiku vs Sonnet)
│   │   ├── prompts.ts        # Slovenian system prompts
│   │   └── templates.ts      # Template definitions
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe/
│   │   └── client.ts
│   └── outreach/
│       ├── emailer.ts        # Automated email outreach
│       └── scheduler.ts      # Cron-based scheduling
├── supabase/
│   └── migrations/           # Database schema
├── .env.local.example
├── CLAUDE.md                 # Claude Code project instructions
└── package.json

ENV VARS (.env.local.example):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

DESIGN SYSTEM (apply to globals.css and tailwind.config.js):
- Dark theme ONLY (bg: #0D0D0D, surfaces: #141414, elevated: #1A1A1A)
- Accent: orange #E8732A with amber #F5A623 gradient
- Font: "Plus Jakarta Sans" for display, "Space Grotesk" for UI
- Glass morphism cards: backdrop-blur + white/3% bg + white/8% border
- All text in white with opacity variations (100%, 70%, 40%)
- Based on mantrachain.io design language

Create the CLAUDE.md file with these project rules for future Claude Code sessions.
Initialize the project, install all dependencies, and set up the base layout.
```

### CLAUDE.md File (Project Memory for Claude Code)

Create this file at the project root — Claude Code reads it automatically:

```markdown
# 1984 — Claude Code Project Instructions

## Project Overview
1984 is a Slovenian AI content creation platform (like Editee.com for Czech Republic).
Target: Slovenian SMEs, freelancers, marketers who need content in Slovenian language.

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, storage)
- Stripe (payments in EUR)
- Anthropic Claude API (text generation)
- OpenAI API (DALL-E 3 for images)
- Resend (transactional + outreach emails)

## Design Rules
- DARK THEME ONLY — never use light backgrounds
- BG: #171717 (page), Surfaces: #181818 (cards), Elevated: #191919 (navbar/inputs)
- Hover: #242424
- CTA gradient: linear-gradient(90deg, #FFB288, #FEB089, #EE94B0) — salmon-to-rose
- Logo gradient: linear-gradient(90deg, #EFBC9F, #D797A6, #FF9ED1) — peach-to-hotpink
- Text: #E1E1E1 off-white (NOT pure #FFF) for headings AND body
- Pure #FFFFFF only on CTA button text and rare emphasis
- Borders: rgba(255,255,255,0.06) — nearly invisible
- FONTS: "Instrument Serif" (serif) for BIG section headings, "Plus Jakarta Sans" (sans) for everything else
- Headings are font-weight: 400 (regular, NOT bold) with 0.01em tracking
- Cards: glass morphism (backdrop-blur-xl bg-white/[0.02] border-white/[0.06])
- CTA buttons: gradient fill, pill radius (rounded-full), dark text #171717
- Glow: radial-gradient(rgba(254,176,137,0.04)) — extremely subtle
- Animations: fade-in + slide-up on scroll (800ms ease-out), stagger 50-100ms
- ALL colors pixel-sampled from mantrachain.io screenshot, verified at pixel level

## AI Architecture (CRITICAL — Cost Optimization)
### Dual-tier routing:
- **DEFAULT (80% of requests):** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
  - $1/$5 per million tokens — USE THIS FOR EVERYTHING UNLESS SPECIFIED
  - Templates, short content, social media, product descriptions, chat
- **PREMIUM (activated by user or long-form):** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
  - $3/$15 per million tokens — ONLY for blog posts, long articles, complex analysis
  - User explicitly toggles "Visoka kakovost" (High quality) mode

### Cost rules:
- Always use Haiku first. Always.
- Cache system prompts (they repeat on every request)
- Set max_tokens to the minimum needed (not 4096 by default)
- Short content: max_tokens=500, Long content: max_tokens=2000
- Images: DALL-E 3 standard quality ($0.04), HD only when user requests ($0.08)

## Language Rules
- ALL user-facing text must be in Slovenian
- Variable names and code comments in English
- API responses in Slovenian unless user requests otherwise
- Proper Slovenian grammar: respect dvojina (dual), skloni (cases), predlogi

## Database Schema (Supabase)
Tables: users, subscriptions, generations, templates, chat_messages, outreach_contacts

## File Naming
- Components: PascalCase (GeneratePanel.tsx)
- Utils/lib: camelCase (aiClient.ts)
- Pages: kebab-case folders with page.tsx

## Do NOT:
- Use light mode / white backgrounds
- Use Inter, Roboto, or Arial fonts
- Default to expensive AI models
- Hardcode Slovenian text (use a constants file for i18n readiness)
- Skip error handling on AI API calls
- Allow unlimited generation without checking user credits
```

---

## 3. Architecture: Dual-Tier AI (Cost Optimization)

### The AI Router (most critical file)

Tell Claude Code to create `lib/ai/client.ts`:

```
Create lib/ai/client.ts — the AI router that handles ALL AI requests.

It must:
1. Default to Claude Haiku 4.5 for 80% of tasks (cheap: $1/$5 per MTok)
2. Route to Sonnet 4.5 only when explicitly requested or for long-form content
3. Include prompt caching for system prompts (saves 90% on repeated system prompts)
4. Track token usage per user in Supabase
5. Check user's remaining credits before making API call
6. Set appropriate max_tokens per task type

Task types and their configs:
- "short_text" (social media, product desc): Haiku, max_tokens=500
- "medium_text" (email, ad copy): Haiku, max_tokens=1000
- "long_text" (blog, article): Sonnet (or Haiku if user hasn't toggled premium), max_tokens=2500
- "chat": Haiku, max_tokens=800
- "translate": Haiku, max_tokens=2000
- "premium_*": Any task prefixed with premium_ routes to Sonnet

Include the Slovenian system prompt from lib/ai/prompts.ts in every request.
Use prompt caching (cache_control: {type: "ephemeral"}) on the system prompt.
```

### Token Budget Per Pricing Tier

```
Create a credit system in lib/ai/credits.ts:

Each plan gets monthly word credits (1 word ≈ 1.3 tokens):
- Free trial: 2,000 words (5 days)
- Osnovno (€14.90): 20,000 words + 200 images
- Profesionalno (€24.90): 50,000 words + 500 images
- Poslovno (€39.90): 100,000 words + 1,000 images

Track usage in Supabase table "generations":
- user_id, type, model_used, input_tokens, output_tokens, word_count, created_at

Before each API call, check:
1. Is user's subscription active?
2. Does user have remaining credits this month?
3. If not, return error in Slovenian: "Vaš mesečni limit je dosežen. Nadgradite paket za več besed."
```

---

## 4. Core Features — MVP Build Order

Tell Claude Code to build these in sequence:

### Sprint 1 (Week 1–2): Foundation

```
Build the following in order:
1. Landing page (Slovenian, Mantra dark design, hero + features + pricing + CTA)
2. Auth flow (Supabase: register/login with email + Google OAuth)
3. Dashboard layout (sidebar nav with: Chat, Besedila, Grafika, Dokumenti, Prevajalnik)
4. Credit display widget (shows remaining words/images this month)
```

### Sprint 2 (Week 3–4): AI Core

```
Build the AI features:
1. AI Chat page — conversation interface, Slovenian system prompt, chat history stored in Supabase
2. AI Besedila page — template selector with 15 templates:
   - Opis izdelka (Product description)
   - Facebook objava (Facebook post)
   - Instagram objava (Instagram post)
   - LinkedIn objava (LinkedIn post)
   - Google oglas (Google ad)
   - E-mail za stranke (Customer email)
   - Prodajni e-mail (Sales email)
   - Blog uvod (Blog intro)
   - Blog članek (Full blog post) — routes to Sonnet
   - Opis za Bolha.com (Bolha.com listing)
   - Opis za spletno trgovino (E-shop description)
   - SEO meta opis (SEO meta description)
   - YouTube video skript (YouTube script)
   - Odgovor na recenzijo (Review response)
   - Oglas za zaposlitev (Job listing)
3. AI Grafika — DALL-E 3 integration, prompt input in Slovenian, gallery of generated images
4. AI Prevajalnik — translate SL↔EN/DE/HR/IT/SR, document upload option
```

### Sprint 3 (Week 5–6): Payments + Polish

```
Build:
1. Stripe integration — 3 plans (Osnovno €14.90, Profesionalno €24.90, Poslovno €39.90)
2. Subscription management page (upgrade, downgrade, cancel)
3. 5-day free trial flow (no credit card required)
4. Generation history page (all past outputs, copyable, deletable)
5. Mobile responsive polish (75%+ of Slovenian traffic is mobile)
```

---

## 5. Automated Outreach System

### Strategy: Cold Email to Slovenian SMEs

This is a fully automated system that runs daily, reaching potential customers.

```
Create the automated outreach system in lib/outreach/ and app/api/outreach/:

OVERVIEW:
We build a system that:
1. Stores a list of Slovenian SME contacts (manually curated + scraped from public directories)
2. Sends personalized cold emails via Resend API
3. Tracks opens, clicks, and conversions
4. Runs on a daily cron schedule via Vercel Cron

TECH:
- Resend (resend.com) for email sending — free tier: 100 emails/day, 3,000/month
- Supabase table "outreach_contacts" for contact management
- Supabase table "outreach_campaigns" for campaign tracking
- Vercel Cron Jobs for daily sends

DATABASE SCHEMA:
outreach_contacts:
  - id, email, company_name, industry, website, source, status (new/contacted/opened/clicked/converted/unsubscribed), created_at

outreach_campaigns:
  - id, name, subject_line, body_template, sent_count, open_count, click_count, is_active, created_at

outreach_sends:
  - id, contact_id, campaign_id, sent_at, opened_at, clicked_at, status

API ROUTES:
- POST /api/outreach/send — triggers daily batch send (called by Vercel Cron)
- GET /api/outreach/track/[id] — pixel tracking for opens
- GET /api/outreach/click/[id] — click tracking redirect
- POST /api/outreach/unsubscribe — GDPR compliant unsubscribe

CRON (vercel.json):
{
  "crons": [{
    "path": "/api/outreach/send",
    "schedule": "0 9 * * 1-5"
  }]
}
This sends emails at 9 AM CET, Monday-Friday.
```

### Email Templates (in Slovenian)

```
Create 3 email templates in lib/outreach/templates.ts:

TEMPLATE 1: "Uvodni email" (Introduction)
Subject: "{{company_name}} — ali vaša marketinška besedila piše AI?"
Body:
"Pozdravljeni,

sem [Ime], ustanovitelj/ica 1984 — prve slovenske AI aplikacije za ustvarjanje marketinških vsebin.

Ali ste vedeli, da lahko umetna inteligenca napiše opis izdelka, Facebook objavo ali prodajni e-mail v brezhibni slovenščini — v 10 sekundah?

1984 je namensko zgrajen za slovenščino. Ne gre za Google Translate ali ChatGPT, ki slovenščino obravnava kot stranski jezik. Naše predloge so prilagojene slovenskemu trgu — od opisov za Mimovrste do prijav na EU razpise.

Preizkusite brezplačno 5 dni (brez kartice): {{app_url}}

Lep pozdrav,
[Ime]
1984 | Umetna inteligenca za slovensko besedo"

TEMPLATE 2: "Vrednostni email" (Value email — sent 3 days after open if no conversion)
Subject: "3 načini, kako AI prihrani čas pri marketingu (za {{industry}})"

TEMPLATE 3: "Zadnja priložnost" (Last chance — sent 7 days after first email)
Subject: "{{first_name}}, vaš brezplačni dostop do 1984 poteče čez 48 ur"

Each template has:
- Personalization slots: {{company_name}}, {{first_name}}, {{industry}}, {{app_url}}
- UTM tracking parameters on all links
- Unsubscribe link (GDPR required)
- Tracking pixel for open detection
```

### Contact Sources (Manual + Automated)

```
Create a contact import system at app/(app)/admin/outreach/page.tsx:

Sources for Slovenian SME contacts (all publicly available):
1. MANUAL CSV IMPORT — upload CSV with columns: email, company_name, industry, website
2. BIZI.SI — Slovenian business directory (manually export relevant companies)
3. AJPES.SI — public Slovenian business register
4. GOOGLE MAPS EXPORT — local businesses in Ljubljana, Maribor, Celje
5. LINKEDIN SALES NAVIGATOR — if available

The admin page should:
- Allow CSV upload and parsing
- Deduplicate by email
- Show campaign statistics (sent, opened, clicked, converted)
- Allow manual contact adding
- Export contacts as CSV
- Show unsubscribe list

IMPORTANT: All outreach must comply with GDPR:
- Include unsubscribe in every email
- Honor unsubscribes within 24 hours
- Store consent records
- Legitimate interest basis (B2B marketing to publicly listed business emails)
```

---

## 6. Slovenian System Prompts

```
Create lib/ai/prompts.ts with these system prompts:

MAIN SYSTEM PROMPT (used for all text generation):
---
Si 1984, slovenska umetna inteligenca za ustvarjanje marketinških vsebin.

PRAVILA:
1. VEDNO piši v brezhibni slovenščini. Upoštevaj dvojino, pravilne sklone, predloge in naravni besedni red.
2. Piši jasno, jedrnato in prepričljivo. Tvoja besedila morajo prodajati.
3. Prilagodi ton glede na kontekst: formalno za poslovne dokumente, sproščeno za družbena omrežja, prepričljivo za oglase.
4. Nikoli ne uporabi angleških besed, kjer obstaja ustrezen slovenski izraz.
5. Upoštevaj SEO najboljše prakse, ko je to relevantno.
6. Ne generiraj neprimernih, žaljivih ali zavajajočih vsebin.
7. Če uporabnik vpraša v angleščini, odgovori v slovenščini, razen če izrecno zahteva drugače.

KONTEKST:
- Ciljni trg: Slovenija (2,1M prebivalcev)
- Valuta: EUR (€)
- Glavne spletne trgovine: Mimovrste, Big Bang, eNakupi
- Glavni oglasni platformi: Bolha.com, MojeDelo.com
- Družbena omrežja: Facebook, Instagram, LinkedIn (najpopularnejša v SL)
---

CHAT SYSTEM PROMPT (for conversational AI):
---
Si 1984 Chat — prijazen in pameten AI asistent, ki govori slovensko.
Pomagaj uporabnikom z njihovimi vprašanji, pisanjem besedil, idejami za marketing in splošnimi nalogami.
Odgovarjaj naravno, kot bi se pogovarjal s kolegom. Bodi koristen, jedrnat in prijazen.
Če ne veš odgovora, to pošteno povej.
---

TRANSLATOR SYSTEM PROMPT:
---
Si 1984 Prevajalnik — profesionalni prevajalec, ki razume kontekst in nianse.
Prevajaj naravno, ne dobesedno. Upoštevaj kulturne razlike in lokalne izraze.
Pri prevajanju iz slovenščine ohrani formalni/neformalni ton izvirnika.
Podprti jeziki: slovenščina, angleščina, nemščina, hrvaščina, italijanščina, srbščina.
---
```

---

## 7. Claude Code Commands Cheat Sheet

### Starting a Session

```bash
cd nineteen84
claude
```

### Common Commands to Give Claude Code

**Add a new template:**
```
Add a new Slovenian text template called "Opis turistične nastanitve" (Tourist accommodation description).
It should ask for: name of property, location, type (hotel/apartment/hiša), key features, target guests.
Use Haiku model, max_tokens=600. Add it to the template selector on the besedila page.
```

**Fix a Slovenian grammar issue:**
```
The AI output for product descriptions sometimes uses wrong cases after "za" preposition.
Update the system prompt to explicitly instruct: "Po predlogu 'za' vedno uporabi tožilnik (4. sklon)."
```

**Add Stripe webhook handling:**
```
Set up the Stripe webhook at /api/stripe/webhook to handle:
- checkout.session.completed → create subscription in Supabase
- customer.subscription.updated → update plan
- customer.subscription.deleted → deactivate
- invoice.payment_failed → send warning email in Slovenian
```

**Deploy to production:**
```
Set up Vercel deployment:
1. Connect GitHub repo to Vercel
2. Set all env vars from .env.local
3. Configure custom domain (nineteen84.si)
4. Enable Vercel Cron for outreach
5. Set up Stripe webhook endpoint to production URL
```

**Scale from Haiku to Sonnet (when revenue flows):**
```
We're now profitable and want to upgrade AI quality.
Update the AI router (lib/ai/client.ts) to:
1. Change default model from Haiku to Sonnet 4.5 for ALL paid users
2. Keep Haiku only for free trial users
3. Add a "Premium" badge next to Sonnet-powered outputs
4. Update the pricing page to highlight "Poganjano z najzmogljivejšim AI modelom"
```

---

## Quick Start Checklist

Run these commands TODAY:

```bash
# 1. Install Claude Code
npm install -g @anthropic-ai/claude-code

# 2. Create project
mkdir nineteen84 && cd nineteen84

# 3. Start Claude Code and paste the project setup prompt from Section 2

# 4. Register accounts (in browser):
#    - console.anthropic.com (Claude API key)
#    - platform.openai.com (DALL-E API key)
#    - supabase.com (create project, get URL + keys)
#    - stripe.com (create account, get keys)
#    - resend.com (email API key, verify domain)
#    - register.si (register nineteen84.si domain)

# 5. Copy .env.local.example to .env.local and fill in keys

# 6. Tell Claude Code: "Run the dev server and show me the landing page"
```

---

## Revenue Pivot Plan

When you hit **€1,000 MRR** (approximately 50-70 paying users):

1. **Switch default model to Sonnet 4.5** for all paid plans
2. **Add Claude Opus 4.5** as a premium "Ekspertni" tier at €59.90/month
3. **Enable audio features** (Whisper STT + ElevenLabs/Edge TTS for Slovenian voices)
4. **Launch affiliate program** (20% recurring commission)
5. **Begin Croatian (HR) expansion** — minimal changes needed, same dark UI

When you hit **€5,000 MRR**:

1. **Hire part-time Slovenian copywriter** to QA AI outputs and improve prompts
2. **Launch "Moji podatki"** (My Data) — users upload company info for personalized outputs
3. **Serbian expansion** — ćirilica + latinica support
4. **White-label for agencies** — custom branding, team seats

---

*This document is your single source of truth for the 1984 project. Keep it updated as you build.*
