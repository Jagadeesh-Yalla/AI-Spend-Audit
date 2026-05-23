# Reflection

---

## 1. The Hardest Bug I Hit This Week

The hardest bug was the import path issue in `app/api/audit/route.ts`. The file is nested at `app/api/audit/route.ts`, and I initially used `../../lib/auditEngine` as the import path. This worked in VS Code (no red squiggles) but failed silently at runtime — the API returned a 500 error with no useful message in the browser.

My debugging process: First I suspected the audit engine itself had a runtime error, so I added console.log statements throughout `auditEngine.ts`. No logs appeared, which meant the file wasn't loading at all. I then checked the Next.js docs on module resolution and realized App Router API routes have a different relative path resolution than I expected. I tried `../../../lib/auditEngine` (three levels up) — same issue. Finally I switched to the `@/` alias (`@/lib/auditEngine`) which Next.js resolves from the project root. That fixed it immediately.

What I learned: always use `@/` aliases in Next.js projects instead of relative paths. Relative paths in deeply nested API routes are fragile and fail in non-obvious ways.

---

## 2. A Decision I Reversed Mid-Week

I originally planned to use Firebase for the backend because I had used it before. On Day 2, I reversed this and switched to Supabase.

What made me reverse it: Firebase's free tier stores data as NoSQL documents, which makes it awkward to query leads by audit ID or run simple aggregations (e.g., "how many high-savings audits this week"). Supabase uses PostgreSQL, which means I can write straightforward SQL queries. For a lead-generation tool where Credex will want to analyze audit data, relational structure is the right call. The migration cost was low (just swap the client library) so I made the switch on Day 2 before writing any Firebase-specific code.

---

## 3. What I Would Build in Week 2

If I had a second week, the highest-leverage additions would be:

**Benchmark mode** — "Your AI spend per developer is $X. Companies your size average $Y." This requires collecting anonymized aggregate data from audits, but would make results dramatically more shareable because people love seeing how they compare to peers.

**Embeddable widget** — A `<script>` tag version that a startup blog or newsletter could drop in. This is the viral distribution mechanism. Instead of users coming to the tool, the tool goes to where users already are.

**Email drip sequence** — Right now we send one confirmation email. A 3-email sequence (Day 0: audit summary, Day 7: "prices may have changed, re-audit?", Day 30: "new tools added") would dramatically improve consultation conversion rates.

---

## 4. How I Used AI Tools

I used Claude (claude.ai) as my primary development assistant throughout this week.

**What I used it for:**
- Generating boilerplate for Next.js API routes and Supabase client setup
- Drafting the initial audit engine structure (which I then heavily modified)
- Writing the markdown files (ARCHITECTURE, GTM, ECONOMICS)
- Debugging the import path issue by describing the error and asking for Next.js-specific guidance

**What I didn't trust AI with:**
- The actual audit math and pricing data — I verified every number against official pricing pages myself
- The user interview notes — these were real conversations, AI can't fabricate genuine surprising moments
- Commit messages — I wrote these myself to accurately reflect what each commit actually changed

**One specific time AI was wrong and I caught it:**
When I asked Claude to generate the AI summary prompt, it suggested using `gpt-4o` as the model. I caught this because the assignment specifically says to use the Anthropic API (preferred). More importantly, the generated prompt included "I've analyzed your AI spend and found..." — starting with "I" in a way that reads as the AI speaking, which is exactly the sycophantic opener I wanted to avoid. I rewrote the prompt constraint as "Do NOT start with 'I'" and tested it explicitly.

---

## 5. Self-Rating

**Discipline: 7/10**
I worked consistently across Days 1-3 with commits on each day, but I spent too long debugging the import path issue on Day 2 when I should have caught it earlier by testing the API route immediately after writing it.

**Code quality: 7/10**
The audit engine is clean, well-typed, and has zero external dependencies — I'm proud of that. The API routes are functional but the error handling could be more granular. I'd add proper error types rather than generic `500` responses with more time.

**Design sense: 6/10**
The UI is functional and readable but not visually distinctive. The dark indigo theme is clean but I reused the same card pattern too many times. With more time I'd add more visual hierarchy to the results page — the hero savings number should feel more celebratory.

**Problem-solving: 8/10**
The decision to hardcode audit rules rather than use AI for the math was correct and I made it confidently. Recognizing the Firebase → Supabase switch early before writing any database code was good problem-solving. The import path debugging took too long but I eventually found the root cause systematically.

**Entrepreneurial thinking: 7/10**
The GTM and ECONOMICS documents show real founder thinking — specific channels, unit economics with actual numbers, a realistic path to $1M ARR. The user interviews surfaced a genuine insight (Cursor Pro already includes Claude model access) that I hadn't thought of before talking to real users. Where I fell short: I haven't actually posted the tool anywhere or gotten a single real audit completed by a stranger. 
