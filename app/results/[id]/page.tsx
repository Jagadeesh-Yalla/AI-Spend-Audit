'use client';
// app/results/[id]/page.tsx
// Audit results page — shareable via unique URL

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { AuditResult } from '@/lib/auditEngine';
import LeadCaptureForm from '../../components/LeadCaptureForm';
interface AuditData {
  id: string;
  result: AuditResult;
  aiSummary: string;
  formData: {
    teamSize: number;
    useCase: string;
  };
}

const severityColors = {
  high: 'text-red-400 bg-red-400/10 border-red-400/30',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  optimal: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
};

const severityLabels = {
  high: '🔴 High savings',
  medium: '🟡 Medium savings',
  low: '🔵 Low savings',
  optimal: '✅ Optimal',
};

export default function ResultsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Try sessionStorage first (just submitted)
    const cached = sessionStorage.getItem(`audit_${id}`);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    fetch(`/api/audit?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">Audit not found</p>
          <a href="/audit" className="text-indigo-400 hover:underline">
            Start a new audit →
          </a>
        </div>
      </div>
    );
  }

  const { result, aiSummary } = data;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-indigo-400 text-sm hover:underline">
            ← New audit
          </a>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm hover:bg-white/10 transition-all"
          >
            {copied ? '✅ Copied!' : '🔗 Share this audit'}
          </button>
        </div>

        {/* Hero savings */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 mb-6 text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2 font-bold">
            Potential savings found
          </p>
          <p className="text-6xl font-black text-white mb-1">
            ${result.totalMonthlySavings.toLocaleString()}
            <span className="text-2xl text-white/50 font-normal">/mo</span>
          </p>
          <p className="text-emerald-400 font-bold text-xl">
            ${result.totalAnnualSavings.toLocaleString()} per year
          </p>
          <p className="text-white/40 text-sm mt-2">
            Current spend: ${result.totalCurrentSpend.toLocaleString()}/mo
          </p>
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-3">
              AI Analysis
            </p>
            <p className="text-white/70 leading-relaxed">{aiSummary}</p>
          </div>
        )}

        {/* Per-tool breakdown */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">Per-tool breakdown</h2>
          <div className="space-y-3">
            {result.recommendations.map((rec) => (
              <div
                key={rec.tool}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold">{rec.tool}</h3>
                    <p className="text-white/40 text-sm">
                      {rec.currentPlan} · ${rec.currentSpend}/mo
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${severityColors[rec.severity]}`}
                  >
                    {severityLabels[rec.severity]}
                  </span>
                </div>
                <p className="text-sm font-medium text-white/80 mb-2">
                  → {rec.recommendedAction}
                </p>
                <p className="text-sm text-white/50">{rec.reason}</p>
                {rec.monthlySavings > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex gap-6">
                    <div>
                      <p className="text-xs text-white/40">Monthly savings</p>
                      <p className="text-emerald-400 font-bold">
                        ${rec.monthlySavings}/mo
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Annual savings</p>
                      <p className="text-emerald-400 font-bold">
                        ${rec.annualSavings}/yr
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credex CTA for high savings */}
        {result.isHighSavings && (
          <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-6 mb-6">
            <p className="text-emerald-400 font-bold text-lg mb-2">
              💡 You could save even more with Credex
            </p>
            <p className="text-white/60 text-sm mb-4">
              Credex sells discounted AI infrastructure credits — Claude, ChatGPT Enterprise,
              Cursor Business — sourced from companies that overforecast. The discount is real
              and substantial.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              Book a Credex consultation →
            </a>
          </div>
        )}

        {/* Already optimal message */}
        {result.isAlreadyOptimal && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-6">
            <p className="text-emerald-400 font-bold mb-1">✅ You're spending well!</p>
            <p className="text-white/60 text-sm">
              Your AI stack is well-optimised. Want to be notified when new savings
              opportunities apply to your stack?
            </p>
          </div>
        )}

        {/* Lead capture */}
        {!showLeadForm ? (
          <button
            onClick={() => setShowLeadForm(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg py-4 rounded-2xl transition-all mb-4"
          >
            📧 Email me this report
          </button>
        ) : (
          <LeadCaptureForm auditId={id} isHighSavings={result.isHighSavings} />
        )}
      </div>
    </main>
  );
}