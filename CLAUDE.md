# 1984 — AI, ki piše slovensko

## Project Overview
- **Platform name:** 1984
- **Domain:** 1984.si
- **Description:** Slovenian AI content creation platform (like Editee.com for Czech Republic)
- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Supabase, Stripe, shadcn/ui

## Design System

### Theme
- **DARK THEME ONLY** — no light mode
- Page background: `#171717`
- Surface: `#181818`
- Navbar: `#191919`
- Hover state: `#242424`

### Colors
- CTA button gradient: `linear-gradient(90deg, #FFB288, #FEB089, #EE94B0)` — salmon to rose
- Logo gradient: `linear-gradient(90deg, #EFBC9F, #D797A6, #FF9ED1)` — peach to hot pink
- Text color: `#E1E1E1` off-white (NOT pure white)
- Pure `#FFFFFF` only on CTA button text
- Accent: `#FEB089` (salmon)
- Borders: `rgba(255, 255, 255, 0.06)` — nearly invisible

### Typography
- **Headings (big sections):** "Instrument Serif" — weight 400, letter-spacing 0.01em
- **Everything else:** "Plus Jakarta Sans" — nav, body text, buttons
- Both loaded from Google Fonts via next/font/google

### Components
- Glass morphism cards: `backdrop-blur-xl bg-white/[0.02] border border-white/[0.06]`
- CTA buttons: gradient fill, pill shape (`rounded-full`), dark text `#171717`
- Borders: `rgba(255, 255, 255, 0.06)`

### Animations
- Fade-in + slide-up on scroll: 800ms ease-out
- Stagger: 50-100ms per child element
- Implemented via IntersectionObserver

## AI Routing
- Chat: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — fast and cheap
- Free + Osnovno: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Profesionalno + Poslovno: Claude Opus 4.6 (`claude-opus-4-6`)
- Auto-routing: premium users get Opus for complex queries, Sonnet for simple ones
- Prompt caching: `cache_control: { type: "ephemeral" }` on system prompts

## Language
- All user-facing text must be in **Slovenian**

## Key Packages
- `@anthropic-ai/sdk` — Claude API
- `openai` — OpenAI API
- `@supabase/supabase-js` + `@supabase/ssr` — Database & auth
- `stripe` — Payments
- `resend` — Transactional email
- `lucide-react` — Icons
- `shadcn/ui` — UI components (zinc base, dark theme, CSS variables)
