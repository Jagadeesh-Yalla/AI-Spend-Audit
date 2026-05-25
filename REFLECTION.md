# Reflection

---

## 1. The Hardest Bug I Hit This Week

The hardest bug was the import path issue in `app/api/audit/route.ts`. The file sits at `app/api/audit/route.ts` and I initially used `../../lib/auditEngine` as the relative import path. This worked in VS Code — no red squiggles — but failed silently at runtime. When a user clicked "Get my free audit," the API returned a 500 error with no useful message in the browser console.

My debugging process: First I suspected the audit engine itself had a runtime error, so I added console.log statements throughout `auditEngine.ts`. No logs appeared at all, which meant the file wasn't loading. I then checked the Next.js docs on module resolution and realized App Router API routes have different relative path resolution than I expected. I tried `../../../lib/auditEngine` — same issue. I tried `./lib/auditEngine` — same. Finally I switched to the `@/` alias (`@/lib/auditEngine`) which Next.js resolves from the project root. That fixed it immediately.

What I learned: always use `@/` aliases in Next.js projects instead of relative paths. Relative paths in deeply nested API routes are fragile and fail in non-obvious ways that are hard to debug without knowing where to look.

---

## 2. A Decision I Reversed Mid-Week

I originally planned to use Firebase for the backend database because I had used it in a previous project. On Day 2, I reversed this and switched to Supabase before writing a single line of Firebase-specific code.

What made me reverse it: I was writing out the data schema and realized that Credex would want to analyze audit data — things like "how many high-savings audits this week" or "which tools appear most in audits." Firebase's NoSQL document model makes these aggregation queries awkward and expensive. Supabase uses PostgreSQL, which handles these queries with simple SQL. The migration cost was zero since I hadn't written any database code yet. I documented this decision in ARCHITECTURE.md so reviewers can see the reasoning.

---

## 3. What I Would Build in Week 2

If I had a second week, the three highest-leverage additions would be:

**Benchmark mode** — "Your AI spend per developer is $X. Companies your size average $Y." This requires collecting anonymized aggregate data from completed audits, but would make results dramatically more shareable. People love seeing how they compare to peers, and comparison screenshots drive organic sharing.

**Embeddable widget** — A `<script>` tag version that a startup blog or newsletter could drop onto their page. This is the viral distribution flywheel. Instead of users coming to the tool, the tool goes where users already are — tech newsletters, startup blogs, developer Discord servers.

**Email drip sequence** — Right now we send one confirmation email. A 3-email sequence would dramatically improve consultation conversion: Day 0 sends the audit summary, Day 7 asks "prices may have changed — want to re-audit?", Day 30 announces new tools added to the auditor. Each email is a natural re-engagement touchpoint that keeps Credex top of mind.

---

## 4. How I Used AI Tools

I used Claude (claude.ai) as my primary development assistant throughout this week.

**What I used it for:**
- Generating boilerplate for Next.js API routes and Supabase client setup
- Drafting the initial audit engine structure which I then heavily modified with real pricing logic
- Writing first drafts of the markdown files (ARCHITECTURE, GTM, ECONOMICS) which I then edited for accuracy
- Debugging the import path issue by describing the error and asking for Next.js-specific guidance

**What I didn't trust AI with:**
- The actual audit math and pricing data — I verified every single number against official vendor pricing pages myself. AI would have hallucinated prices.
- The user interview notes — these were real WhatsApp conversations with Balaji, Vamsi, and Kiran. AI cannot fabricate genuine surprising moments.
- Commit messages — I wrote every commit message myself to accurately reflect what each commit actually changed.
- The DEVLOG entries — these reflect my actual daily progress, not what AI thinks I should have done.

**One specific time AI was wrong and I caught it:**
When generating the Anthropic API summary prompt, Claude suggested using `gpt-4o` as the model string. I caught this immediately — the assignment specifically says to prefer the Anthropic API, and using an OpenAI model string in an Anthropic API call would cause a hard error. More importantly, the generated prompt started with "I've analyzed your AI spend..." — starting with "I" in a sycophantic way I explicitly wanted to avoid. I rewrote the prompt with "Do NOT start with I" as a hard constraint and tested it to confirm.

---

## 5. Self-Rating

**Discipline: 7/10**
I worked consistently across all 5 days with commits on each calendar day, which was a hard requirement. I started Day 1 immediately after receiving the assignment brief. Where I lost points: I spent too long debugging the import path issue on Day 2 when I should have caught it earlier by testing the API route immediately after writing it rather than writing three more files first.

**Code quality: 7/10**
The audit engine is clean, well-typed, and has zero external dependencies — I'm genuinely proud of that architectural decision. The 7 tests all pass and cover meaningful edge cases. Where I'd improve: the API routes use `any` types in several places I had to suppress with ESLint config rather than properly typing. With more time I'd define proper interfaces for every function parameter.

**Design sense: 6/10**
The UI is functional, readable, and uses a consistent dark indigo theme throughout. The landing page communicates the value proposition clearly. Where it falls short: the results page hero savings number could feel more celebratory — right now it's just a large number. A proper win state with animation would dramatically improve the emotional impact of seeing your savings.

**Problem-solving: 8/10**
Two decisions I'm most proud of: hardcoding audit rules instead of using AI for financial math (correct and I made it confidently), and switching from Firebase to Supabase before writing any database code (caught early, zero migration cost). The import path debugging took too long but I found the root cause systematically without giving up.

**Entrepreneurial thinking: 7/10**
The GTM and ECONOMICS documents show real founder thinking — specific distribution channels, unit economics with actual numbers, a realistic path to revenue. The user interviews surfaced a genuine market insight about Indian telecom bundles (Jio/Airtel giving AI tools to millions of users who don't know what they're paying) that I hadn't considered before talking to real users. Where I fell short: the tool is live but I haven't actually posted it anywhere or gotten a single audit completed by a stranger. A stronger submission would have real traction numbers. 
