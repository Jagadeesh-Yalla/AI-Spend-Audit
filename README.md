# 🔍 AI Spend Audit

> Free tool that audits your AI tool stack and finds where you're overpaying.

**[🌐 Live Demo](https://ai-spend-audit-gamma-pearl.vercel.app)**

Built as a Round 1 submission for Credex Web Development Internship 2026.

---

## What it does

Enter the AI tools your team pays for (Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf, and API direct plans). Get an instant audit showing per-tool overspend, recommended actions, and total monthly + annual savings. No login required to see results.

For audits showing >$500/mo savings, Credex is surfaced as a way to capture even more savings through discounted AI credits.

---

## Screenshots

> App running at https://ai-spend-audit-gamma-pearl.vercel.app


### Landing Page
![Landing Page](/screenshots/screenshot-landing.png)

### Audit Form
![Audit Form](/screenshots/screenshot-audit.png)

### Results Page
![Results Page](/screenshots/screenshot-results.png)

---

## Quick Start

```bash
git clone https://github.com/Jagadeesh-Yalla/AI-Spend-Audit.git
cd AI-Spend-Audit
npm install
cp .env.example .env.local
# Add your keys to .env.local
npm run dev
```

Open http://localhost:3000

## Environment Variables

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

ANTHROPIC_API_KEY=your_anthropic_key

RESEND_API_KEY=your_resend_key

## Decisions

1. **Next.js App Router over plain React** — API routes + SSR + client components in one framework. No separate Express backend needed, reducing deployment complexity.
2. **Hardcoded audit rules, not AI** — The assignment tests whether you know when NOT to use AI. Financial calculations must be deterministic and defensible. AI would hallucinate savings numbers.
3. **Supabase over Firebase** — PostgreSQL makes lead analytics and audit queries straightforward. Firebase's NoSQL would make "high-savings audits this week" queries awkward.
4. **Email captured after value shown** — Lead capture only appears after the user sees their audit results. Asking for email before showing value tanks conversion.
5. **Fallback AI summary** — Anthropic API failures degrade gracefully to a templated summary. The product works end-to-end even without a valid API key.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic API (claude-haiku) for personalized summaries
- **Email:** Resend (transactional confirmation emails)
- **Deployment:** Vercel

## Running Tests

```bash
npm test
```

7 tests covering the audit engine. All must pass before submitting.

## Live URL

https://ai-spend-audit-gamma-pearl.vercel.app

## Demo

🎥 [Watch 1-minute demo](https://youtu.be/KG2RgUPclec)
