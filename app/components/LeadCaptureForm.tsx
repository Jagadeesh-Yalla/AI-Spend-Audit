'use client';
// app/components/LeadCaptureForm.tsx
// Email capture — shown AFTER value is displayed, never before

import { useState } from 'react';

interface Props {
  auditId: string;
  isHighSavings: boolean;
}

export default function LeadCaptureForm({ auditId, isHighSavings }: Props) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  // Honeypot field — hidden from real users, bots fill it
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async () => {
    // Honeypot check — if filled, silently reject
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role, auditId, isHighSavings }),
      });
      setSubmitted(true);
    } catch {
      // Fail silently — don't block user
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-emerald-400 mb-1">Report sent!</p>
        <p className="text-white/50 text-sm">
          Check your inbox. {isHighSavings && "We'll be in touch about Credex savings opportunities."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-1">Get your report by email</h3>
      <p className="text-white/50 text-sm mb-4">
        We'll send a copy of this audit to your inbox.
        {isHighSavings && ' For high-savings cases, our team may reach out about Credex credits.'}
      </p>

      <div className="space-y-3">
        {/* Honeypot — hidden */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <input
          type="email"
          placeholder="your@email.com *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Company name (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Your role (optional)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all"
        >
          {loading ? 'Sending...' : 'Send me the report →'}
        </button>
      </div>
      <p className="text-white/20 text-xs mt-3 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}