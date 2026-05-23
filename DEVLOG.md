## Day 1 — 2026-05-21

**Hours worked:** 3

**What I did:**
- Initialized Next.js 16 project with TypeScript and Tailwind CSS
- Created all required markdown files (DEVLOG, ARCHITECTURE, GTM, etc.)
- Set up GitHub repository and pushed initial commit
- Researched all 8 AI tools pricing pages for PRICING_DATA.md
- Planned overall app architecture and data flow

**What I learned:**
- Next.js App Router structure is different from Pages Router
- Credex's product positioning — selling discounted AI credits to startups
- Most startups have no visibility into AI tool overspend

**Blockers / what I'm stuck on:**
- Need to decide between Supabase vs Firebase for lead storage backend
- Need Anthropic API key for AI summary feature

**Plan for tomorrow:**
- Build the spend input form with all 8 AI tools
- Implement localStorage persistence for form state
- Start audit engine logic with pricing rules

---

## Day 2 — 2026-05-22

**Hours worked:** 4

**What I did:**
- Fixed route.ts import path issue (@/lib vs relative paths)
- Verified all pages working end-to-end on localhost
- Deployed to Vercel — live at https://ai-spend-audit-gamma-pearl.vercel.app
- Updated README.md with live URL, quick start, and 5 key decisions
- Started researching and verifying pricing for PRICING_DATA.md

**What I learned:**
- Next.js @/ path alias prevents relative import confusion across nested routes
- Vercel serverless functions don't persist in-memory state between calls — real DB is mandatory, not optional
- Credex's audit tool needs to be honest — manufacturing savings for already-optimal stacks kills trust

**Blockers / what I'm stuck on:**
- Need real Anthropic API key to test AI summary feature
- Supabase integration not started yet — top priority tomorrow

**Plan for tomorrow:**
- Complete Supabase integration for lead storage
- Add email sending via Resend free tier
- Fill PRICING_DATA.md, GTM.md, ECONOMICS.md
- Write minimum 5 tests for audit engine
- Set up GitHub Actions CI workflow

## Day 3 — 2026-05-23

**Hours worked:** 5

**What I did:**
- Conducted 3 real user interviews (sukesh., Balaji., Vamsi.) — 10-15 mins each via WhatsApp
- Wrote full USER_INTERVIEWS.md with direct quotes and design changes
- Wrote complete REFLECTION.md answering all 5 questions
- Added Cursor + Claude overlap detection to audit engine based on interview insight
- Updated README.md with proper project description
- Got Anthropic API key from console.anthropic.com and added to Vercel env vars
- Tested full end-to-end flow on live Vercel URL

**What I learned:**
- Real users don't know which AI tools overlap — Cursor Pro includes Claude model access but nobody realizes it
- ChatGPT Team vs 3x Plus is the highest-value single audit check — users assume "Team plan" is always cheaper
- Talking to 3 real people surfaced 2 audit rules I hadn't thought of from the desk

**Blockers / what I'm stuck on:**
- Need to add Open Graph meta tags for shareable result URLs
- README still has default Next.js content — needs screenshots

**Plan for tomorrow:**
- Add OG meta tags to results page for proper link previews
- Take screenshots of working app and add to README
- Fix any remaining Supabase integration issues
- Polish results page UI
- Write DEVLOG Day 4 entry