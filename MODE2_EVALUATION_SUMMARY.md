# Mode 2 Evaluation Summary — Threat Gauntlet

Four decision-based cybersecurity scenarios were tested using rubric-driven Claude evaluation.

Scenario coverage:

1. Phishing email detection
2. Smishing SMS verification attack
3. USB baiting physical attack
4. Domain spoofing credential-harvesting portal

Across all scenarios:

- Structured JSON output matched schema
- Confidence values returned consistently
- Correct decisions received high scores
- Incomplete threat-model reasoning produced controlled score reductions
- Escalation-step omissions were consistently penalized

Result:

Mode 2 evaluator successfully differentiates between
decision correctness and justification quality.

This confirms rubric alignment with cybersecurity training simulator behavior expectations.