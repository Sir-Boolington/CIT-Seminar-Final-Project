require("dotenv").config();

const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const pool = require("../config/db");

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message, session_id, scenario_id } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 250,
      messages: [
        {
          role: "user",
         content: `
You are running ThreatSim: Interrogation Room.

You are playing an unknown live chat contact in a cybersecurity awareness simulation.

Persona for this demo:
A suspicious person pretending to be from IT support.

Your goal:
Sound realistic enough that the user has to investigate, but include red flags depending on difficulty.

Difficulty: ${req.body.difficulty || "easy"}

Difficulty rules:
- easy: include obvious red flags such as urgency, vague identity claims, or pushing for quick action.
- medium: include subtle red flags and sound more professional.
- hard: sound highly realistic with minimal red flags.

Behavior rules:
- Stay in character.
- Do not say this is a simulation.
- Do not reveal you are suspicious.
- Do not ask directly for passwords, MFA codes, or tokens.
- You may pressure the user toward unsafe behavior, such as using an unofficial link, bypassing normal process, or sharing non-secret account details.
- Keep replies under 4 sentences.
- Sound like a real chat, not a policy document.

User message:
${message}

Do not ask directly for passwords, MFA codes, authenticator tokens, or secrets. Instead, create realistic social-engineering pressure through urgency, unofficial links, vague authority claims, or requests for non-secret account details.
          `,
        },
      ],
    });

    const reply = response.content[0].text;
    const evalResponse = await anthropic.messages.create({
  model: "claude-opus-4-7",
  max_tokens: 800,
  messages: [
    {
      role: "user",
      content: `
Evaluate this social-engineering simulation response.

User attempted:
${message}

Persona replied:
${reply}

Return ONLY valid JSON in this format:
{
  "score": 0,
  "confidence": "low | medium | high",
  "feedback": "",
  "strengths": [],
  "weaknesses": []
}

Score from 0 to 100 based on how well the persona handled the social-engineering attempt.
`
    }
  ]
});

const evaluation = JSON.parse(evalResponse.content[0].text);

const score_awarded = evaluation.score || 0;
 
await pool.query(
 `INSERT INTO attempts
 (session_id, scenario_id, user_answer, correct_answer, result, score_awarded)
 VALUES ($1, $2, $3, $4, $5, $6)`,
 [
   session_id,
   scenario_id,
   message.slice(0, 50),
   "AI_MODE1",
   score_awarded >= 70 ? "correct" : "incorrect",
   score_awarded
 ]
);
const scoreResult = await pool.query(
  `SELECT AVG(score_awarded) AS avg_score
   FROM attempts
   WHERE session_id = $1`,
  [session_id]
);

const avgScore = Math.round(scoreResult.rows[0].avg_score || 0);

await pool.query(
  `UPDATE sessions
   SET score_percent = $1
   WHERE session_id = $2`,
  [avgScore, session_id]
);

res.json({
  reply,
  evaluation,
  updated_score: avgScore
});
  } catch (error) {
    console.error("Mode 1 Claude error:", error);
    res.status(500).json({ error: "Mode 1 Claude integration failed" });
  }
});

module.exports = router;