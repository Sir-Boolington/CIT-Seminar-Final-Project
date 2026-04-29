import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

// ————————————————————————————————————————————
// SCENARIO RENDERERS
// ————————————————————————————————————————————

function EmailRenderer({ content }) {
  return (
    <div className="bg-ts-bg border border-ts-border rounded-lg overflow-hidden">
      {/* Email header */}
      <div className="px-4 py-3 border-b border-ts-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center text-xs text-ts-red font-medium">
              {content.from.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-medium text-ts-text">{content.from.name}</p>
              <p className="text-[10px] text-ts-text3">&lt;{content.from.address}&gt;</p>
            </div>
          </div>
          <span className="text-[9px] text-ts-text3">
            {new Date(content.timestamp).toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-ts-text3">To: {content.to.name} &lt;{content.to.address}&gt;</p>
        {content.cc && content.cc.length > 0 && (
          <p className="text-[10px] text-ts-text3">
            Cc: {content.cc.map(c => `${c.name} <${c.address}>`).join(', ')}
          </p>
        )}
      </div>
      {/* Subject */}
      <div className="px-4 py-2 border-b border-ts-border">
        <p className="text-sm font-medium text-ts-text">{content.subject}</p>
      </div>
      {/* Body */}
      <div className="px-4 py-4">
        <p className="text-xs text-ts-text2 leading-relaxed whitespace-pre-line">{content.body}</p>
      </div>
      {/* Attachments */}
      {content.attachments && content.attachments.length > 0 && (
        <div className="px-4 py-3 border-t border-ts-border">
          <p className="text-[10px] text-ts-text3 mb-2">Attachments:</p>
          <div className="flex gap-2 flex-wrap">
            {content.attachments.map((att, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-ts-surface2 border border-ts-border rounded-md">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ts-text3">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
                <span className="text-[10px] text-ts-text2">{att.filename}</span>
                <span className="text-[9px] text-ts-text3">({att.size_display})</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Reply chain */}
      {content.reply_chain && content.reply_chain.length > 0 && (
        <div className="border-t border-ts-border">
          {content.reply_chain.map((reply, i) => (
            <div key={i} className="px-4 py-3 border-t border-ts-border bg-ts-surface/50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-ts-text3">
                  From: {reply.from.name} &lt;{reply.from.address}&gt;
                </p>
                <span className="text-[9px] text-ts-text3">
                  {new Date(reply.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-ts-text3 leading-relaxed whitespace-pre-line">{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmsRenderer({ content }) {
  return (
    <div className="bg-ts-bg border border-ts-border rounded-lg overflow-hidden">
      {/* Phone header */}
      <div className="px-4 py-3 border-b border-ts-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-ts-surface2 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ts-text3">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium text-ts-text">
            {content.sender_name !== 'Unknown' ? content.sender_name : content.sender_number}
          </p>
          {content.sender_name !== 'Unknown' && (
            <p className="text-[10px] text-ts-text3">{content.sender_number}</p>
          )}
        </div>
      </div>
      {/* Messages */}
      <div className="px-4 py-4 flex flex-col gap-2">
        {content.messages.map((msg, i) => (
          <div key={i} className="flex flex-col items-start max-w-[80%]">
            <div className="bg-ts-surface2 border border-ts-border rounded-2xl rounded-bl-md px-3.5 py-2">
              <p className="text-xs text-ts-text2 leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[9px] text-ts-text3 mt-1 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebpageRenderer({ content }) {
  return (
    <div className="bg-ts-bg border border-ts-border rounded-lg overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-ts-surface2 px-3 py-2 border-b border-ts-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-ts-red/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-ts-amber/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-ts-green/60" />
          </div>
          <div className="text-[10px] text-ts-text3 ml-2">{content.page_title}</div>
        </div>
        {/* Address bar */}
        <div className="flex items-center gap-2 bg-ts-bg rounded-md px-3 py-1.5">
          {content.ssl_status === 'valid' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ts-green flex-shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ts-red flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <span className="text-[10px] text-ts-text3 font-mono truncate">{content.url}</span>
        </div>
      </div>
      {/* Page content */}
      <div className="px-6 py-6">
        {content.page_elements.logo_description && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-ts-surface2 flex items-center justify-center">
              <span className="text-[9px] text-ts-text3">Logo</span>
            </div>
            <span className="text-[9px] text-ts-text3 italic">{content.page_elements.logo_description}</span>
          </div>
        )}
        <h3 className="text-base font-medium text-ts-text mb-2">{content.page_elements.heading}</h3>
        <p className="text-xs text-ts-text2 leading-relaxed mb-4">{content.page_elements.body_text}</p>
        {/* Form fields */}
        {content.page_elements.form_fields && (
          <div className="flex flex-col gap-3 mb-4">
            {content.page_elements.form_fields.map((field, i) => (
              <div key={i}>
                <label className="block text-[10px] text-ts-text3 mb-1">{field.label}</label>
                <input
                  type="text"
                  disabled
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 bg-ts-surface border border-ts-border rounded-md text-xs text-ts-text3 placeholder:text-ts-text3/50 disabled:opacity-70"
                />
              </div>
            ))}
          </div>
        )}
        {content.page_elements.submit_button_text && (
          <button disabled className="w-full py-2 bg-blue-600/80 text-white rounded-md text-xs font-medium opacity-80 mb-4">
            {content.page_elements.submit_button_text}
          </button>
        )}
        {/* Trust badges */}
        {content.page_elements.trust_badges && content.page_elements.trust_badges.length > 0 && (
          <div className="flex gap-2 justify-center mb-3">
            {content.page_elements.trust_badges.map((badge, i) => (
              <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-ts-green border border-green-500/20">
                {badge}
              </span>
            ))}
          </div>
        )}
        {content.page_elements.footer_text && (
          <p className="text-[9px] text-ts-text3 text-center">{content.page_elements.footer_text}</p>
        )}
      </div>
    </div>
  );
}

function BaitingRenderer({ content }) {
  return (
    <div className="bg-ts-bg border border-ts-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-ts-border flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-ts-amber font-medium">
            {content.item_type}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-ts-surface2 text-ts-text3 border border-ts-border">
            {content.location}
          </span>
        </div>
      </div>
      <div className="px-4 py-4">
        <p className="text-xs text-ts-text2 leading-relaxed">{content.situation}</p>
      </div>
    </div>
  );
}

function TextRenderer({ content }) {
  const settingIcons = {
    workplace: '🏢',
    personal: '🏠',
    public: '🌐',
    online: '💻',
    phone: '📱'
  };

  return (
    <div className="bg-ts-bg border border-ts-border rounded-lg overflow-hidden">
      {content.setting && (
        <div className="px-4 py-2.5 border-b border-ts-border">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-ts-surface2 text-ts-text3 border border-ts-border">
            {settingIcons[content.setting] || '📋'} {content.setting.charAt(0).toUpperCase() + content.setting.slice(1)}
          </span>
        </div>
      )}
      <div className="px-4 py-4">
        <p className="text-xs text-ts-text2 leading-relaxed">{content.situation}</p>
      </div>
    </div>
  );
}

// ————————————————————————————————————————————
// SCENARIO TYPE BADGES
// ————————————————————————————————————————————

const TYPE_CONFIG = {
  email: { label: 'Email', color: 'bg-red-500/10 text-ts-red', icon: '✉️' },
  sms: { label: 'SMS', color: 'bg-green-500/10 text-ts-green', icon: '💬' },
  webpage: { label: 'Webpage', color: 'bg-blue-500/10 text-blue-400', icon: '🌐' },
  baiting: { label: 'Baiting', color: 'bg-amber-500/10 text-ts-amber', icon: '🪝' },
  text: { label: 'Scenario', color: 'bg-indigo-500/10 text-ts-accent2', icon: '📋' }
};

// ————————————————————————————————————————————
// MAIN GAUNTLET PAGE COMPONENT
// ————————————————————————————————————————————

export default function GauntletPage() {
  const token = localStorage.getItem('token');

  // Session state
  const [difficulty, setDifficulty] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState(null);

  // Answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHints, setCurrentHints] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  // Session state
  const [sessionComplete, setSessionComplete] = useState(false);
  const [debrief, setDebrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Adaptive difficulty — tracks consecutive correct answers to suggest next difficulty
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [difficultyStreakSuggestion, setDifficultyStreakSuggestion] = useState(() => {
    const saved = sessionStorage.getItem('threatsim_streak_suggestion');
    return saved ? JSON.parse(saved) : null;
  });

  // Ref to track sessionId for beforeunload (state is stale in event listeners)
  const sessionIdRef = useRef(null);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // ——— Auto-save draft answer to sessionStorage ———
  useEffect(() => {
    if (userAnswer) {
      sessionStorage.setItem('threatsim_draft_answer', userAnswer);
    } else {
      sessionStorage.removeItem('threatsim_draft_answer');
    }
  }, [userAnswer]);

  // Restore draft on mount (in case of accidental refresh)
  useEffect(() => {
    const draft = sessionStorage.getItem('threatsim_draft_answer');
    if (draft) setUserAnswer(draft);
  }, [currentIndex]);

  // ——— Timer logic ———
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  // Reset timer when moving to a new scenario
  useEffect(() => {
    if (settings?.time_limit && scenarios.length > 0 && !evaluation) {
      setTimeLeft(settings.time_limit);
      setStartTime(Date.now());
    }
  }, [currentIndex, scenarios.length]);

  // ——— End session if tab closes or navigates away ———
  useEffect(() => {
    const handleUnload = () => {
      if (sessionIdRef.current) {
        const data = JSON.stringify({ session_id: sessionIdRef.current });
        navigator.sendBeacon(
          `${API_URL}/api/gauntlet/end-beacon`,
          new Blob([data], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // ——— Start session ———
  const startSession = async (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/gauntlet/start`,
        { difficulty: selectedDifficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(res.data.session_id);
      setScenarios(res.data.scenarios);
      setSettings(res.data.settings);
      setCurrentIndex(0);
      setStartTime(Date.now());
      if (res.data.settings.time_limit) {
        setTimeLeft(res.data.settings.time_limit);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start session.');
      setDifficulty(null);
    } finally {
      setLoading(false);
    }
  };

  // ——— Request hint ———
  const requestHint = async () => {
    try {
      const scenario = scenarios[currentIndex];
      const res = await axios.post(`${API_URL}/api/gauntlet/hint`,
        { session_id: sessionId, scenario_id: scenario.scenario_id, hints_used_so_far: hintsUsed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.hint_available) {
        setCurrentHints(prev => [...prev, res.data.hint]);
        setHintsUsed(res.data.hints_used);
      }
    } catch (err) {
      console.error('Hint error:', err);
    }
  };

  // ——— Submit answer ———
  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : null;
    const scenario = scenarios[currentIndex];

    try {
      const res = await axios.post(`${API_URL}/api/gauntlet/submit`,
        {
          session_id: sessionId,
          scenario_id: scenario.scenario_id,
          user_answer: userAnswer,
          hints_used: hintsUsed,
          time_taken_sec: timeTaken
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvaluation(res.data);

      // Adaptive difficulty — track streak and set suggestion for next difficulty
      if (res.data.result === 'correct') {
        const newStreak = consecutiveCorrect + 1;
        setConsecutiveCorrect(newStreak);

        if (newStreak >= 3) {
          let suggestion = null;
          if (difficulty === 'easy') suggestion = { from: 'easy', to: 'medium' };
          if (difficulty === 'medium') suggestion = { from: 'medium', to: 'hard' };
          if (suggestion) {
            setDifficultyStreakSuggestion(suggestion);
            sessionStorage.setItem('threatsim_streak_suggestion', JSON.stringify(suggestion));
          }
        }
      } else {
        setConsecutiveCorrect(0);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  // ——— Next scenario ———
  const nextScenario = () => {
    if (currentIndex + 1 >= scenarios.length) {
      endSession();
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setUserAnswer('');
    sessionStorage.removeItem('threatsim_draft_answer');
    setHintsUsed(0);
    setCurrentHints([]);
    setEvaluation(null);
    setDifficultyUnlockBanner(null);
    setStartTime(Date.now());
    if (settings?.time_limit) {
      setTimeLeft(settings.time_limit);
    }
  };

  // ——— End session ———
  const endSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/gauntlet/end`,
        { session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDebrief(res.data);
      setSessionComplete(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to end session.');
    } finally {
      setLoading(false);
    }
  };

  // ——— Reset everything (also ends session on backend) ———
  const resetSession = async () => {
    if (sessionId) {
      try {
        await axios.post(`${API_URL}/api/gauntlet/end`,
          { session_id: sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to end session:', err);
      }
    }
    setDifficulty(null);
    setSessionId(null);
    setScenarios([]);
    setCurrentIndex(0);
    setSettings(null);
    setUserAnswer('');
    sessionStorage.removeItem('threatsim_draft_answer');
    setHintsUsed(0);
    setCurrentHints([]);
    setSubmitting(false);
    setEvaluation(null);
    setTimeLeft(null);
    setStartTime(null);
    setSessionComplete(false);
    setDebrief(null);
    setLoading(false);
    setError('');
    setConsecutiveCorrect(0);
    setDifficultyStreakSuggestion(null);
    sessionStorage.removeItem('threatsim_streak_suggestion');
  };

  // ——— Render scenario by type ———
  const renderScenario = (scenario) => {
    const content = scenario.scenario_content;
    switch (scenario.type) {
      case 'email': return <EmailRenderer content={content} />;
      case 'sms': return <SmsRenderer content={content} />;
      case 'webpage': return <WebpageRenderer content={content} />;
      case 'baiting': return <BaitingRenderer content={content} />;
      case 'text': return <TextRenderer content={content} />;
      default: return <TextRenderer content={content} />;
    }
  };

  // ————————————————————————————————————————
  // DIFFICULTY SELECTION SCREEN
  // ————————————————————————————————————————
  if (!difficulty) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-65px)] px-7">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-ts-amber mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          </div>
          <h1 className="text-xl font-medium text-ts-text mb-2">Threat Gauntlet</h1>
          <p className="text-sm text-ts-text3 mb-6 max-w-sm mx-auto">
            Face a series of cybersecurity scenarios. Analyze each threat and explain what you would do and why. Your responses are evaluated by AI.
          </p>
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-ts-red">{error}</div>
          )}
          {/* Streak suggestion banner */}
          {difficultyStreakSuggestion && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-lg max-w-sm mx-auto w-full">
              <span className="text-base">🔥</span>
              <div className="text-left">
                <p className="text-[11px] font-medium text-ts-amber">
                  You're on a streak — nice work!
                </p>
                <p className="text-[10px] text-ts-text3">
                  3 correct in a row on {difficultyStreakSuggestion.from === 'easy' ? 'Beginner' : 'Intermediate'}. Ready to try{' '}
                  <button
                    onClick={() => startSession(difficultyStreakSuggestion.to)}
                    className="text-ts-amber underline underline-offset-2 hover:text-amber-300 transition-colors"
                  >
                    {difficultyStreakSuggestion.to === 'medium' ? 'Intermediate' : 'Expert'}?
                  </button>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center mb-6">
            {[
              { level: 'easy', name: 'Beginner', desc: 'No time limit, 3 hints', color: 'border-green-500/30 hover:border-green-500/60 text-ts-green' },
              { level: 'medium', name: 'Intermediate', desc: '140s per card, 1 hint', color: 'border-amber-500/30 hover:border-amber-500/60 text-ts-amber' },
              { level: 'hard', name: 'Expert', desc: '90s per card, no hints', color: 'border-red-500/30 hover:border-red-500/60 text-ts-red' },
            ].map((d) => (
              <button
                key={d.level}
                onClick={() => startSession(d.level)}
                disabled={loading}
                className={`flex-1 max-w-[140px] bg-ts-surface border rounded-lg p-4 transition-colors ${d.color} disabled:opacity-50`}
              >
                <p className="text-sm font-medium mb-1">{d.name}</p>
                <p className="text-[10px] text-ts-text3">{d.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {['Email', 'SMS', 'Webpage', 'Baiting', 'Text'].map((type) => (
              <span key={type} className="text-[10px] px-2.5 py-1 rounded-full bg-ts-surface border border-ts-border text-ts-text3">{type}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ————————————————————————————————————————
  // SESSION DEBRIEF SCREEN
  // ————————————————————————————————————————
  if (sessionComplete && debrief) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-7 py-7">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ts-accent/10 flex items-center justify-center text-ts-accent2 mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-ts-text mb-1">Session Complete</h1>
          <p className="text-xs text-ts-text3">
            {debrief.session.difficulty === 'easy' ? 'Beginner' : debrief.session.difficulty === 'medium' ? 'Intermediate' : 'Expert'} difficulty
          </p>
        </div>

        {/* Score summary cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-ts-surface border border-ts-border rounded-lg p-3 text-center">
            <p className="text-[10px] text-ts-text3 mb-1">Final Score</p>
            <p className="text-2xl font-medium text-ts-accent2">{debrief.session.final_score}</p>
          </div>
          <div className="bg-ts-surface border border-ts-border rounded-lg p-3 text-center">
            <p className="text-[10px] text-ts-text3 mb-1">Correct</p>
            <p className="text-2xl font-medium text-ts-green">{debrief.summary.correct}</p>
          </div>
          <div className="bg-ts-surface border border-ts-border rounded-lg p-3 text-center">
            <p className="text-[10px] text-ts-text3 mb-1">Partial</p>
            <p className="text-2xl font-medium text-ts-amber">{debrief.summary.partial}</p>
          </div>
          <div className="bg-ts-surface border border-ts-border rounded-lg p-3 text-center">
            <p className="text-[10px] text-ts-text3 mb-1">Incorrect</p>
            <p className="text-2xl font-medium text-ts-red">{debrief.summary.incorrect}</p>
          </div>
        </div>

        {/* Individual attempt breakdowns */}
        <h2 className="text-sm font-medium text-ts-text mb-3">Scenario Breakdown</h2>
        <div className="flex flex-col gap-3 mb-6">
          {debrief.attempts.map((attempt, i) => {
            const typeInfo = TYPE_CONFIG[attempt.type] || TYPE_CONFIG.text;
            const resultColor = attempt.result === 'correct' ? 'text-ts-green' : attempt.result === 'partial' ? 'text-ts-amber' : 'text-ts-red';
            const resultBg = attempt.result === 'correct' ? 'bg-green-500/10' : attempt.result === 'partial' ? 'bg-amber-500/10' : 'bg-red-500/10';

            return (
              <div key={i} className="bg-ts-surface border border-ts-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                    <span className="text-xs font-medium text-ts-text">{attempt.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${resultBg} ${resultColor}`}>
                      {attempt.result.charAt(0).toUpperCase() + attempt.result.slice(1)}
                    </span>
                    <span className="text-sm font-medium text-ts-text">{attempt.score_awarded}pts</span>
                  </div>
                </div>

                {/* User answer */}
                <div className="mb-3">
                  <p className="text-[10px] text-ts-text3 mb-1">Your answer:</p>
                  <p className="text-[11px] text-ts-text2 bg-ts-bg rounded-md px-3 py-2 leading-relaxed">{attempt.user_answer}</p>
                </div>

                {/* AI feedback */}
                {attempt.feedback && (
                  <>
                    <div className="mb-3">
                      <p className="text-[10px] text-ts-text3 mb-1">AI Feedback:</p>
                      <p className="text-[11px] text-ts-text2 leading-relaxed">{attempt.feedback.feedback}</p>
                    </div>

                    {/* Red flags */}
                    {attempt.feedback.red_flags_caught && attempt.feedback.red_flags_caught.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] text-ts-green mb-1">Red flags you caught:</p>
                        <div className="flex flex-col gap-1">
                          {attempt.feedback.red_flags_caught.map((flag, j) => (
                            <p key={j} className="text-[10px] text-ts-text3 flex items-start gap-1.5">
                              <span className="text-ts-green mt-0.5">✓</span> {flag}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {attempt.feedback.red_flags_missed && attempt.feedback.red_flags_missed.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] text-ts-red mb-1">Red flags you missed:</p>
                        <div className="flex flex-col gap-1">
                          {attempt.feedback.red_flags_missed.map((flag, j) => (
                            <p key={j} className="text-[10px] text-ts-text3 flex items-start gap-1.5">
                              <span className="text-ts-red mt-0.5">✗</span> {flag}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Best-practice answer in debrief */}
                    {attempt.feedback.best_answer && (
                      <div className="mb-3">
                        <p className="text-[10px] text-ts-accent2 font-medium mb-1">✦ Best-practice answer:</p>
                        <p className="text-[10px] text-ts-text2 leading-relaxed bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-3 py-2">
                          {attempt.feedback.best_answer}
                        </p>
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex gap-3 mt-2 pt-2 border-t border-ts-border">
                      {attempt.hints_used > 0 && (
                        <span className="text-[9px] text-ts-amber">Hints used: {attempt.hints_used}</span>
                      )}
                      {attempt.time_taken_sec && (
                        <span className="text-[9px] text-ts-text3">Time: {attempt.time_taken_sec}s</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetSession}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-ts-accent text-white hover:bg-indigo-500 transition-colors"
          >
            Start new session
          </button>
        </div>
      </div>
    );
  }

  // ————————————————————————————————————————
  // ACTIVE SCENARIO SCREEN
  // ————————————————————————————————————————
  const scenario = scenarios[currentIndex];
  if (!scenario) return null;

  const typeInfo = TYPE_CONFIG[scenario.type] || TYPE_CONFIG.text;
  const progress = ((currentIndex + (evaluation ? 1 : 0)) / scenarios.length) * 100;
  const difficultyLabel = difficulty === 'easy' ? 'Beginner' : difficulty === 'medium' ? 'Intermediate' : 'Expert';
  const hintsRemaining = settings ? settings.hints_allowed - hintsUsed : 0;

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-7 py-7">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-ts-text3">
          Scenario {currentIndex + 1} of {scenarios.length}
        </span>
        <div className="flex items-center gap-3">
          {timeLeft !== null && (
            <span className={`text-[11px] font-mono font-medium ${timeLeft <= 10 ? 'text-ts-red' : 'text-ts-text3'}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          )}
          <span className="text-[11px] text-ts-text3">
            Difficulty: {difficultyLabel}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-ts-surface rounded-full mb-6">
        <div
          className="h-full bg-ts-accent rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-ts-red">{error}</div>
      )}

      {/* Scenario card */}
      <div className="bg-ts-surface border border-ts-border rounded-xl p-6 mb-4">
        {/* Type badge and title */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-medium ${typeInfo.color}`}>
            {typeInfo.icon} {typeInfo.label}
          </span>
          {scenario.difficulty !== difficulty && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ts-surface2 text-ts-text3 border border-ts-border">
              {scenario.difficulty}
            </span>
          )}
        </div>

        <h3 className="text-base font-medium text-ts-text mb-4">{scenario.title}</h3>

        {/* Rendered scenario content */}
        {renderScenario(scenario)}

        {/* Prompt */}
        <p className="text-xs text-ts-text3 mt-4 italic">
          {scenario.type === 'email' && 'You received this email. What would you do, and what red flags did you notice?'}
          {scenario.type === 'sms' && 'You received these text messages. What would you do, and what red flags did you notice?'}
          {scenario.type === 'webpage' && 'You were directed to this webpage. What would you do, and what red flags did you notice?'}
          {scenario.type === 'baiting' && 'You encounter this situation. What would you do, and what red flags did you notice?'}
          {scenario.type === 'text' && 'You find yourself in this situation. What would you do, and what red flags did you notice?'}
        </p>
      </div>

      {/* Hints display */}
      {currentHints.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {currentHints.map((hint, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/15 rounded-lg">
              <span className="text-ts-amber text-xs mt-0.5">💡</span>
              <p className="text-[11px] text-ts-amber/90 leading-relaxed">{hint.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Answer / Evaluation area */}
      {!evaluation ? (
        <>
          {/* Text input */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-[11px] text-ts-text2 font-medium">Your response</label>
              <div className="relative group">
                <div className="w-3.5 h-3.5 rounded-full border border-ts-border flex items-center justify-center text-[9px] text-ts-text3 cursor-default">?</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-ts-surface border border-ts-border rounded-lg p-3 text-[10px] text-ts-text3 leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
                  <p className="text-ts-text2 font-medium mb-1.5">What the AI is looking for:</p>
                  <p className="mb-1">① The safest action to take in this situation</p>
                  <p className="mb-1">② Specific red flags you spotted (e.g. spoofed domain, urgency, unusual request)</p>
                  <p>③ A brief reason why those details are suspicious</p>
                  <p className="mt-2 text-ts-text3/70 italic">Vague answers like "it looks phishy" won't score well — be specific.</p>
                </div>
              </div>
            </div>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Describe the safest action you'd take and identify any red flags — e.g. 'I would not click the link because the sender domain is misspelled and the request is unusually urgent.'"
              disabled={submitting || timeLeft === 0}
              rows={4}
              className="w-full px-4 py-3 bg-ts-surface border border-ts-border rounded-lg text-xs text-ts-text placeholder:text-ts-text3 focus:outline-none focus:border-ts-accent transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={resetSession}
                className="text-[11px] text-ts-text3 border border-ts-border rounded-md px-4 py-2 hover:border-ts-border-h transition-colors"
              >
                Quit session
              </button>
              {settings && settings.hints_allowed > 0 && hintsRemaining > 0 && (
                <button
                  onClick={requestHint}
                  className="text-[11px] text-ts-amber border border-amber-500/20 rounded-md px-4 py-2 hover:border-amber-500/40 transition-colors"
                >
                  Use hint ({hintsRemaining} left)
                </button>
              )}
            </div>
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || submitting || timeLeft === 0}
              className="text-[11px] text-white bg-ts-accent rounded-md px-6 py-2 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Evaluating...' : 'Submit answer'}
            </button>
          </div>

          {/* Time's up message */}
          {timeLeft === 0 && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-ts-red text-center">
              Time's up! This scenario will be marked as unanswered.
              <button onClick={nextScenario} className="ml-2 underline hover:no-underline">
                Continue
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Evaluation results */}
          <div className="bg-ts-surface border border-ts-border rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-ts-text">Evaluation</h3>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                  evaluation.result === 'correct' ? 'bg-green-500/10 text-ts-green' :
                  evaluation.result === 'partial' ? 'bg-amber-500/10 text-ts-amber' :
                  'bg-red-500/10 text-ts-red'
                }`}>
                  {evaluation.result.charAt(0).toUpperCase() + evaluation.result.slice(1)}
                </span>
                <span className="text-lg font-medium text-ts-text">{evaluation.adjusted_score}pts</span>
                {evaluation.multiplier > 1 && (
                  <span className="text-[9px] text-ts-text3">({evaluation.raw_score} × {evaluation.multiplier}x)</span>
                )}
              </div>
            </div>

            {/* Feedback */}
            <p className="text-xs text-ts-text2 leading-relaxed mb-4">{evaluation.feedback}</p>

            {/* Red flags caught */}
            {evaluation.red_flags_caught && evaluation.red_flags_caught.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-ts-green font-medium mb-1.5">Red flags you identified:</p>
                <div className="flex flex-col gap-1">
                  {evaluation.red_flags_caught.map((flag, i) => (
                    <p key={i} className="text-[10px] text-ts-text3 flex items-start gap-1.5">
                      <span className="text-ts-green mt-0.5">✓</span> {flag}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Red flags missed */}
            {evaluation.red_flags_missed && evaluation.red_flags_missed.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-ts-red font-medium mb-1.5">Red flags you missed:</p>
                <div className="flex flex-col gap-1">
                  {evaluation.red_flags_missed.map((flag, i) => (
                    <p key={i} className="text-[10px] text-ts-text3 flex items-start gap-1.5">
                      <span className="text-ts-red mt-0.5">✗</span> {flag}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Key actions */}
            {evaluation.key_actions_taken && evaluation.key_actions_taken.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-ts-green font-medium mb-1.5">Correct actions mentioned:</p>
                <div className="flex flex-col gap-1">
                  {evaluation.key_actions_taken.map((action, i) => (
                    <p key={i} className="text-[10px] text-ts-text3 flex items-start gap-1.5">
                      <span className="text-ts-green mt-0.5">✓</span> {action}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {evaluation.key_actions_missed && evaluation.key_actions_missed.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-ts-red font-medium mb-1.5">Actions you should have mentioned:</p>
                <div className="flex flex-col gap-1">
                  {evaluation.key_actions_missed.map((action, i) => (
                    <p key={i} className="text-[10px] text-ts-text3 flex items-start gap-1.5">
                      <span className="text-ts-red mt-0.5">✗</span> {action}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Best-practice answer */}
            {evaluation.best_answer && (
              <div className="mt-4 pt-4 border-t border-ts-border">
                <p className="text-[10px] text-ts-accent2 font-medium mb-1.5">✦ Best-practice answer:</p>
                <p className="text-[11px] text-ts-text2 leading-relaxed bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-3 py-2.5">
                  {evaluation.best_answer}
                </p>
              </div>
            )}
          </div>

          {/* Next / Finish button */}
          <div className="flex justify-between">
            <span className="text-[10px] text-ts-text3 self-center">
              Session avg: {evaluation.session_avg_score}pts
            </span>
            <button
              onClick={nextScenario}
              className="text-[11px] text-white bg-ts-accent rounded-md px-6 py-2 hover:bg-indigo-500 transition-colors font-medium"
            >
              {currentIndex + 1 >= scenarios.length ? 'View debrief' : 'Next scenario →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
