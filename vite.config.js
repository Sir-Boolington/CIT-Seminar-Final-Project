import { useState } from 'react';

export default function GauntletPage() {
  const [difficulty, setDifficulty] = useState(null);

  if (!difficulty) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-65px)] px-7">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-ts-amber mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-ts-text mb-2">Threat Gauntlet</h1>
          <p className="text-sm text-ts-text3 mb-6 max-w-sm mx-auto">
            Face a timed sequence of cybersecurity scenario cards. Identify the threat and
            pick the safest course of action. Choose your difficulty to begin.
          </p>

          <div className="flex gap-3 justify-center mb-6">
            {[
              { level: 1, name: 'Beginner', desc: 'No time limit, full hints', color: 'border-green-500/30 hover:border-green-500/60 text-ts-green' },
              { level: 2, name: 'Intermediate', desc: '90s per card, 1 hint', color: 'border-amber-500/30 hover:border-amber-500/60 text-ts-amber' },
              { level: 3, name: 'Expert', desc: '45s per card, no hints', color: 'border-red-500/30 hover:border-red-500/60 text-ts-red' },
            ].map((d) => (
              <button
                key={d.level}
                onClick={() => setDifficulty(d.level)}
                className={`flex-1 max-w-[140px] bg-ts-surface border rounded-lg p-4 transition-colors ${d.color}`}
              >
                <p className="text-sm font-medium mb-1">{d.name}</p>
                <p className="text-[10px] text-ts-text3">{d.desc}</p>
              </button>
            ))}
          </div>

          {/* Scenario types preview */}
          <div className="flex justify-center gap-2 flex-wrap">
            {['Email', 'SMS', 'Webpage', 'Baiting'].map((type) => (
              <span
                key={type}
                className="text-[10px] px-2.5 py-1 rounded-full bg-ts-surface border border-ts-border text-ts-text3"
              >
                {type}
              </span>
            ))}
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-ts-surface border border-ts-border text-ts-text3 opacity-50">
              Social (stretch)
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-ts-surface border border-ts-border text-ts-text3 opacity-50">
              Vishing (stretch)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Scenario card placeholder
  return (
    <div className="relative z-10 max-w-2xl mx-auto px-7 py-7">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-ts-text3">Scenario 1 of 5</span>
        <span className="text-[11px] text-ts-text3">
          Difficulty: {difficulty === 1 ? 'Beginner' : difficulty === 2 ? 'Intermediate' : 'Expert'}
        </span>
      </div>
      <div className="w-full h-1 bg-ts-surface rounded-full mb-6">
        <div className="w-[20%] h-full bg-ts-accent rounded-full" />
      </div>

      {/* Sample email scenario card */}
      <div className="bg-ts-surface border border-ts-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-ts-red font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            Email scenario
          </span>
          {difficulty >= 2 && (
            <span className="text-[10px] text-ts-amber font-mono">⏱ 90s</span>
          )}
        </div>

        <h3 className="text-base font-medium text-ts-text mb-3">
          Urgent: Verify your account credentials
        </h3>

        {/* Fake email preview */}
        <div className="bg-ts-bg border border-ts-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-ts-border">
            <div>
              <p className="text-xs text-ts-text">From: IT Support &lt;support@company-helpdesk.net&gt;</p>
              <p className="text-[10px] text-ts-text3">To: you@company.com</p>
            </div>
            <span className="text-[9px] text-ts-text3">Today 9:42 AM</span>
          </div>
          <p className="text-xs text-ts-text2 leading-relaxed">
            Dear Employee,<br /><br />
            We've detected unusual activity on your account following a recent security incident.
            Please verify your credentials immediately by clicking the link below to prevent
            account suspension.<br /><br />
            <span className="text-ts-accent2 underline">https://company-helpdesk.net/verify-account</span><br /><br />
            This is urgent — failure to verify within 24 hours will result in temporary account lockout.<br /><br />
            Best regards,<br />
            IT Security Team
          </p>
        </div>

        <p className="text-xs text-ts-text3 mb-4">What is the best course of action?</p>

        {/* Answer options */}
        <div className="flex flex-col gap-2">
          {[
            'A) Click the link and verify your credentials',
            'B) Forward the email to your real IT department',
            'C) Reply asking for more details',
            'D) Delete the email and ignore it',
          ].map((opt) => (
            <button
              key={opt}
              disabled
              className="text-left px-4 py-3 bg-ts-bg border border-ts-border rounded-lg text-xs text-ts-text2 hover:border-ts-border-h transition-colors disabled:opacity-60"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-ts-text3 italic">
        Scenario engine coming soon — scenario data + scoring pipeline in progress
      </p>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setDifficulty(null)}
          className="text-[11px] text-ts-text3 border border-ts-border rounded-md px-4 py-2 hover:border-ts-border-h transition-colors"
        >
          Quit session
        </button>
        <button
          disabled
          className="text-[11px] text-white bg-ts-accent rounded-md px-4 py-2 opacity-50"
        >
          Submit answer
        </button>
      </div>
    </div>
  );
}
