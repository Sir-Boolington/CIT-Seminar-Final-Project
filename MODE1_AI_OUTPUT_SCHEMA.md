# Mode 1 AI Output Schema

This document defines the required JSON response format returned by the AI evaluator for Mode 1 (Interrogation Room).

The evaluator analyzes a user's performance in identifying social engineering behavior and returns structured scoring results.

---

## Required Output Format

```json
{
  "verdict_correct": true,
  "correct_flags": 2,
  "missed_flags": 1,
  "false_flags": 0,
  "score": 85,
  "feedback": "The user correctly identified the attacker and detected most suspicious behavior."
}
```

---

## Field Definitions

### verdict_correct

Type:

```
boolean
```

Description:

Indicates whether the user's final verdict matches the true role of the AI character.

Example:

```
true
```

Meaning:

User correctly identified attacker vs genuine persona.

---

### correct_flags

Type:

```
integer
```

Description:

Number of suspicious messages correctly flagged by the user.

Example:

```
2
```

Meaning:

User successfully detected two real red-flag messages.

---

### missed_flags

Type:

```
integer
```

Description:

Number of suspicious messages that existed but were NOT flagged by the user.

Example:

```
1
```

Meaning:

User missed one suspicious indicator.

---

### false_flags

Type:

```
integer
```

Description:

Number of safe messages incorrectly marked as suspicious by the user.

Example:

```
0
```

Meaning:

User did not incorrectly flag safe content.

---

### score

Type:

```
integer (0–100)
```

Description:

Final calculated performance score based on:

- verdict correctness
- red-flag detection accuracy
- false positives
- response time bonus
- difficulty multiplier

Example:

```
85
```

Meaning:

User performed strongly but not perfectly.

---

### feedback

Type:

```
string
```

Description:

Short explanation summarizing the user's performance.

Example:

```
"The user correctly identified the attacker and detected most suspicious behavior."
```

Purpose:

Displayed inside the ThreatSim dashboard after simulation completion.