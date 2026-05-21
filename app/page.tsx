// app/page.tsx
// Landing page — cold visitor lands here from tweet/HN/blog

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Free AI spend audit — no login required
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
          You're probably{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
            overpaying
          </span>{' '}
          for AI tools.
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
          Most startups pay retail for AI tools they barely use, or buy Enterprise when
          Pro would do. Get your free audit in 2 minutes — no signup, no spam.
        </p>

        {/* CTA */}
        <Link
          href="/audit"
          className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]"
        >
          Audit my AI spend →
        </Link>

        <p className="text-white/30 text-sm mt-4">
          Takes 2 minutes · No email required to see results
        </p>
      </section>

      {/* Stats Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { value: '$340', label: 'Average monthly savings found', sub: 'per audit' },
          { value: '8', label: 'AI tools audited', sub: 'Cursor, Claude, ChatGPT & more' },
          { value: '2 min', label: 'Time to complete', sub: 'instant results' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
          >
            <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
            <p className="text-white/60 text-sm font-medium">{stat.label}</p>
            <p className="text-white/30 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-white/80">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Enter your tools',
              desc: 'Tell us which AI tools you pay for, which plan, and how many seats.',
            },
            {
              step: '02',
              title: 'Get your audit',
              desc: 'Our engine checks every tool against current pricing and usage benchmarks.',
            },
            {
              step: '03',
              title: 'See your savings',
              desc: 'Get a per-tool breakdown and total monthly + annual savings potential.',
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-5xl font-black text-white/10 mb-4">{item.step}</p>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools supported */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-white/40 text-sm uppercase tracking-widest mb-6 font-bold">
          Tools we audit
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'].map(
            (tool) => (
              <span
                key={tool}
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60"
              >
                {tool}
              </span>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-8 text-center text-white/30 text-sm">
        <p>
          Built by{' '}
          <a href="https://github.com/Jagadeesh-Yalla" className="text-indigo-400 hover:underline">
            Jagadeesh Yalla
          </a>{' '}
          · Powered by{' '}
          <a href="https://credex.rocks" className="text-indigo-400 hover:underline">
            Credex
          </a>
        </p>
      </footer>
    </main>
  );
}
