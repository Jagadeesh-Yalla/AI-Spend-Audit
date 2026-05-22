# Prompts

## AI Summary Generation Prompt

Used in: `app/api/audit/route.ts` → `generateAISummary()`

```
You are a financial advisor specializing in SaaS cost optimization for startups.

A team of ${teamSize} people primarily uses AI tools for ${useCase}. They pay for: ${toolsList}.

Audit found $${totalMonthlySavings}/month in savings ($${totalAnnualSavings}/year).
Top opportunities: ${topSavings || 'Stack is well-optimized'}.

Write an 80-100 word personalized audit summary in flowing prose. Be specific and actionable.
Do NOT use bullet points. Do NOT start with "I".
```

### Why I wrote it this way

- **Role assignment** ("financial advisor") — grounds the model in defensible, numbers-first thinking rather than generic advice
- **Specific constraints** ("Do NOT use bullet points") — the summary sits in a UI card next to a bullet-point breakdown; prose creates visual contrast
- **"Do NOT start with I"** — prevents sycophantic openers like "I've analyzed your stack..."
- **80-100 word constraint** — short enough to read in 15 seconds, long enough to be specific

### What I tried that didn't work

- Asking for "a 3-sentence summary" → produced summaries that were either too short or artificially padded
- Asking for "actionable recommendations" without prose constraint → produced bullet points identical to the breakdown below
- Using claude-sonnet instead of claude-haiku → 3× cost for no quality improvement on this simple task

### One time the AI was wrong and I caught it

During testing, the model generated a summary saying a team "should switch from Claude Pro to ChatGPT Plus to save $0/month" — hallucinating a recommendation that wasn't in the audit data at all. This confirmed the right decision: **hardcode all audit math, use AI only for prose summary of pre-computed results.**  
