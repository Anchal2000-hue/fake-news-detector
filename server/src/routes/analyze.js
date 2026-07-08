import express from "express";
import { protect } from "../middleware/auth.js";
import { analyzeWithGroq } from "../services/groqService.js";
import { extractTextFromUrl } from "../services/extractService.js";
import {
  getDomainFromUrl,
  scoreDomain,
  clampScore,
} from "../services/credibilityService.js";
import Check from "../models/Check.js";

const router = express.Router();

function isUrl(input) {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

router.post("/", protect, async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== "string" || input.trim().length < 10) {
      return res
        .status(400)
        .json({ message: "Please provide at least a sentence of text, or a valid URL." });
    }

    const trimmed = input.trim();
    const inputType = isUrl(trimmed) ? "url" : "text";

    let textToAnalyze = trimmed;
    let sourceDomain = null;

    if (inputType === "url") {
      sourceDomain = getDomainFromUrl(trimmed);
      const { text } = await extractTextFromUrl(trimmed);
      textToAnalyze = text;
    }

    const result = await analyzeWithGroq(textToAnalyze);

    let finalCredibility = result.credibilityScore;
    let domainNote = null;
    if (sourceDomain) {
      const { adjustment, note } = scoreDomain(sourceDomain);
      finalCredibility = clampScore(finalCredibility + adjustment);
      domainNote = note;
    }

    const explanation = domainNote
      ? `${result.explanation} ${domainNote}`
      : result.explanation;

    const check = await Check.create({
      user: req.userId,
      inputType,
      inputRaw: trimmed,
      extractedText: inputType === "url" ? textToAnalyze : undefined,
      verdict: result.verdict,
      confidence: result.confidence,
      credibilityScore: finalCredibility,
      explanation,
      redFlags: result.redFlags,
      sourceDomain,
    });

    res.status(201).json(check);
  } catch (err) {
    console.error("[analyze] error:", err.message);
    res.status(500).json({ message: err.message || "Analysis failed" });
  }
});

export default router;
