# TruthLens

AI-powered fake news detector. Paste a claim, article text, or URL — TruthLens uses
Groq's LLaMA 3.3 to assess credibility, explain its reasoning, and flag manipulation
patterns. Built with the MERN stack.

**Live app**: https://fake-news-detector-gules.vercel.app
**Live API**: https://fake-news-detector-6xf5.onrender.com/api/health

> Note: the backend is hosted on Render's free tier, which spins down after
> inactivity. The first request after idle time may take 30–50 seconds while it
> wakes up — this is expected, not a bug.

## Stack

- **Frontend**: React 18 + Vite, React Router, Axios — deployed on Vercel
- **Backend**: Node.js + Express, MongoDB (Mongoose), JWT auth — deployed on Render
- **Database**: MongoDB Atlas
- **AI**: Groq API (LLaMA 3.3 70B) for analysis, Cheerio for URL text extraction

## Features

- Paste article text or a URL to get an instant credibility analysis
- Verdict (Likely Real / Likely Fake / Uncertain / Satire-Opinion), confidence score,
  and credibility score
- Plain-language explanation and detected red flags
- Domain-reputation heuristic that nudges scores for well-known or low-oversight
  news domains
- User accounts with saved history of past checks

## Running locally

### Prerequisites

- Node.js 18+
- A MongoDB connection string
- A Groq API key — free at https://console.groq.com

### Backend setupcd server
cp .env.example .env
npm install
npm run devFill in `.env` with `MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `GROQ_MODEL`,
`CLIENT_URL` before running. API runs on `http://localhost:5000`.

### Frontend setupcd client
cp .env.example .env
npm install
npm run devRuns on `http://localhost:5173`.

## API overview

| Method | Route            | Auth | Description                    |
|--------|------------------|------|---------------------------------|
| POST   | /api/auth/signup | No   | Create account                  |
| POST   | /api/auth/login  | No   | Log in, returns JWT             |
| POST   | /api/analyze     | Yes  | Analyze text or URL             |
| GET    | /api/history     | Yes  | List past checks (paginated)    |
| DELETE | /api/history/:id | Yes  | Delete a check                  |

## Deployment

- **Backend (Render)**: Root Directory `server`, Build `npm install`, Start `npm start`.
  Env vars: `MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `GROQ_MODEL`, `CLIENT_URL`.
- **Frontend (Vercel)**: Root Directory `client`. Env var: `VITE_API_URL` set to
  `<render-url>/api`.
- **Database**: MongoDB Atlas free M0 tier.

## How the analysis works

1. URL input → article text extracted via Cheerio.
2. Text sent to Groq's LLaMA 3.3 with a structured prompt requesting verdict,
   confidence, credibility score, explanation, and red flags as JSON.
3. Domain-reputation heuristic nudges the credibility score for known domains.
4. Result saved to the user's history and returned to the frontend.
