import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import analyzeRoutes from "./routes/analyze.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json({ limit: "1mb" }));

// Basic rate limiting on the analyze endpoint since it's the expensive one
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { message: "Too many requests, please slow down." },
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "truthlens-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeLimiter, analyzeRoutes);
app.use("/api/history", historyRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] TruthLens API running on port ${PORT}`);
  });
});
