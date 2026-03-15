# ThreatSim

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
│   │   ├── data/           # Static data (glossary JSON, etc.)
│   │   ├── styles/         # Global CSS
│   │   └── App.jsx         # Router + layout
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth middleware
│   ├── db/                 # Schema + seed files
│   ├── config/             # Environment config
│   ├── server.js           # Entry point
│   └── package.json
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Anthropic API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/threatsim.git
cd threatsim
```

### 2. Set up the database

```bash
# Create the database
createdb threatsim

# Run the schema
psql -U postgres -d threatsim -f server/db/schema.sql

# (Optional) Seed with test data
psql -U postgres -d threatsim -f server/db/seed.sql
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

### 4. Start the backend

```bash
cd server
npm install
npm run dev
```

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:5000`.

## Team

| Name            | Role                                          |
| --------------- | --------------------------------------------- |
| Anthony Rojas   | Project Manager / Full-Stack Developer         |
| Milind Patel    | Frontend Developer (React UI)                 |
| Jerome Vallido  | Backend Developer / Database Administrator     |

## License

This project is part of the IT Capstone (CS4500-001) at [University Name], Spring 2026.
