-- ============================================================
-- ThreatSim — Full PostgreSQL Schema
-- Version: 1.0.0
-- Date: 2026-03-14
-- 
-- 9 tables + indexes + constraints
-- Run this file against a fresh PostgreSQL database:
--   psql -U <user> -d threatsim -f threatsim_schema.sql
-- ============================================================

-- Enable UUID generation (optional — using SERIAL instead for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS
-- Core identity table. Every other table references this.
-- ============================================================
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(10)  NOT NULL DEFAULT 'learner'
                        CHECK (role IN ('learner', 'admin')),
    current_streak  INT          NOT NULL DEFAULT 0,
    longest_streak  INT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role  ON users (role);


-- ============================================================
-- 2. AI_PERSONAS
-- Stores Mode 1 character configurations.
-- Each persona has a system prompt template loaded at chat start.
-- ============================================================
CREATE TABLE ai_personas (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(100)  NOT NULL,
    character_description   TEXT          NOT NULL,
    objective               VARCHAR(10)   NOT NULL
                                CHECK (objective IN ('attacker', 'genuine')),
    system_prompt_template  TEXT          NOT NULL,
    difficulty              INT           NOT NULL DEFAULT 1
                                CHECK (difficulty BETWEEN 1 AND 3),
    category                VARCHAR(50)   NOT NULL,
    red_flags_json          JSONB         DEFAULT '[]'::JSONB,
    created_by              INT           REFERENCES users(id)
                                ON DELETE SET NULL,
    is_active               BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_personas_difficulty ON ai_personas (difficulty);
CREATE INDEX idx_personas_objective  ON ai_personas (objective);
CREATE INDEX idx_personas_active     ON ai_personas (is_active);


-- ============================================================
-- 3. CHAT_SESSIONS
-- One row per Mode 1 conversation between a user and a persona.
-- ============================================================
CREATE TABLE chat_sessions (
    id              SERIAL PRIMARY KEY,
    user_id         INT          NOT NULL REFERENCES users(id)
                        ON DELETE CASCADE,
    persona_id      INT          NOT NULL REFERENCES ai_personas(id)
                        ON DELETE CASCADE,
    difficulty      INT          NOT NULL DEFAULT 1
                        CHECK (difficulty BETWEEN 1 AND 3),
    outcome_verdict VARCHAR(12)  DEFAULT 'undecided'
                        CHECK (outcome_verdict IN ('attacker', 'genuine', 'undecided')),
    is_correct      BOOLEAN,
    score           INT          DEFAULT 0,
    started_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    ended_at        TIMESTAMP
);

CREATE INDEX idx_chat_sessions_user       ON chat_sessions (user_id);
CREATE INDEX idx_chat_sessions_persona    ON chat_sessions (persona_id);
CREATE INDEX idx_chat_sessions_difficulty ON chat_sessions (difficulty);


-- ============================================================
-- 4. CHAT_MESSAGES
-- Individual messages within a Mode 1 chat session.
-- ============================================================
CREATE TABLE chat_messages (
    id              SERIAL PRIMARY KEY,
    session_id      INT          NOT NULL REFERENCES chat_sessions(id)
                        ON DELETE CASCADE,
    sender          VARCHAR(5)   NOT NULL
                        CHECK (sender IN ('user', 'ai')),
    message_text    TEXT         NOT NULL,
    timestamp       TIMESTAMP    NOT NULL DEFAULT NOW(),
    flagged_by_user BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_chat_messages_session ON chat_messages (session_id);
CREATE INDEX idx_chat_messages_flagged ON chat_messages (session_id, flagged_by_user)
    WHERE flagged_by_user = TRUE;


-- ============================================================
-- 5. SCENARIOS
-- Stores Mode 2 scenario cards.
-- content_json holds the type-specific payload (email body,
-- SMS thread, webpage screenshot URL, etc.)
-- ============================================================
CREATE TABLE scenarios (
    id                  SERIAL PRIMARY KEY,
    title               VARCHAR(200)  NOT NULL,
    type                VARCHAR(10)   NOT NULL
                            CHECK (type IN (
                                'email', 'sms', 'webpage',
                                'social', 'voice', 'baiting'
                            )),
    difficulty          INT           NOT NULL DEFAULT 1
                            CHECK (difficulty BETWEEN 1 AND 3),
    category            VARCHAR(50)   NOT NULL,
    content_json        JSONB         NOT NULL,
    best_answer         VARCHAR(5)    NOT NULL,
    answer_options_json JSONB         NOT NULL,
    explanation         TEXT          NOT NULL,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scenarios_type       ON scenarios (type);
CREATE INDEX idx_scenarios_difficulty ON scenarios (difficulty);
CREATE INDEX idx_scenarios_active     ON scenarios (is_active);


-- ============================================================
-- 6. GAUNTLET_SESSIONS
-- One row per Mode 2 session (a timed run of multiple scenarios).
-- ============================================================
CREATE TABLE gauntlet_sessions (
    id               SERIAL PRIMARY KEY,
    user_id          INT          NOT NULL REFERENCES users(id)
                         ON DELETE CASCADE,
    difficulty       INT          NOT NULL DEFAULT 1
                         CHECK (difficulty BETWEEN 1 AND 3),
    total_scenarios  INT          NOT NULL DEFAULT 0,
    score            INT          NOT NULL DEFAULT 0,
    started_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    completed_at     TIMESTAMP
);

CREATE INDEX idx_gauntlet_sessions_user       ON gauntlet_sessions (user_id);
CREATE INDEX idx_gauntlet_sessions_difficulty ON gauntlet_sessions (difficulty);


-- ============================================================
-- 7. GAUNTLET_ATTEMPTS
-- Individual scenario attempts within a Mode 2 session.
-- ============================================================
CREATE TABLE gauntlet_attempts (
    id              SERIAL PRIMARY KEY,
    session_id      INT          NOT NULL REFERENCES gauntlet_sessions(id)
                        ON DELETE CASCADE,
    scenario_id     INT          NOT NULL REFERENCES scenarios(id)
                        ON DELETE CASCADE,
    answer_given    VARCHAR(5)   NOT NULL,
    ai_feedback     TEXT,
    is_correct      BOOLEAN      NOT NULL DEFAULT FALSE,
    score_awarded   INT          NOT NULL DEFAULT 0,
    time_taken_sec  INT
);

CREATE INDEX idx_gauntlet_attempts_session  ON gauntlet_attempts (session_id);
CREATE INDEX idx_gauntlet_attempts_scenario ON gauntlet_attempts (scenario_id);


-- ============================================================
-- 8. BADGES
-- Achievement definitions. Criteria evaluated by app logic.
-- ============================================================
CREATE TABLE badges (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL UNIQUE,
    description         TEXT         NOT NULL,
    icon_url            VARCHAR(500),
    applicable_mode     VARCHAR(5)   NOT NULL DEFAULT 'both'
                            CHECK (applicable_mode IN ('mode1', 'mode2', 'both')),
    criteria_type       VARCHAR(50)  NOT NULL,
    criteria_threshold  INT          NOT NULL DEFAULT 0,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 9. USER_BADGES
-- Junction table: which user earned which badge and when.
-- ============================================================
CREATE TABLE user_badges (
    id        SERIAL PRIMARY KEY,
    user_id   INT       NOT NULL REFERENCES users(id)
                  ON DELETE CASCADE,
    badge_id  INT       NOT NULL REFERENCES badges(id)
                  ON DELETE CASCADE,
    earned_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges (user_id);


-- ============================================================
-- HELPFUL VIEWS (optional — useful for the session dashboard)
-- ============================================================

-- User's Mode 1 session history with persona info
CREATE VIEW v_user_chat_history AS
SELECT
    cs.id           AS session_id,
    cs.user_id,
    ap.name         AS persona_name,
    ap.objective    AS persona_objective,
    cs.difficulty,
    cs.outcome_verdict,
    cs.is_correct,
    cs.score,
    cs.started_at,
    cs.ended_at,
    COUNT(cm.id)    AS message_count,
    COUNT(cm.id) FILTER (WHERE cm.flagged_by_user = TRUE) AS flags_raised
FROM chat_sessions cs
JOIN ai_personas ap ON ap.id = cs.persona_id
LEFT JOIN chat_messages cm ON cm.session_id = cs.id
GROUP BY cs.id, ap.name, ap.objective;


-- User's Mode 2 session history with attempt breakdown
CREATE VIEW v_user_gauntlet_history AS
SELECT
    gs.id              AS session_id,
    gs.user_id,
    gs.difficulty,
    gs.total_scenarios,
    gs.score,
    gs.started_at,
    gs.completed_at,
    COUNT(ga.id)       AS attempts_made,
    COUNT(ga.id) FILTER (WHERE ga.is_correct = TRUE) AS correct_count,
    ROUND(AVG(ga.time_taken_sec))::INT AS avg_time_sec
FROM gauntlet_sessions gs
LEFT JOIN gauntlet_attempts ga ON ga.session_id = gs.id
GROUP BY gs.id;


-- Leaderboard view (stretch goal — ready when needed)
CREATE VIEW v_leaderboard AS
SELECT
    u.id        AS user_id,
    u.username,
    COALESCE(m1.total_mode1_score, 0) AS mode1_score,
    COALESCE(m2.total_mode2_score, 0) AS mode2_score,
    COALESCE(m1.total_mode1_score, 0) + COALESCE(m2.total_mode2_score, 0) AS total_score,
    u.current_streak,
    u.longest_streak
FROM users u
LEFT JOIN (
    SELECT user_id, SUM(score) AS total_mode1_score
    FROM chat_sessions
    GROUP BY user_id
) m1 ON m1.user_id = u.id
LEFT JOIN (
    SELECT user_id, SUM(score) AS total_mode2_score
    FROM gauntlet_sessions
    GROUP BY user_id
) m2 ON m2.user_id = u.id
WHERE u.role = 'learner'
ORDER BY total_score DESC;


-- ============================================================
-- DONE
-- Next steps:
--   1. Run this file to create all tables
--   2. Build auth routes (Express + JWT + bcrypt)
--   3. Seed ai_personas and scenarios for testing
-- ============================================================
