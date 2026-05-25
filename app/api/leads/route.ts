// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

// Simple rate limiting using in-memory store
const rateLimitMap = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 requests per IP per hour
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) ?? 0;

    if (now - lastRequest < 20 * 60 * 1000) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }
    rateLimitMap.set(ip, now);

    const body = await req.json();
    const { email, company, role, auditId, isHighSavings, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true }); // Silently reject bots
    }

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Store lead in Supabase
    const { error } = await supabase.from('leads').insert({
      audit_id: auditId,
      email,
      company: company || null,
      role: role || null,
      is_high_savings: isHighSavings,
    });

    if (error) {
      console.error('Lead insert error:', error);
    }

    // Send confirmation email via Resend
    try {
      await sendConfirmationEmail(email, isHighSavings);
    } catch (err) {
      console.error('Email send error:', err);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Leads API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendConfirmationEmail(email: string, isHighSavings: boolean) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const subject = isHighSavings
    ? 'Your AI Spend Audit — Significant savings found'
    : 'Your AI Spend Audit Report';

  const html = isHighSavings
    ? `<h2>Your audit found significant savings opportunities!</h2>
       <p>Our team will be in touch about how Credex discounted AI credits could help you capture even more savings.</p>
       <p>In the meantime, review your audit results and start implementing the recommended changes.</p>
       <p>— Team Credex</p>`
    : `<h2>Your AI Spend Audit is ready</h2>
       <p>Thank you for using our free AI spend audit tool.</p>
       <p>We'll notify you when new optimizations apply to your stack.</p>
       <p>— Team Credex</p>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AI Spend Audit <audit@credex.rocks>',
      to: email,
      subject,
      html,
    }),
  });
}