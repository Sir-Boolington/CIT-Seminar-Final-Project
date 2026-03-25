import { Link } from 'react-router-dom';

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase text-ts-accent2 mb-1.5 text-center">
      {children}
    </p>
  );
}

function StatCard({ value, label, source, color = 'text-ts-accent2' }) {
  return (
    <div className="bg-ts-surface border border-ts-border rounded-xl p-5 text-center">
      <p className={`text-3xl font-medium ${color} mb-1.5`}>{value}</p>
      <p className="text-[11px] text-ts-text2 leading-relaxed mb-2">{label}</p>
      <p className="text-[9px] text-ts-text3 italic">{source}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative z-10">
      <section className="text-center px-7 pt-12 pb-8">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] text-ts-green border border-green-500/25 bg-green-500/[0.08] mb-4">AI-powered training</span>
        <h1 className="text-3xl font-medium text-ts-text leading-tight mb-3">
          Train against <span className="text-ts-accent2">real</span> cyber threats.<br />No risk. All skill.
        </h1>
        <p className="text-sm text-ts-text3 max-w-[420px] mx-auto mb-6 leading-relaxed">
          Two modes. Three difficulty levels. AI-driven social engineering simulations and scenario-based training — all scored and tracked to your account.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/register" className="px-6 py-2.5 rounded-lg text-sm font-medium bg-ts-accent text-white hover:bg-indigo-500 transition-colors">Start training</Link>
          <a href="#how-it-works" className="px-6 py-2.5 rounded-lg text-sm text-ts-text2 border border-ts-border-h hover:border-ts-accent transition-colors">See how it works</a>
        </div>
      </section>

      <section className="flex justify-center gap-4 px-7 pb-12">
        <div className="flex-1 max-w-[280px] bg-ts-surface border border-ts-border rounded-xl p-5 hover:border-ts-border-h transition-colors">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-ts-accent2 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h3 className="text-sm font-medium text-ts-text mb-1">Mode 1 — Interrogation Room</h3>
          <p className="text-[11px] text-ts-text3 leading-relaxed mb-3">Chat with an AI character. Detect if they're a social engineer or a real customer. Flag suspicious messages and submit your verdict.</p>
          <div className="flex gap-1">
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-ts-green">Beginner</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-ts-amber">Intermediate</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-ts-red">Expert</span>
          </div>
        </div>
        <div className="flex-1 max-w-[280px] bg-ts-surface border border-ts-border rounded-xl p-5 hover:border-ts-border-h transition-colors">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-ts-amber mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          </div>
          <h3 className="text-sm font-medium text-ts-text mb-1">Mode 2 — Threat Gauntlet</h3>
          <p className="text-[11px] text-ts-text3 leading-relaxed mb-3">Face timed scenario cards — phishing emails, fake SMS, spoofed pages, and more. Pick the safest action before time runs out.</p>
          <div className="flex gap-1">
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-ts-green">Beginner</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-ts-amber">Intermediate</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-ts-red">Expert</span>
          </div>
        </div>
      </section>

      <div className="w-10 h-px bg-ts-border-h mx-auto mb-12" />

      <section className="px-7 pb-12 max-w-[620px] mx-auto">
        <SectionLabel>The threat landscape</SectionLabel>
        <h2 className="text-xl font-medium text-ts-text text-center mb-1.5">Cyber attacks aren't slowing down</h2>
        <p className="text-[11px] text-ts-text3 text-center max-w-[440px] mx-auto mb-6 leading-relaxed">Human error remains the #1 attack vector. Training is the most effective defense — but only if it's realistic, measurable, and engaging.</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatCard value="60%" label="of all confirmed data breaches involved the human element" source="Verizon 2025 Data Breach Investigations Report" color="text-ts-red" />
          <StatCard value="$4.44M" label="average global cost of a single data breach" source="IBM Cost of a Data Breach Report 2025" color="text-ts-amber" />
          <StatCard value="$16.6B" label="total cybercrime losses reported to the FBI in 2024 — up 33% from 2023" source="FBI IC3 2024 Annual Report" color="text-ts-accent2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard value="193,407" label="phishing complaints filed in 2024 — the #1 reported cybercrime type" source="FBI IC3 2024 Annual Report" color="text-ts-amber" />
          <StatCard value="44%" label="of all breaches involved ransomware, up from 32% the year prior" source="Verizon 2025 DBIR" color="text-ts-red" />
        </div>
      </section>

      <div className="w-10 h-px bg-ts-border-h mx-auto mb-12" />

      <section id="how-it-works" className="px-7 pb-12 max-w-[560px] mx-auto">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="text-xl font-medium text-ts-text text-center mb-6">Three steps to sharper instincts</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: '1', title: 'Choose your mode', desc: 'Pick Interrogation Room for live AI conversations or Threat Gauntlet for scenario-based challenges. Select your difficulty level — Beginner, Intermediate, or Expert.', color: 'text-ts-accent2', bg: 'bg-indigo-500/[0.08]' },
            { step: '2', title: 'Train against realistic threats', desc: 'Face AI-powered social engineering attempts, phishing emails, suspicious SMS messages, spoofed webpages, and physical baiting scenarios — all modeled after real-world attack patterns.', color: 'text-ts-amber', bg: 'bg-amber-500/[0.08]' },
            { step: '3', title: 'Track your progress', desc: 'Every session is scored and stored. Review your history, see which threat types trip you up, build streaks, and watch your detection accuracy improve over time.', color: 'text-ts-green', bg: 'bg-green-500/[0.08]' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start bg-ts-surface border border-ts-border rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-xs font-semibold ${s.color}`}>{s.step}</span>
              </div>
              <div>
                <h3 className="text-[13px] font-medium text-ts-text mb-1">{s.title}</h3>
                <p className="text-[11px] text-ts-text3 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-10 h-px bg-ts-border-h mx-auto mb-12" />

      <section className="px-7 pb-12 max-w-[620px] mx-auto">
        <SectionLabel>Who it's for</SectionLabel>
        <h2 className="text-xl font-medium text-ts-text text-center mb-6">Built for anyone who wants to stay safe online</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Students', desc: 'Hands-on, measurable cybersecurity training that goes beyond textbooks. Practice spotting real attack patterns and build a trackable skill record.', color: 'text-ts-accent2', bg: 'bg-indigo-500/[0.08]', icon: '🎓' },
            { title: 'Instructors', desc: 'Assign structured security exercises with trackable student performance. Monitor scores, session history, and difficulty progression across your class.', color: 'text-ts-green', bg: 'bg-green-500/[0.08]', icon: '📋' },
            { title: 'Small organizations', desc: 'Run internal security awareness programs without enterprise tool budgets. Real training, not checkbox compliance — at zero cost.', color: 'text-ts-amber', bg: 'bg-amber-500/[0.08]', icon: '🏢' },
            { title: 'Competitive learners', desc: 'Push yourself through Expert difficulty, build streaks, climb the leaderboard, and earn achievement badges as you master each threat category.', color: 'text-ts-red', bg: 'bg-red-500/[0.08]', icon: '🏆' },
          ].map((a) => (
            <div key={a.title} className="bg-ts-surface border border-ts-border rounded-xl p-5">
              <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center text-base mb-3`}>{a.icon}</div>
              <h3 className={`text-[13px] font-medium ${a.color} mb-1`}>{a.title}</h3>
              <p className="text-[10px] text-ts-text3 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center px-7 pb-12">
        <div className="bg-ts-surface border border-ts-border rounded-xl py-8 px-6 max-w-[480px] mx-auto">
          <h2 className="text-lg font-medium text-ts-text mb-1.5">Ready to test your instincts?</h2>
          <p className="text-[11px] text-ts-text3 mb-4 leading-relaxed">Create a free account and start your first training session in under a minute.</p>
          <Link to="/register" className="inline-block px-7 py-2.5 rounded-lg text-sm font-medium bg-ts-accent text-white hover:bg-indigo-500 transition-colors">Create free account</Link>
        </div>
      </section>
    </div>
  );
}
