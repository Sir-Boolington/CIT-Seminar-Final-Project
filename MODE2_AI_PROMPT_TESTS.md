# Mode 2 — Threat Gauntlet AI Prompt Tests

This document validates Claude’s evaluation behavior when scoring user cybersecurity decisions against a best-practice rubric.

---

## Test Case 1 — Phishing Email (Credential Harvesting)

### Scenario Type
Email inbox simulation

### Scenario Description
User receives an email claiming their Microsoft password must be reset immediately via an external link.

### User Decision
Report email

### User Justification
"This email asks for credentials through an external link which may be phishing."

### Expected AI Behavior
- Recognize phishing indicators
- Reward correct decision
- Reward correct reasoning
- Return structured JSON output
- Assign score within rubric expectations

### Claude Output
{
  "score": 88,
  "feedback": "Solid call, correct instincts, but the justification is surface-level. You identified the right red flag (external link for credentials) and took the right action (report, not just delete). However, 'may be phishing' is weak reasoning — you need to articulate *why* it fits a phishing pattern, not just hedge with 'may be.' Microsoft sends password resets only when *you* initiate them. Unsolicited resets are a near-universal phishing vector. That distinction matters and you missed it.",
  "strengths": [
    "Correct decision: reporting is the optimal action — it protects other users, not just yourself",
    "Identified the core technical red flag: credential harvesting via external link",
    "Did not click the link or attempt to 'investigate' it manually, which is a common mistake"
  ],
  "weaknesses": [
    "Justification lacks specificity — 'may be phishing' is hedging, not reasoning",
    "No mention of inspecting sender domain or hovering link destination",
    "Missed the behavioral red flag: unsolicited password resets are suspicious by default"
  ]
}

### Score Returned
88/100

### Result
Pass

### Notes
Claude correctly differentiated between decision accuracy and reasoning quality. 
Evaluator penalized weak justification despite correct action, which confirms rubric sensitivity is working as intended.
Structured JSON output matched schema successfully.

---

## Test Case 2 — Smishing (Bank Fraud SMS)

### Scenario Type
Mobile SMS simulation

### Scenario Description
User receives a text message claiming suspicious activity was detected on their bank account and must verify immediately using a shortened link (bit.ly).

### User Decision
Do not click link; verify through official banking app or phone number

### User Justification
Shortened links hide their destination and banks typically do not request verification through SMS links. I would check the official banking app instead.

### Expected AI Behavior
- Recognize smishing attack indicators
- Reward correct security decision
- Reward verification-through-official-channel reasoning
- Penalize shortened-link trust behavior if present
- Return structured JSON output
- Assign score within expected rubric range

### Claude Output
{
  "score": 96,
  "confidence": "High",
  "feedback": "Near-textbook response...",
  "strengths": [
    "Correct and complete decision: refused the link AND went to a verified source",
    "Technically accurate flag on shortened URLs",
    "Demonstrated knowledge of legitimate bank communication norms",
    "Chose safest verification channel: official app"
  ],
  "weaknesses": [
    "Did not identify psychological manipulation vector",
    "No mention of smishing attack category",
    "Did not mention risk of calling phone number from SMS"
  ]
}

### Score Returned
96/100

### Result
Pass

### Notes
Claude correctly rewarded both decision accuracy and verification-channel selection.
Evaluator demonstrated sensitivity to social-engineering awareness gaps, not just technical indicators.
Structured JSON output matched schema successfully.
Confidence field returned as expected.

## Test Case 3 — USB Baiting Attack (Unknown Removable Media)

### Scenario Type
Physical baiting simulation

### Scenario Description
User finds a USB drive labeled "Payroll_Q2" in a workplace parking lot.

### User Decision
Do not insert device; report it to IT/security team

### User Justification
Unknown removable media can contain malware and should never be trusted or inserted into a company device.

### Expected AI Behavior
- Recognize physical baiting/social engineering attack pattern
- Reward refusal to insert unknown device
- Reward reporting action to security team
- Penalize curiosity-driven investigation behavior
- Return structured JSON output
- Assign score within expected rubric range

### Claude Output
{
  "score": 91,
  "confidence": "High",
  "feedback": "Correct decision, clean reasoning, proper escalation path...",
  "strengths": [
    "Correct decision with zero deviation",
    "Correct escalation target: IT/security team",
    "Technically accurate core reasoning",
    "Implicitly resistant to social engineering bait"
  ],
  "weaknesses": [
    "Did not identify baited USB drop attack explicitly",
    "No mention of AutoRun/AutoPlay execution risk",
    "Did not explain why Payroll_Q2 label itself is suspicious",
    "Did not mention avoiding insertion on personal devices"
  ]
}

### Score Returned
91/100

### Result
Pass
### Notes
Claude correctly identified the scenario as a physical social engineering vector rather than a generic removable-media risk.
Evaluator penalized incomplete threat classification despite correct action.
Structured JSON output matched schema and returned expected confidence field.
Result confirms evaluator supports detection of baiting-style attack mechanics.

## Test Case 4 — Spoofed University Login Portal

### Scenario Type
Credential-harvesting webpage simulation

### Scenario Description
User receives a link to log in to their university account but the URL domain is slightly misspelled compared to the official site.

### User Decision
Do not enter credentials; verify the domain using the official university website

### User Justification
Misspelled domains are a common phishing technique used to capture login credentials.

### Expected AI Behavior
- Recognize domain spoofing indicator
- Reward credential protection behavior
- Reward verification through official source
- Penalize trust of visually similar domains
- Return structured JSON output
- Assign score within expected rubric range

### Claude Output
{
  "score": 90,
  "confidence": "High",
  "feedback": "Correct decision, correct threat identification, correct recovery action...",
  "strengths": [
    "Correct and immediate decision: did not enter credentials",
    "Correctly identified domain spoofing as threat vector",
    "Used correct verification method via official site",
    "Recognized visual legitimacy is not a trust signal"
  ],
  "weaknesses": [
    "Did not name typosquatting explicitly",
    "Did not explain cloned UI credential harvesting mechanics",
    "Did not mention reporting URL to university security",
    "Did not evaluate additional URL manipulation indicators"
  ]
}

### Score Returned
90/100

### Result
Pass

### Notes
Claude correctly evaluated domain spoofing behavior and credential-protection decision quality.
Evaluator penalized missing escalation step and lack of typosquatting terminology.
Structured JSON output matched schema with expected confidence field.
Result confirms evaluator supports detection of visual deception and credential-harvesting attack patterns.