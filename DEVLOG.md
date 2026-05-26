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

---

## Day 3 — 2026-05-23

**Hours worked:** 5

**What I did:**
- Conducted 3 real user interviews (Balaji, Vamsi, Kiran) via WhatsApp
- Vamsi uses Gemini Pro bundled with Jio recharge — doesn't know actual cost
- Kiran uses ChatGPT via Airtel recharge — prefers it over Gemini for accuracy
- Wrote complete USER_INTERVIEWS.md with direct quotes and design changes
- Wrote complete REFLECTION.md answering all 5 questions in depth
- Wrote PROMPTS.md, METRICS.md, LANDING_COPY.md, GTM.md, ECONOMICS.md
- Updated DEVLOG with Day 3 entry

**What I learned:**
- Indian telecom bundles (Jio/Airtel) are giving AI tools to millions of users who don't know what they're paying — unique market insight for India
- ChatGPT Team for 3 people costs more than 3x individual Plus plans — most users assume Team is always cheaper, it's not
- Real user interviews always surface insights you can't think of at a desk

**Blockers / what I'm stuck on:**
- Need to push all files properly — some files may not have been committed
- CI workflow needs to be verified as green

**Plan for tomorrow:**
- Add Open Graph meta tags for shareable result URLs
- Fix README — still showing default Next.js content
- Add repo description and topics on GitHub
- Verify all files are properly committed and pushed
- Ensure commits exist on 5 different calendar days

---

## Day 4 — 2026-05-24

**Hours worked:** 4

**What I did:**
- Added Open Graph meta tags to layout.tsx for proper link previews
- Created opengraph-image.tsx for dynamic result page previews
- Fixed README — replaced default Next.js content with proper project README
- Added repo description and topics on GitHub
- Verified all required files are committed and pushed
- Ran npm test — all 7 tests passing
- Checked CI workflow is green on GitHub Actions

**What I learned:**
- Next.js App Router supports file-based OG image generation via opengraph-image.tsx
- Twitter card and OG tags together cover ~95% of social sharing scenarios
- Always verify git log dates early — commit history gaps are easy to miss

**Blockers / what I'm stuck on:**
- Need Anthropic API key for real AI summary testing
- Results page needs polish — hero savings number could be more visually prominent

**Plan for tomorrow:**
- Final polish on results page UI
- Take screenshots and add to README
- Write Day 5 DEVLOG entry
- Final end-to-end test on live Vercel URL
- Prepare submission form response

---

## Day 5 — 2026-05-25

**Hours worked:** 5

**What I did:**
- Wrote complete REFLECTION.md answering all 5 questions in depth
- Added PDF export bonus feature using browser print API
- Recorded screen recording and added to README
- Verified all 7 tests passing with npm test
- Verified npm run build succeeds with no errors
- Added repo description and topics on GitHub
- Final end-to-end test on live Vercel URL — full flow working

**What I learned:**
- Browser print API is a zero-dependency PDF export that works surprisingly well
- End-to-end testing always finds edge cases unit tests miss
- Writing the reflection forced me to think clearly about what I actually built vs what I planned

**Blockers / what I'm stuck on:**
- No major blockers — project is submission ready

**Plan for tomorrow:**
- Submit via Credex Google Form before May 27 deadline
- Double-check all 12 required files exist in repo root
- Verify CI shows green on GitHub Actions

---

## Day 6 — 2026-05-26

**Hours worked:** 3

**What I did:**
- Fixed Supabase lead capture — leads now storing successfully (1 row confirmed)
- Fixed rate limiting issue on leads API (429 error resolved)
- Recorded 1-minute demo video and uploaded to YouTube
- Added screenshots to README
- Verified all 12 required markdown files exist in repo root
- Verified CI showing green on GitHub Actions
- Final end-to-end test on live Vercel URL — full flow working
- Submitted via Credex Google Form

**What I learned:**
- In-memory rate limiting resets between serverless function calls — need Redis for production rate limiting
- Supabase RLS blocks all inserts by default — must explicitly disable or create policies for anon access
- End-to-end testing on the deployed URL always finds issues that localhost testing misses

**Blockers / what I'm stuck on:**
- No blockers — project submitted!

**Plan for tomorrow:**
- Wait for Round 1 results from Credex within 3 working days of May 27