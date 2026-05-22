# 🔍 AI Spend Audit

> Free tool to find overspend in your AI tool stack — built for Credex.

**[🌐 Live Demo](https://ai-spend-audit-gamma-pearl.vercel.app)**

## What it does
Enter the AI tools your team pays for. Get an instant audit showing where you're overspending, what to switch, and total monthly + annual savings.

## Screenshots
[Add screenshots here]

## Quick Start
```bash
git clone https://github.com/Jagadeesh-Yalla/AI-Spend-Audit.git
cd AI-Spend-Audit
npm install
npm run dev
```

## Decisions
1. **Next.js over plain React** — App Router gives us API routes + SSR in one framework
2. **In-memory store → Supabase** — Started simple, migrating to real DB on Day 3
3. **Hardcoded audit rules** — Knowing when NOT to use AI is part of the test
4. **Fallback AI summary** — Graceful degradation if Anthropic API fails
5. **Email after value** — Lead capture shown only after audit results, never before

## Tech Stack
- Next.js 16 + TypeScript
- Tailwind CSS
- Anthropic API (claude-haiku)
- Supabase (coming Day 3)
- Vercel (deployment)

## Live URL
https://ai-spend-audit-gamma-pearl.vercel.app