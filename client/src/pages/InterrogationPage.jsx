import { useState } from "react";
const interrogationScenarios = [
  {
    title: "Suspicious IT Support Chat",
    tag: "Impersonation",
    starter:
      "Hi there! I'm reaching out from your IT department. We've noticed unusual activity on your account and need to verify a few things before we proceed.",
    description:
      "An unknown contact claims to be from IT support and says your account has unusual activity.",
  },
  {
    title: "Urgent Payroll Verification",
    tag: "Payroll",
    starter:
      "Hello, this is from Payroll Support. Your direct deposit may be delayed unless we confirm your employee details today.",
    description:
      "Someone claims there is a payroll issue and asks you to confirm information quickly.",
  },
  {
    title: "Fake Microsoft Security Alert",
    tag: "Account Security",
    starter:
      "This is Microsoft account protection. Your account was flagged for risky login behavior. Please confirm your username so we can secure it.",
    description:
      "A contact pretends to represent a platform security team and pressures you to act fast.",
  },
  {
    title: "Help Desk Ticket Escalation",
    tag: "Ticket Abuse",
    starter:
      "Hi, I’m handling ticket HD-4821. Your manager asked us to speed this up, but I need you to confirm some account details first.",
    description:
      "The contact references a fake ticket and authority pressure to make the request seem legitimate.",
  },
  {
    title: "Vendor Access Request",
    tag: "Third-Party Risk",
    starter:
      "Hi, I’m with your company’s software vendor. We need temporary access confirmation to finish a scheduled maintenance task.",
    description:
      "A supposed vendor asks for access-related information during maintenance.",
  },
  {
    title: "Shared Document Trap",
    tag: "Phishing Link",
    starter:
      "Hey, I shared the updated HR policy document with you. It says access is blocked until you verify your company login.",
    description:
      "A contact pushes the user toward a suspicious document link and login prompt.",
  },
  {
    title: "Executive Assistant Request",
    tag: "Authority Pressure",
    starter:
      "Hi, I’m assisting the VP’s office. We need your quick confirmation for an internal access review before the meeting starts.",
    description:
      "The contact uses executive urgency to make the request feel important.",
  },
  {
    title: "New Device Enrollment",
    tag: "Device Security",
    starter:
      "This is endpoint support. Your device enrollment is incomplete, and your access may be limited unless we verify your device record.",
    description:
      "The contact claims there is a device enrollment problem and asks for confirmation.",
  },
  {
    title: "Fake Classmate / Coworker Message",
    tag: "Social Engineering",
    starter:
      "Hey, I think we’re in the same department. I’m locked out of the shared portal. Can you help me check something real quick?",
    description:
      "Someone acts familiar and asks for help accessing a shared system.",
  },
  {
    title: "Password Reset Pressure",
    tag: "Credential Attack",
    starter:
      "Hi, your password reset request is stuck. I can help finish it faster if you confirm a few details here.",
    description:
      "The contact tries to move the user away from official reset channels.",
  },
];
const hintBank = {
  easy: [
    "Check whether the contact is creating urgency or pressuring you to act quickly.",
    "Look for requests that move you away from official IT channels.",
    "Watch for vague identity claims, unofficial links, or requests for account details.",
  ],
  medium: [
    "Check whether this contact is using an approved channel and whether the request matches normal IT policy.",
  ],
};
export default function InterrogationPage() {
  const [difficulty, setDifficulty] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [showVerdict, setShowVerdict] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = interrogationScenarios[currentScenarioIndex];
  const totalScenarios = interrogationScenarios.length;
  const [hintsLeft, setHintsLeft] = useState(0);
  const [usedHintCount, setUsedHintCount] = useState(0);

  const startSession = (level) => {
  setDifficulty(level);
  setCurrentScenarioIndex(0);
  setUsedHintCount(0);

  if (level === "easy") {
    setHintsLeft(3);
  } else if (level === "medium") {
    setHintsLeft(1);
  } else {
    setHintsLeft(0);
  }

  const firstScenario = interrogationScenarios[0];

  setMessages([
    {
      id: Date.now(),
      sender: "ai",
      text: firstScenario.starter,
      flagged: false,
    },
  ]);

  setScore(null);
  setEvaluation(null);
  setHint("");
  setShowVerdict(false);
  setVerdict("");
  setFlaggedMessages([]);
  setMessage("");
  setError("");
};

const handleNextScenario = () => {
  const nextIndex = currentScenarioIndex + 1;

  if (nextIndex >= totalScenarios) {
    setDifficulty(null);
    setCurrentScenarioIndex(0);
    return;
  }

  const nextScenario = interrogationScenarios[nextIndex];

  setCurrentScenarioIndex(nextIndex);
  setMessages([
    {
      id: Date.now(),
      sender: "ai",
      text: nextScenario.starter,
      flagged: false,
    },
  ]);

  setScore(null);
  setEvaluation(null);
  setHint("");
  setShowVerdict(false);
  setVerdict("");
  setFlaggedMessages([]);
  setMessage("");
  setError("");
};

  const handleSend = async () => {
    const cleanMessage = message.trim();

    if (!cleanMessage || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanMessage,
      flagged: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/interrogation/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
          session_id: 1,
          scenario_id: 1,
          difficulty,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply || "No response received.",
        flagged: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setScore(data.updated_score ?? null);
      setEvaluation(data.evaluation ?? null);
    } catch (err) {
      console.error("Mode1 request failed:", err);
      setError("Failed to connect to Interrogation Room backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlagMessage = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, flagged: !msg.flagged } : msg
      )
    );

    setFlaggedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleUseHint = () => {
  if (hintsLeft <= 0) {
    setHint("No hints remaining.");
    return;
  }

  const hints = hintBank[difficulty] || [];

  if (hints.length === 0) {
    setHint("No hints available for this difficulty.");
    return;
  }

  const nextHint = hints[usedHintCount] || hints[hints.length - 1];

  setHint(nextHint);
  setUsedHintCount((prev) => prev + 1);
  setHintsLeft((prev) => Math.max(prev - 1, 0));
};

  const handleSubmitVerdict = (selectedVerdict) => {
    setVerdict(selectedVerdict);
    setShowVerdict(true);
  };

  if (!difficulty) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-65px)] px-7">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-ts-accent2 mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          <h1 className="text-xl font-medium text-ts-text mb-2">
            Interrogation Room
          </h1>

          <p className="text-sm text-ts-text3 mb-6 max-w-sm mx-auto">
            Chat with an unknown contact. Decide whether they are legitimate or a social engineer.
          </p>

          <div className="flex gap-3 justify-center">
            {[
              {
                level: "easy",
                name: "Beginner",
                desc: "Obvious red flags, 3 hints",
                color: "border-green-500/30 hover:border-green-500/60 text-ts-green",
              },
              {
                level: "medium",
                name: "Intermediate",
                desc: "Subtle red flags, 1 hint",
                color: "border-amber-500/30 hover:border-amber-500/60 text-ts-amber",
              },
              {
                level: "hard",
                name: "Expert",
                desc: "Near-invisible, no hints",
                color: "border-red-500/30 hover:border-red-500/60 text-ts-red",
              },
            ].map((d) => (
              <button
                key={d.level}
                onClick={() => startSession(d.level)}
                className={`flex-1 max-w-[140px] bg-ts-surface border rounded-lg p-4 transition-colors ${d.color}`}
              >
                <p className="text-sm font-medium mb-1">{d.name}</p>
                <p className="text-[10px] text-ts-text3">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const difficultyLabel =
    difficulty === "easy"
      ? "Beginner"
      : difficulty === "medium"
      ? "Intermediate"
      : "Expert";

  return (
    <div className="relative z-10 min-h-[calc(100vh-65px)] max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ts-text3"> Scenario {currentScenarioIndex + 1} of {totalScenarios}</p>
        <p className="text-sm text-ts-text3">Difficulty: {difficultyLabel}</p>
      </div>

      <div className="h-1 bg-ts-surface border border-ts-border rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-ts-accent rounded-full" style={{width: `${((currentScenarioIndex + 1) / totalScenarios) * 100}%`,}}/>
      </div>

      <div className="bg-ts-surface border border-ts-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] text-ts-amber font-medium mb-4">
              Live Persona Simulation
            </span>
            
            <span className="ml-2 inline-flex items-center rounded-full border border-ts-border bg-ts-surface px-3 py-1 text-[11px] text-ts-text3 font-medium">
              {currentScenario.tag}
            </span>

            <h1 className="text-2xl font-semibold text-ts-text">
              {currentScenario.title}
            </h1>

            <p className="text-sm text-ts-text3 mt-2 max-w-2xl">
              {currentScenario.description}
            </p>
          </div>

          <button
            onClick={() => {
              setDifficulty(null);
              setCurrentScenarioIndex(0);
              setMessages([]);
              setScore(null);
              setEvaluation(null);
              setHint("");
              setShowVerdict(false);
              setVerdict("");
              setFlaggedMessages([]);
              setMessage("");
              setError("");
              setHintsLeft(0);
              setUsedHintCount(0);
            }}
            className="text-xs text-ts-text3 hover:text-ts-text border border-ts-border rounded-md px-4 py-2"
          >
            Quit session
          </button>
        </div>

        <div className="bg-[#080d1a] border border-ts-border rounded-xl h-[390px] overflow-y-auto p-5 mb-5">
          <div className="flex justify-center mb-5">
            <span className="text-[10px] text-ts-text3 bg-ts-surface border border-ts-border rounded-full px-3 py-1">
              Session started — determine if this contact is legitimate or a threat.
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-[11px] text-ts-accent2 font-medium flex-shrink-0 mt-1">
                  ?
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 border ${
                  msg.sender === "user"
                    ? "bg-ts-accent text-white border-ts-accent rounded-tr-none"
                    : "bg-ts-surface border-ts-border text-ts-text2 rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </p>

                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleFlagMessage(msg.id)}
                    className={`mt-2 text-[10px] border rounded-md px-2 py-1 ${
                      msg.flagged
                        ? "text-ts-amber border-amber-500/40 bg-amber-500/10"
                        : "text-ts-text3 border-ts-border hover:text-ts-amber"
                    }`}
                  >
                    {msg.flagged ? "Flagged" : "Flag message"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-xs text-ts-text3 italic">Unknown contact is typing...</p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-3">{error}</p>
        )}

        {hint && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-ts-amber text-xs rounded-lg px-4 py-3 mb-4">
            Hint: {hint}
          </div>
        )}

        {!showVerdict && (
          <>
            <label className="block text-sm text-ts-text2 mb-2">
              Your response
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your response..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                className="flex-1 px-4 py-3 bg-[#0b1020] border border-ts-border rounded-lg text-sm text-ts-text placeholder:text-ts-text3 focus:outline-none focus:border-ts-accent"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className="px-6 py-3 bg-ts-accent text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-3">
               <button
                  onClick={handleUseHint}
                  disabled={hintsLeft <= 0}
                  className={`text-xs border rounded-md px-4 py-2 ${
                    hintsLeft <= 0
                      ? "text-ts-text3 border-ts-border opacity-50 cursor-not-allowed"
                      : "text-ts-amber border-amber-500/30 hover:bg-amber-500/10"
                  }`}
                >
                  {hintsLeft <= 0 ? "No hints left" : `Use hint (${hintsLeft} left)`}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmitVerdict("legitimate")}
                  className="text-xs text-ts-text2 border border-ts-border rounded-md px-4 py-2 hover:text-ts-text"
                >
                  Verdict: Legitimate
                </button>

                <button
                  onClick={() => handleSubmitVerdict("social_engineer")}
                  className="text-xs text-white bg-ts-accent rounded-md px-4 py-2"
                >
                  Verdict: Social Engineer
                </button>
              </div>
            </div>
          </>
        )}

        {showVerdict && (
          <div className="mt-5 bg-[#0b1020] border border-ts-border rounded-xl p-5">
            <p className="text-xs text-ts-text3 mb-2">Final Verdict</p>

            <h2 className="text-xl font-semibold text-ts-text mb-3">
              You selected:{" "}
              {verdict === "social_engineer" ? "Social Engineer" : "Legitimate"}
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-ts-surface border border-ts-border rounded-lg p-4">
                <p className="text-[11px] text-ts-text3 mb-1">Score</p>
                <p className="text-2xl font-semibold text-ts-green">
                  {score ?? 0}/100
                </p>
              </div>

              <div className="bg-ts-surface border border-ts-border rounded-lg p-4">
                <p className="text-[11px] text-ts-text3 mb-1">Messages flagged</p>
                <p className="text-2xl font-semibold text-ts-amber">
                  {flaggedMessages.length}
                </p>
              </div>

              <div className="bg-ts-surface border border-ts-border rounded-lg p-4">
                <p className="text-[11px] text-ts-text3 mb-1">Confidence</p>
                <p className="text-lg font-semibold text-ts-text">
                  {evaluation?.confidence || "Medium"}
                </p>
              </div>
            </div>

            <p className="text-sm text-ts-text2 leading-relaxed">
              {evaluation?.feedback ||
                "Review whether the contact used urgency, requested sensitive information, or pushed you away from approved verification channels."}
            </p>

            <button
              onClick={handleNextScenario}
              className="mt-5 text-xs text-white bg-ts-accent rounded-md px-4 py-2"
            >
              {currentScenarioIndex + 1 >= totalScenarios
                ? "Finish Session"
                : "Next Scenario"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 