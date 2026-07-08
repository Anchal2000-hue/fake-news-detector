# TruthLens

AI-powered fake news detector. Paste a claim, article text, or URL — TruthLens uses
Groq's LLaMA 3.3 to assess credibility, explain its reasoning, and flag manipulation
patterns. Built with the MERN stack.

## Stack

- **Frontend**: React 18 + Vite, React Router, Axios
- **Backend**: Node.js + Express, MongoDB (Mongoose), JWT auth
- **AI**: Groq API (LLaMA 3.3 70B) for analysis, Cheerio for URL text extraction

## Project structure

```
truthlens/
  server/     Express API
  client/     React frontend (Vite)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB connection string (local MongoDB or a free MongoDB Atlas cluster)
- A Groq API key — free at https://console.groq.com

## 2. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `GROQ_API_KEY` — your Groq API key
- `GROQ_MODEL` — defaults to `llama-3.3-70b-versatile`

Install and run:

```bash
npm install
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## 3. Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to the API at the URL set in
`VITE_API_URL`.

## 4. API overview

| Method | Route              | Auth | Description                          |
|--------|---------------------|------|---------------------------------------|
| POST   | /api/auth/signup     | No   | Create account                        |
| POST   | /api/auth/login       | No   | Log in, returns JWT                   |
| POST   | /api/analyze          | Yes  | Analyze text or URL                   |
| GET    | /api/history           | Yes  | List past checks (paginated)          |
| GET    | /api/history/:id       | Yes  | Get one check                         |
| DELETE | /api/history/:id       | Yes  | Delete a check                        |

Auth uses `Authorization: Bearer <token>`.

## 5. Deployment notes

- **Backend**: Render, Railway, or Fly.io work well for the Express API. Set the same
  env vars from `.env` in your host's dashboard.
- **Frontend**: Deploy to Vercel or Netlify. Set `VITE_API_URL` to your deployed
  backend URL, and set `CLIENT_URL` on the backend to your deployed frontend URL
  (for CORS).
- **Database**: MongoDB Atlas free tier is enough to get started.

## 6. How the analysis works

1. If the input is a URL, the backend fetches the page and extracts the main
   article text via Cheerio.
2. The extracted (or pasted) text is sent to Groq's LLaMA 3.3 with a structured
   prompt asking for a JSON verdict: `Likely Real`, `Likely Fake`, `Uncertain`, or
   `Satire/Opinion`, plus a confidence score, credibility score, explanation, and
   red flags.
3. If the input was a URL, a lightweight domain-reputation heuristic nudges the
   credibility score up or down for well-known or low-oversight domains.
4. The result is saved to the user's history and returned to the frontend.

## Next steps you might want

- Swap the domain heuristic list for a real API (e.g. NewsGuard) for more coverage.
- Add rate limiting per-user instead of per-IP.
- Add social sharing of a (redacted) result card.
- Add an admin view across all users' checks for moderation/analytics.
