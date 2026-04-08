# ThreatSim

LIVE URL FOR VERCEL LINK: https://cit-seminar-final-project.vercel.app/


**Dual-Mode Cyber Threat Simulation & Awareness Training Platform**

A full-stack cybersecurity awareness web application built around two distinct AI-powered training modes, tied to persistent user accounts with session history and a difficulty modifier system.

## Modes

- **Mode 1 — Interrogation Room**: Live chat with an AI character (powered by Claude API). Detect if they're a social engineer or a genuine customer.
- **Mode 2 — Threat Gauntlet**: Timed sequence of cybersecurity scenario cards (email, SMS, webpage, baiting). Pick the safest course of action.

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React, React Router, Tailwind CSS, Axios        |
| Backend    | Node.js, Express.js, JWT, bcrypt                |
| Database   | PostgreSQL                                      |
| AI         | Anthropic Claude API                            |
| Deployment | Vercel (frontend) + Render (backend + Postgres) |

## Project Structure

```
threatsim/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── data/           # Static data (glossary JSON)
│   │   ├── styles/         # Global CSS
│   │   ├── config.js       # API URL config
│   │   └── App.jsx         # Router + layout
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth middleware
│   ├── db/                 # Schema + seed data
│   ├── config/             # Database connection
│   ├── server.js           # Entry point
│   └── package.json
├── .gitignore
├── .env.example
└── README.md
```

## Database (8 tables)

| Table          | Purpose                                    |
| -------------- | ------------------------------------------ |
| users          | Accounts with roles (learner/admin)        |
| personas       | AI character configs for Mode 1            |
| scenarios      | Mode 2 scenario cards with content_json    |
| sessions       | Training sessions for both modes           |
| attempts       | Individual scenario attempts within sessions |
| chat_messages  | Mode 1 conversation messages with flagging |
| badges         | Achievement definitions (stretch)          |
| user_badges    | User-badge junction table (stretch)        |

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- PostgreSQL 14+
- Git

### Setup

```bash
git clone https://github.com/your-username/threatsim.git
cd threatsim

# Create database
psql -U postgres
CREATE DATABASE threatsim;
\q

# Run schema
psql -U postgres -d threatsim -f server/db/schema.sql

# Backend
cd server
cp ../.env.example .env   # Edit with your credentials
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Team — Zero Day Crew

| Name           | Role                                   |
|---------------|----------------------------------------|
| Anthony Rojas | Project Manager / Full-Stack Developer  |
| Milind Patel  | Frontend (React UI) & Mode 1 AI Scoring |
| Jerome Vallido| Backend / Database Administrator        |

## Course

IT Capstone | CS4500-001 | Spring 2026
