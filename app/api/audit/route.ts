// app/api/audit/route.ts
// API endpoint — receives form data, runs audit, stores result, returns ID

import { NextRequest, NextResponse } from 'next/server';
// FIXED: Adjusted relative paths to correctly find the lib directory
import { runAudit } from '@/lib/auditEngine';
import type { AuditFormData } from '@/lib/auditEngine';
import { v4 as uuidv4 } from 'uuid';
export const dynamic = 'force-dynamic';

// In-memory store for now (Day 1-2)
// Will replace with Supabase on Day 3
const auditStore = new Map<string, object>();

export async function POST(req: NextRequest) {
  try {
    const formData: AuditFormData = await req.json();

    // Basic validation
    if (!formData.tools || formData.tools.length === 0) {
      return NextResponse.json({ error: 'No tools provided' }, { status: 400 });
    }

    // Run the audit engine
    const result = runAudit(formData);

    // Generate unique ID for this audit
    const id = uuidv4();

    // Generate AI summary using Anthropic API
    let aiSummary = '';
    try {
      aiSummary = await generateAISummary(formData, result);
    } catch (err) {
      // Graceful fallback if API fails
      aiSummary = generateFallbackSummary(formData, result);
    }

    // Store the audit result
    const auditRecord = {
      id,
      formData: {
        teamSize: formData.teamSize,
        useCase: formData.useCase,
        // FIXED: Added explicit type (any) to parameter 't' to satisfy TypeScript rules
        tools: formData.tools.map((t: any) => ({ tool: t.tool, plan: t.plan, seats: t.seats })),
        // Strip spend amounts from stored version for privacy
      },
      result,
      aiSummary,
      createdAt: new Date().toISOString(),
    };

    auditStore.set(id, auditRecord);

    return NextResponse.json({ id, result, aiSummary });
  } catch (err) {
    console.error('Audit API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const audit = auditStore.get(id);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  return NextResponse.json(audit);
}

// ── AI Summary Generation ─────────────────────────────────────────────────────

async function generateAISummary(formData: AuditFormData, result: any): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('No API key');

  // FIXED: Added explicit type (any) to parameter 't' to satisfy TypeScript rules
  const toolsList = formData.tools.map((t: any) => `${t.tool} (${t.plan})`).join(', ');
  const topSavings = result.recommendations
    // FIXED: Added explicit type (any) to parameter 'r' to satisfy TypeScript rules
    .filter((r: any) => r.monthlySavings > 0)
    .sort((a: any, b: any) => b.monthlySavings - a.monthlySavings)
    .slice(0, 2)
    .map((r: any) => `${r.tool}: save $${r.monthlySavings}/mo`)
    .join(', ');

  const prompt = `You are a financial advisor specializing in SaaS cost optimization for startups.

A team of ${formData.teamSize} people primarily uses AI tools for ${formData.useCase}. They currently pay for: ${toolsList}.

Our audit found $${result.totalMonthlySavings}/month in potential savings ($${result.totalAnnualSavings}/year).
Top opportunities: ${topSavings || 'Stack is well-optimized'}.

Write a 80-100 word personalized audit summary paragraph. Be specific, direct, and actionable. 
Mention their use case and the biggest saving opportunity. 
Do NOT use bullet points — write in flowing prose.
Do NOT start with "I" or be sycophantic.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text ?? generateFallbackSummary(formData, result);
}

function generateFallbackSummary(formData: AuditFormData, result: any): string {
  if (result.totalMonthlySavings < 100) {
    return `Your ${formData.teamSize}-person team's AI stack for ${formData.useCase} is well-optimized. You're spending $${result.totalCurrentSpend}/month across ${formData.tools.length} tool(s), and our audit found no major inefficiencies. Keep an eye on usage as your team scales — plan mismatches become more expensive with more seats.`;
  }

  const topRec = result.recommendations
    .filter((r: any) => r.monthlySavings > 0)
    .sort((a: any, b: any) => b.monthlySavings - a.monthlySavings)[0];

  return `Your ${formData.teamSize}-person ${formData.useCase} team is spending $${result.totalCurrentSpend}/month on AI tools, but our audit found $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year) in unnecessary costs. The biggest opportunity is ${topRec?.tool ?? 'your current stack'} — ${topRec?.reason ?? 'plan optimisation available'}. Addressing these would meaningfully reduce your AI infrastructure costs without sacrificing capability.`;
}