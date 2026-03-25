import { useState } from 'react';

export default function InterrogationPage() {
  const [difficulty, setDifficulty] = useState(null);

  if (!difficulty) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-65px)] px-7">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-ts-accent2 mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h1 className="text-xl font-medium text-ts-text mb-2">Interrogation Room</h1>
          <p className="text-sm text-ts-text3 mb-6 max-w-sm mx-auto">
            You'll chat with an AI character. Your job: figure out if they're a social engineer or a genuine customer. Choose your difficulty to begin.
          </p>
          <div className="flex gap-3 justify-center">
            {[
              { level: 'easy', name: 'Beginner', desc: 'Obvious red flags, 3 hints', color: 'border-green-500/30 hover:border-green-500/60 text-ts-green' },
              { level: 'medium', name: 'Intermediate', desc: 'Subtle red flags, 1 hint', color: 'border-amber-500/30 hover:border-amber-500/60 text-ts-amber' },
              { level: 'hard', name: 'Expert', desc: 'Near-invisible, no hints', color: 'border-red-500/30 hover:border-red-500/60 text-ts-red' },
            ].map((d) => (
              <button key={d.level} onClick={() => setDifficulty(d.level)} className={`flex-1 max-w-[140px] bg-ts-surface border rounded-lg p-4 transition-colors ${d.color}`}>
                <p className="text-sm font-medium mb-1">{d.name}</p>
                <p className="text-[10px] text-ts-text3">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col h-[calc(100vh-65px)] max-w-2xl mx-auto">
      <div className="flex items-center justify-between px-5 py-3 border-b border-ts-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-xs text-ts-accent2 font-medium">?</div>
          <div>
            <p className="text-sm font-medium text-ts-text">Unknown contact</p>
            <p className="text-[10px] text-ts-text3">Difficulty: {difficulty === 'easy' ? 'Beginner' : difficulty === 'medium' ? 'Intermediate' : 'Expert'}</p>
          </div>
        </div>
        <button onClick={() => setDifficulty(null)} className="text-[11px] text-ts-text3 hover:text-ts-text border border-ts-border rounded-md px-3 py-1">End session</button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex justify-center mb-6">
          <span className="text-[10px] text-ts-text3 bg-ts-surface border border-ts-border rounded-full px-3 py-1">Session started — is this person genuine or a threat?</span>
        </div>
        <div className="flex gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-indigo-500/15 flex items-center justify-center text-[10px] text-ts-accent2 font-medium flex-shrink-0 mt-0.5">?</div>
          <div className="bg-ts-surface border border-ts-border rounded-lg rounded-tl-none px-3.5 py-2.5 max-w-[75%]">
            <p className="text-xs text-ts-text2 leading-relaxed">Hi there! I'm reaching out from your IT department. We've noticed some unusual activity on your account and need to verify your credentials. Could you help me out?</p>
            <p className="text-[9px] text-ts-text3 mt-1.5">2:34 PM</p>
          </div>
        </div>
        <p className="text-center text-[11px] text-ts-text3 italic mt-8">Chat functionality coming soon — Claude API integration in progress</p>
      </div>
      <div className="border-t border-ts-border px-5 py-3">
        <div className="flex gap-2">
          <input type="text" placeholder="Type your response..." disabled className="flex-1 px-3.5 py-2.5 bg-ts-surface border border-ts-border rounded-lg text-xs text-ts-text placeholder:text-ts-text3 disabled:opacity-50" />
          <button disabled className="px-4 py-2.5 bg-ts-accent text-white rounded-lg text-xs font-medium disabled:opacity-50">Send</button>
        </div>
        <div className="flex gap-2 mt-2">
          <button disabled className="text-[10px] text-ts-text3 border border-ts-border rounded-md px-2.5 py-1 opacity-50">Flag message</button>
          <button disabled className="text-[10px] text-ts-text3 border border-ts-border rounded-md px-2.5 py-1 opacity-50">Submit verdict</button>
          <button disabled className="text-[10px] text-ts-amber border border-amber-500/20 rounded-md px-2.5 py-1 opacity-50">Use hint</button>
        </div>
      </div>
    </div>
  );
}
