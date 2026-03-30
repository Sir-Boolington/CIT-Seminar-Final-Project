# Mode 1 AI Prompt Tests

## Goal
Test AI prompts for evaluating user performance in Mode 1 (Interrogation Room).

The AI evaluator must judge:
- whether the user's verdict was correct
- which suspicious red flags were correctly identified
- which red flags were missed
- whether any safe messages were falsely flagged
- a final score out of 100
- short feedback for the user

---

## Required JSON Output Format

```json
{
  "verdict_correct": true,
  "correct_flags": 2,
  "missed_flags": 1,
  "false_flags": 0,
  "score": 85,
  "feedback": "The user correctly identified the phishing attempt and caught most major warning signs."
}
```
## System Prompt
You are a cybersecurity training evaluator.

Your job is to evaluate a user's performance in a simulated phishing / social engineering exercise.

You will receive:
1. the hidden true role of the AI character ("attacker" or "genuine")
2. the full conversation messages
3. a list of which messages are actual red flags
4. the user's verdict
5. the list of message IDs flagged by the user
6. response time in seconds

Evaluate the user's performance.

Scoring rules:
- Correct verdict: +50
- Each correctly flagged suspicious message: +10
- Each false flag: -5
- Speed bonus:
  - under 60 sec = +10
  - 60 to 120 sec = +5
  - over 120 sec = +0

Return valid JSON only.
Do not include markdown.
Do not include explanation outside JSON.

## Test Case 1
```json
{
  "persona_role": "attacker",
  "messages": [
    {
      "id": "m1",
      "sender": "ai",
      "text": "We detected suspicious activity. Please send me your password immediately."
    },
    {
      "id": "m2",
      "sender": "ai",
      "text": "Use this external link to verify your account."
    },
    {
      "id": "m3",
      "sender": "ai",
      "text": "Thank you for your patience."
    }
  ],
  "actual_red_flags": ["m1", "m2"],
  "user_verdict": "attacker",
  "flagged_message_ids": ["m1", "m2"],
  "response_time_sec": 45
}
```


### Actual AI Output (Gemini)

```json
{
  "verdict_correct": true,
  "correct_flags": 2,
  "missed_flags": 0,
  "false_flags": 0,
  "score": 80,
  "feedback": "Perfect assessment. You correctly identified the attacker and flagged all high-risk messages within the optimal time frame."
}
```

---

## Test Case 2
```json
{
  "persona_role": "attacker",
  "messages": [
    {
      "id": "m1",
      "sender": "ai",
      "text": "Your account will be locked unless you act immediately."
    },
    {
      "id": "m2",
      "sender": "ai",
      "text": "Please confirm your MFA code."
    }
  ],
  "actual_red_flags": ["m1", "m2"],
  "user_verdict": "genuine",
  "flagged_message_ids": [],
  "response_time_sec": 150
}
```

### Actual AI Output (Claude)

```json
{
  "verdict_correct": false,
  "correct_flags": 0,
  "missed_flags": 2,
  "false_flags": 0,
  "score": 0,
  "feedback": "Incorrect verdict: this was an attacker. Both messages were red flags."
}
```

---

## Test Case 3
```json
{
  "persona_role": "genuine",
  "messages": [
    {
      "id": "m1",
      "sender": "ai",
      "text": "Please use the official university support portal."
    },
    {
      "id": "m2",
      "sender": "ai",
      "text": "Do not share your password with anyone."
    }
  ],
  "actual_red_flags": [],
  "user_verdict": "genuine",
  "flagged_message_ids": ["m1"],
  "response_time_sec": 70
}
```


### Actual AI Output (Gemini)

```json
{
  "verdict_correct": true,
  "correct_flags": 0,
  "missed_flags": 0,
  "false_flags": 1,
  "score": 50,
  "feedback": "You correctly identified the genuine sender, but incorrectly flagged an official support instruction as a red flag. A speed bonus was applied for your response time."
}
```

---

## Test Case 4
```json
{
  "persona_role": "attacker",
  "messages": [
    {
      "id": "m1",
      "sender": "ai",
      "text": "Please use this login page to confirm your account."
    },
    {
      "id": "m2",
      "sender": "ai",
      "text": "I can also help through the official support portal."
    },
    {
      "id": "m3",
      "sender": "ai",
      "text": "We need the process completed quickly."
    }
  ],
  "actual_red_flags": ["m1", "m3"],
  "user_verdict": "attacker",
  "flagged_message_ids": ["m1"],
  "response_time_sec": 80
}
```


### Actual AI Output (Claude)

```json
{
  "verdict_correct": true,
  "correct_flags": 1,
  "missed_flags": 1,
  "false_flags": 0,
  "score": 65,
  "feedback": "You correctly identified the attacker but missed one of the red flags regarding the sense of urgency. A speed bonus was applied for your response time."
}
```