import Groq from "groq-sdk";

let client = null;
function getClient() {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

const SYSTEM_PROMPT = `You are TruthLens, a careful, evidence-driven media literacy assistant.
You analyze a piece of news text and assess how likely it is to be genuine, misleading, fabricated, or satire/opinion.

You must respond with ONLY a valid JSON object, no preamble, no markdown fences, matching exactly this shape:

{
  "verdict": "Likely Real" | "Likely Fake" | "Uncertain" | "Satire/Opinion",
  "confidence": <integer 0-100, how confident you are in the verdict>,
  "credibilityScore": <integer 0-100, overall trustworthiness of the content>,
  "explanation": "<2-4 sentence plain-language explanation of your reasoning>",
  "redFlags": ["<short phrase>", "..."]
}

Guidelines:
- Base your judgement on internal consistency, emotional/sensational language, unverifiable or extraordinary claims, missing sourcing/attribution, logical fallacies, and known misinformation patterns.
- If the text is clearly opinion, satire, or a personal blog rant rather than a factual news claim, use "Satire/Opinion".
- If you genuinely cannot tell, use "Uncertain" rather than guessing.
- redFlags should be short phrases (3-6 words each), maximum 5 items, empty array if none found.
- Never fabricate facts about the story to "verify" it — reason about the text itself, not real-world knowledge you're unsure of.
- Do not include any text outside the JSON object.`;

export async function analyzeWithGroq(text) {
  const groq = getClient();
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analyze the following text:\n\n"""${text.slice(0, 6000)}"""`,
      },
    ],
    temperature: 0.2,
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty response from Groq API");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse model response as JSON");
  }

  const allowedVerdicts = ["Likely Real", "Likely Fake", "Uncertain", "Satire/Opinion"];
  if (!allowedVerdicts.includes(parsed.verdict)) {
    parsed.verdict = "Uncertain";
  }
  parsed.confidence = clampInt(parsed.confidence, 50);
  parsed.credibilityScore = clampInt(parsed.credibilityScore, 50);
  parsed.explanation = parsed.explanation || "No explanation was provided by the model.";
  parsed.redFlags = Array.isArray(parsed.redFlags) ? parsed.redFlags.slice(0, 5) : [];

  return parsed;
}

function clampInt(val, fallback) {
  const n = Number.parseInt(val, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, n));
}
