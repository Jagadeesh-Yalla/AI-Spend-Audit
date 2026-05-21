'use client';
// app/audit/page.tsx
// Spend input form — supports all 8 required AI tools
// Form state persists across page reloads via localStorage

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AuditFormData, ToolInput, UseCase } from '@/lib/auditEngine';
const TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    plans: ['hobby', 'pro', 'business', 'enterprise'],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    plans: ['individual', 'business', 'enterprise'],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    plans: ['free', 'pro', 'max', 'team', 'enterprise', 'api_direct'],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    plans: ['plus', 'team', 'enterprise', 'api_direct'],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API Direct',
    plans: ['api_direct'],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API Direct',
    plans: ['api_direct'],
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    plans: ['free', 'pro', 'ultra', 'api'],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    plans: ['free', 'pro', 'teams'],
  },
];

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: '💻 Coding / Development' },
  { value: 'writing', label: '✍️ Writing / Content' },
  { value: 'data', label: '📊 Data Analysis' },
  { value: 'research', label: '🔬 Research' },
  { value: 'mixed', label: '🔀 Mixed / General' },
];

const STORAGE_KEY = 'ai_audit_form_data';

const defaultToolInput = (id: string): ToolInput => ({
  tool: id,
  plan: TOOLS.find((t) => t.id === id)?.plans[0] ?? '',
  monthlySpend: 0,
  seats: 1,
  useCase: 'mixed',
});

export default function AuditPage() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState<UseCase>('mixed');
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [toolData, setToolData] = useState<Record<string, ToolInput>>(
    Object.fromEntries(TOOLS.map((t) => [t.id, defaultToolInput(t.id)]))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
        if (parsed.activeTools) setActiveTools(parsed.activeTools);
        if (parsed.toolData) setToolData(parsed.toolData);
      } catch {}
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ teamSize, useCase, activeTools, toolData })
    );
  }, [teamSize, useCase, activeTools, toolData]);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const updateToolData = (toolId: string, field: keyof ToolInput, value: string | number) => {
    setToolData((prev) => ({
      ...prev,
      [toolId]: { ...prev[toolId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (activeTools.length === 0) {
      alert('Please select at least one AI tool.');
      return;
    }
    setIsSubmitting(true);

    const formData: AuditFormData = {
      teamSize,
      useCase,
      tools: activeTools.map((id) => ({
        ...toolData[id],
        useCase,
      })),
    };

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/results/${data.id}`);
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <a href="/" className="text-indigo-400 text-sm hover:underline">
            ← Back
          </a>
          <h1 className="text-3xl font-black mt-4 mb-2">Audit your AI spend</h1>
          <p className="text-white/50">
            Select the tools your team pays for and we'll find your savings.
          </p>
        </div>

        {/* Team info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Your team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/50 mb-1 block">Team size</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">Primary use case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc.value} value={uc.value} className="bg-gray-900">
                    {uc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tool selection */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">Select tools you pay for</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  activeTools.includes(tool.id)
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tool details */}
        {activeTools.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="font-bold text-lg">Tool details</h2>
            {activeTools.map((toolId) => {
              const tool = TOOLS.find((t) => t.id === toolId)!;
              const data = toolData[toolId];
              return (
                <div
                  key={toolId}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <h3 className="font-bold mb-4 text-indigo-300">{tool.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-white/40 mb-1 block uppercase tracking-wider">
                        Plan
                      </label>
                      <select
                        value={data.plan}
                        onChange={(e) => updateToolData(toolId, 'plan', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      >
                        {tool.plans.map((plan) => (
                          <option key={plan} value={plan} className="bg-gray-900">
                            {plan.charAt(0).toUpperCase() + plan.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1 block uppercase tracking-wider">
                        Monthly spend ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={data.monthlySpend}
                        onChange={(e) =>
                          updateToolData(toolId, 'monthlySpend', Number(e.target.value))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1 block uppercase tracking-wider">
                        Seats / Users
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={data.seats}
                        onChange={(e) =>
                          updateToolData(toolId, 'seats', Number(e.target.value))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || activeTools.length === 0}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl transition-all"
        >
          {isSubmitting ? 'Analysing your spend...' : 'Get my free audit →'}
        </button>
      </div>
    </main>
  );
}