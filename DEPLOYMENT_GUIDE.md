# ThreatSim — Deployment Guide

## What You Need to Install Locally (for development)

1. **Node.js 18+** — Download from https://nodejs.org
2. **PostgreSQL 14+** — Download from https://www.postgresql.org/download/
3. **Git** — Download from https://git-scm.com (you likely have this already)

That's it locally. No other installs required.

---

## Step 1: Push to GitHub

```bash
cd threatsim
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/threatsim.git
git push -u origin main
```

---

## Step 2: Set Up the Database (Render)

1. Go to https://render.com and sign up (free tier works)
2. Click **New** → **PostgreSQL**
3. Name it `threatsim-db`, select the **Free** plan
4. Once created, copy the **External Database URL** (looks like `postgresql://user:pass@host/dbname`)
5. Connect and run the schema:

```bash
psql "YOUR_EXTERNAL_DATABASE_URL" -f server/db/schema.sql
```

This creates all 9 tables. Account creation will work after this.

---

## Step 3: Deploy the Backend (Render)

1. On Render, click **New** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Name:** `threatsim-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
4. Add these **Environment Variables** (from your .env.example):

| Variable         | Value                                      |
|------------------|--------------------------------------------|
| DB_HOST          | (from your Render PostgreSQL dashboard)     |
| DB_PORT          | 5432                                        |
| DB_NAME          | (from Render)                               |
| DB_USER          | (from Render)                               |
| DB_PASSWORD      | (from Render)                               |
| JWT_SECRET       | (any long random string — keep it secret)   |
| JWT_EXPIRES_IN   | 7d                                          |
| ANTHROPIC_API_KEY| (your Claude API key — needed later for Mode 1) |
| CLIENT_URL       | https://threatsim.vercel.app (update after Step 4) |
| PORT             | 5000                                        |
| NODE_ENV         | production                                  |

5. Click **Deploy**. Note your API URL (e.g., `https://threatsim-api.onrender.com`)

---

## Step 4: Deploy the Frontend (Vercel)

1. Go to https://vercel.com and sign up (free tier works)
2. Click **Add New** → **Project** → Import your GitHub repo
3. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
4. Add one **Environment Variable:**

| Variable              | Value                                      |
|-----------------------|--------------------------------------------|
| VITE_API_URL          | https://threatsim-api.onrender.com         |

5. Click **Deploy**

Your site will be live at: `https://threatsim.vercel.app` (or similar)

---

## Step 5: Connect Frontend to Backend

You need to update the Axios calls in the frontend to use the deployed API URL
instead of the Vite proxy (which only works locally).

Option A — Update vite.config.js proxy target for local dev, and use
an environment variable for production API calls.

Create a file: `client/src/config.js`

```javascript
export const API_URL = import.meta.env.VITE_API_URL || '';
```

Then in your page components, change:
```javascript
// Before
axios.post('/api/auth/login', form)

// After
import { API_URL } from '../config';
axios.post(`${API_URL}/api/auth/login`, form)
```

---

## What Works at Each Stage

| Stage                        | What works                                    |
|------------------------------|-----------------------------------------------|
| Frontend only (Vercel)       | Landing page, glossary, UI navigation         |
| + Backend + DB (Render)      | Account creation, login, profile, JWT auth    |
| + Claude API key             | Mode 1 chat (when you build it), Mode 2 AI eval |
| + Seed data                  | Full demo with personas and scenarios         |

---

## Running Locally (for development)

Terminal 1 — Database:
```bash
createdb threatsim
psql -d threatsim -f server/db/schema.sql
```

Terminal 2 — Backend:
```bash
cd server
cp ../.env.example .env    # then edit with your local DB credentials
npm install
npm run dev                 # runs on http://localhost:5000
```

Terminal 3 — Frontend:
```bash
cd client
npm install
npm run dev                 # runs on http://localhost:5173
```

The Vite proxy in vite.config.js forwards /api requests to localhost:5000
automatically, so everything works together locally.

---

## Cost

Everything on the free tier:
- **Vercel** — Free for personal projects
- **Render** — Free PostgreSQL (90 days) + Free web service
- **GitHub** — Free for public/private repos
- **Anthropic Claude API** — You'll need API credits for Mode 1 (check pricing)

---

## Quick Checklist Before Going Live

- [ ] GitHub repo pushed with all files
- [ ] Render PostgreSQL created and schema.sql executed
- [ ] Render Web Service deployed with env vars set
- [ ] Vercel project deployed with VITE_API_URL set
- [ ] Test: register a new account on the live site
- [ ] Test: log in with that account
- [ ] Test: verify all pages load correctly
- [ ] Update CLIENT_URL on Render to match your Vercel URL (for CORS)
