-- ============================================================
-- ThreatSim — PostgreSQL Schema
-- Based on Jerome Vallido's original MySQL schema
-- Converted to PostgreSQL + missing features added
--
-- Run: psql -U postgres -d threatsim -f schema.sql
-- ============================================================


-- ============================================================
-- 1. USERS (Jerome's original + added fields)
--    Added: role, current_streak, longest_streak
-- ============================================================
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(10)  NOT NULL DEFAULT 'learner'
                        CHECK (role IN ('learner', 'admin')),
    current_streak  INT          NOT NULL DEFAULT 0,
    longest_streak  INT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
);

CREATE INDEX idx_users_email ON users (email);


-- ============================================================
-- 2. PERSONAS (Jerome's original — converted to PostgreSQL)
--    ENUM('threat_actor','legitimate') → CHECK constraint
-- ============================================================
CREATE TABLE personas (
    persona_id          SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    persona_type        VARCHAR(15)  NOT NULL
                            CHECK (persona_type IN ('threat_actor', 'legitimate')),
    description         TEXT,
    ai_prompt_template  TEXT,
    difficulty          INT          NOT NULL DEFAULT 1
                            CHECK (difficulty BETWEEN 1 AND 3),
    category            VARCHAR(50),
    red_flags_json      JSONB        DEFAULT '[]'::JSONB,
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_personas_type   ON personas (persona_type);
CREATE INDEX idx_personas_active ON personas (is_active);


-- ============================================================
-- 3. SCENARIOS (Jerome's original — converted to PostgreSQL)
--    ENUM → CHECK, added answer_options_json + explanation
-- ============================================================
CREATE TABLE scenarios (
    scenario_id         SERIAL PRIMARY KEY,
    persona_id          INT          NOT NULL REFERENCES personas(persona_id)
                            ON DELETE CASCADE,
    mode_type           VARCHAR(15)  NOT NULL
                            CHECK (mode_type IN ('interrogation', 'gauntlet')),
    difficulty          VARCHAR(6)   NOT NULL
                            CHECK (difficulty IN ('easy', 'medium', 'hard')),
    content_json        JSONB        NOT NULL,
    best_answer         VARCHAR(50),
    answer_options_json JSONB,
    explanation         TEXT,
    scenario_score      INT          DEFAULT 0,
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scenarios_mode       ON scenarios (mode_type);
CREATE INDEX idx_scenarios_difficulty ON scenarios (difficulty);
CREATE INDEX idx_scenarios_active     ON scenarios (is_active);


-- ============================================================
-- 4. SESSIONS (Jerome's original — converted to PostgreSQL)
--    ENUM → CHECK, renamed start_time/end_time for clarity
-- ============================================================
CREATE TABLE sessions (
    session_id      SERIAL PRIMARY KEY,
    user_id         INT          NOT NULL REFERENCES users(user_id)
                        ON DELETE CASCADE,
    mode_type       VARCHAR(15)  NOT NULL
                        CHECK (mode_type IN ('interrogation', 'gauntlet')),
    difficulty      VARCHAR(6)   NOT NULL
                        CHECK (difficulty IN ('easy', 'medium', 'hard')),
    score_percent   INT          DEFAULT 0,
    total_scenarios INT          DEFAULT 0,
    outcome_verdict VARCHAR(12)
                        CHECK (outcome_verdict IN ('attacker', 'genuine', 'undecided')),
    is_correct      BOOLEAN,
    started_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    ended_at        TIMESTAMP
);

CREATE INDEX idx_sessions_user       ON sessions (user_id);
CREATE INDEX idx_sessions_mode       ON sessions (mode_type);
CREATE INDEX idx_sessions_difficulty ON sessions (difficulty);


-- ============================================================
-- 5. ATTEMPTS (Jerome's original — converted to PostgreSQL)
--    ENUM → CHECK, added score_awarded + attempt_time
-- ============================================================
CREATE TABLE attempts (
    attempt_id      SERIAL PRIMARY KEY,
    session_id      INT          NOT NULL REFERENCES sessions(session_id)
                        ON DELETE CASCADE,
    scenario_id     INT          NOT NULL REFERENCES scenarios(scenario_id)
                        ON DELETE CASCADE,
    user_answer     VARCHAR(50)  NOT NULL,
    correct_answer  VARCHAR(50)  NOT NULL,
    result          VARCHAR(10)  NOT NULL
                        CHECK (result IN ('correct', 'incorrect')),
    ai_feedback     TEXT,
    score_awarded   INT          DEFAULT 0,
    time_taken_sec  INT,
    attempt_time    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attempts_session  ON attempts (session_id);
CREATE INDEX idx_attempts_scenario ON attempts (scenario_id);


-- ============================================================
-- 6. CHAT_MESSAGES (NEW — required for Mode 1)
--    Stores every message in an Interrogation Room conversation.
--    Users can flag individual messages as suspicious.
-- ============================================================
CREATE TABLE chat_messages (
    message_id      SERIAL PRIMARY KEY,
    session_id      INT          NOT NULL REFERENCES sessions(session_id)
                        ON DELETE CASCADE,
    sender          VARCHAR(5)   NOT NULL
                        CHECK (sender IN ('user', 'ai')),
    message_text    TEXT         NOT NULL,
    flagged_by_user BOOLEAN      NOT NULL DEFAULT FALSE,
    sent_at         TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages (session_id);
CREATE INDEX idx_chat_messages_flagged ON chat_messages (session_id, flagged_by_user)
    WHERE flagged_by_user = TRUE;


-- ============================================================
-- 7. BADGES (NEW — stretch goal, but table ready)
-- ============================================================
CREATE TABLE badges (
    badge_id            SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL UNIQUE,
    description         TEXT         NOT NULL,
    icon_url            VARCHAR(500),
    applicable_mode     VARCHAR(15)  NOT NULL DEFAULT 'both'
                            CHECK (applicable_mode IN ('interrogation', 'gauntlet', 'both')),
    criteria_type       VARCHAR(50)  NOT NULL,
    criteria_threshold  INT          NOT NULL DEFAULT 0,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 8. USER_BADGES (NEW — stretch goal, but table ready)
-- ============================================================
CREATE TABLE user_badges (
    user_badge_id  SERIAL PRIMARY KEY,
    user_id        INT       NOT NULL REFERENCES users(user_id)
                       ON DELETE CASCADE,
    badge_id       INT       NOT NULL REFERENCES badges(badge_id)
                       ON DELETE CASCADE,
    earned_at      TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges (user_id);


-- ============================================================
-- VIEWS — useful for dashboard queries
-- ============================================================

-- User's session history with attempt breakdown
CREATE VIEW v_session_history AS
SELECT
    s.session_id,
    s.user_id,
    u.username,
    s.mode_type,
    s.difficulty,
    s.score_percent,
    s.outcome_verdict,
    s.is_correct,
    s.started_at,
    s.ended_at,
    COUNT(a.attempt_id)       AS total_attempts,
    COUNT(a.attempt_id) FILTER (WHERE a.result = 'correct') AS correct_count,
    ROUND(AVG(a.time_taken_sec))::INT AS avg_time_sec
FROM sessions s
JOIN users u ON u.user_id = s.user_id
LEFT JOIN attempts a ON a.session_id = s.session_id
GROUP BY s.session_id, u.username;


-- Mode 1 chat sessions with message counts
CREATE VIEW v_chat_history AS
SELECT
    s.session_id,
    s.user_id,
    p.name          AS persona_name,
    p.persona_type,
    s.difficulty,
    s.outcome_verdict,
    s.is_correct,
    s.score_percent,
    s.started_at,
    s.ended_at,
    COUNT(cm.message_id)    AS message_count,
    COUNT(cm.message_id) FILTER (WHERE cm.flagged_by_user = TRUE) AS flags_raised
FROM sessions s
JOIN scenarios sc ON sc.mode_type = 'interrogation'
JOIN personas p ON p.persona_id = sc.persona_id
LEFT JOIN chat_messages cm ON cm.session_id = s.session_id
WHERE s.mode_type = 'interrogation'
GROUP BY s.session_id, p.name, p.persona_type;


-- Leaderboard (stretch goal — ready when needed)
CREATE VIEW v_leaderboard AS
SELECT
    u.user_id,
    u.username,
    COUNT(s.session_id)  AS total_sessions,
    COALESCE(AVG(s.score_percent), 0)::INT AS avg_score,
    u.current_streak,
    u.longest_streak
FROM users u
LEFT JOIN sessions s ON s.user_id = u.user_id
WHERE u.role = 'learner'
GROUP BY u.user_id
ORDER BY avg_score DESC, total_sessions DESC;


-- ============================================================
-- SEED DATA — sample personas and scenarios for testing
-- ============================================================

-- Personas
INSERT INTO personas (name, persona_type, description, ai_prompt_template, difficulty, category)
VALUES
    ('Phishing Scammer', 'threat_actor',
     'Pretends to be a bank representative requesting account verification.',
     'You are a social engineer posing as a bank fraud department representative. Your goal is to extract the user''s account credentials through urgency and authority. Plant red flags: unofficial email domain, urgency pressure, request for password.',
     1, 'phishing'),

    ('HR Representative', 'legitimate',
     'Internal company HR contact handling onboarding.',
     'You are a genuine HR representative at TechCorp helping a new employee with onboarding. Be professional, helpful, and never ask for passwords or sensitive credentials. Provide only standard onboarding information.',
     1, 'corporate'),

    ('IT Helpdesk Impersonator', 'threat_actor',
     'Poses as internal IT support to steal credentials.',
     'You are a social engineer pretending to be from the company''s IT helpdesk. Claim there is a security incident and you need the user to verify their credentials. Use technical jargon to sound convincing. Red flags: asking for password, creating false urgency, unofficial communication channel.',
     2, 'pretexting'),

    ('Genuine Customer', 'legitimate',
     'A real customer with a legitimate billing question.',
     'You are a genuine customer named Sarah who has a simple billing question about a double charge on your account. Be polite, provide your account number when asked, and only want the charge corrected. Never ask the support agent for their credentials or internal information.',
     1, 'customer_service'),

    ('CEO Fraud Attacker', 'threat_actor',
     'Impersonates the CEO requesting an urgent wire transfer.',
     'You are a social engineer impersonating the CEO of the company. Send an urgent request for a wire transfer to a vendor. Create pressure by mentioning a tight deadline and asking the employee to keep it confidential. Red flags: unusual request, urgency, secrecy, bypassing normal approval process.',
     3, 'bec'),

    ('Vendor Account Manager', 'legitimate',
     'A known vendor following up on an invoice.',
     'You are a legitimate vendor account manager named James from OfficeSupply Co. You are following up on invoice #4521 that is 15 days overdue. Be professional, reference the correct PO number, and offer to resend the invoice through the usual procurement channel.',
     2, 'vendor');


-- Scenarios (Mode 2 — Gauntlet)
INSERT INTO scenarios (persona_id, mode_type, difficulty, content_json, best_answer, answer_options_json, explanation, scenario_score)
VALUES
    (1, 'gauntlet', 'easy',
     '{"type":"email","sender":"support@bank-secure.com","subject":"Account Verification Required","body":"Dear Customer,\n\nWe have detected unusual activity on your account. Please verify your identity immediately by clicking the link below or your account will be suspended within 24 hours.\n\nVerify Now: http://bank-secure-verify.com/auth\n\nBank Security Team"}',
     'B',
     '["A) Click the link and verify your account", "B) Report the email to your real bank directly", "C) Reply asking for more details", "D) Forward it to coworkers as a warning"]',
     'This is a classic phishing email. The sender domain (bank-secure.com) is not your bank''s real domain, the link goes to a suspicious URL, and the 24-hour deadline creates artificial urgency. Always contact your bank through their official website or phone number.',
     100),

    (2, 'gauntlet', 'easy',
     '{"type":"email","sender":"hr@techcorp.com","subject":"Welcome to TechCorp - Onboarding Info","body":"Hi,\n\nWelcome to TechCorp! Please find your onboarding schedule attached. Your first day orientation is Monday at 9 AM in Conference Room B.\n\nPlease bring a valid photo ID and your signed offer letter.\n\nBest,\nHR Team"}',
     'A',
     '["A) Follow the instructions — this is legitimate", "B) Report it as phishing", "C) Delete the email", "D) Reply asking for the sender''s employee ID"]',
     'This is a legitimate onboarding email. The sender domain matches the company (techcorp.com), the request is reasonable (bring ID and offer letter), there is no urgency pressure, and no sensitive information is being requested.',
     100),

    (3, 'gauntlet', 'medium',
     '{"type":"sms","sender":"+1-555-0142","messages":["Hi, this is Mike from IT. We detected a breach on your work laptop. I need your login credentials to run a security scan remotely. This is urgent — please reply ASAP."]}',
     'C',
     '["A) Send your credentials — IT needs them for the scan", "B) Ignore the message entirely", "C) Call your IT department directly using the official number", "D) Reply asking which breach they detected"]',
     'IT departments will never ask for your password via text message. This is a pretexting attack using urgency and authority. Always verify through official channels by calling your IT helpdesk directly.',
     150),

    (1, 'gauntlet', 'medium',
     '{"type":"webpage","url":"https://arnazon.com/signin","title":"Amazon Sign In","fields":["Email or phone number","Password"],"visual_clues":["Logo slightly pixelated","URL shows arnazon.com not amazon.com","No padlock icon in address bar","Copyright 2019 at bottom"]}',
     'B',
     '["A) Enter your credentials — it looks like Amazon", "B) Close the page — the URL is wrong", "C) Enter a fake password to test it", "D) Search Google for Amazon and compare"]',
     'This is a spoofed login page. The URL is arnazon.com (not amazon.com), the logo is pixelated, there is no SSL padlock, and the copyright is outdated. Always check the URL carefully before entering credentials.',
     150),

    (5, 'gauntlet', 'hard',
     '{"type":"email","sender":"ceo@techcorp.com","subject":"Urgent - Confidential Wire Transfer","body":"Hi,\n\nI need you to process a wire transfer of $47,500 to our new vendor immediately. The details are below. Please handle this personally and don''t mention it to others yet — we''re still finalizing the partnership announcement.\n\nAccount: 2847193650\nRouting: 091000019\nVendor: GlobalTech Solutions\n\nThanks,\nRobert Chen\nCEO, TechCorp"}',
     'C',
     '["A) Process the transfer — it is from the CEO", "B) Reply to the email to confirm the details", "C) Call the CEO directly on their known phone number to verify", "D) Forward it to the finance team"]',
     'This is a CEO fraud / business email compromise (BEC) attack. Red flags include: requesting secrecy, bypassing normal approval processes, urgency, and a wire transfer to an unknown vendor. Always verify large financial requests through a separate communication channel.',
     200);

-- For Streak Implementation
ALTER TABLE users
ADD COLUMN last_login DATE;

-- ============================================================
-- DONE
-- Tables: users, personas, scenarios, sessions, attempts,
--         chat_messages, badges, user_badges
-- Views:  v_session_history, v_chat_history, v_leaderboard
-- Seed:   6 personas, 5 scenarios
-- ============================================================
