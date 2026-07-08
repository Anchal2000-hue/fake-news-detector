import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Fetches a URL and pulls out the main readable text using simple
// heuristics (article/p tags). Not a full readability engine, but
// good enough for most news articles.
export async function extractTextFromUrl(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; TruthLensBot/1.0; +https://truthlens.app)",
    },
    timeout: 10000,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL (status ${res.status})`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, aside, noscript").remove();

  let container = $("article");
  if (container.length === 0) container = $("main");
  if (container.length === 0) container = $("body");

  const paragraphs = container
    .find("p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((p) => p.length > 40);

  const text = paragraphs.join("\n\n").slice(0, 8000);

  if (!text || text.length < 100) {
    throw new Error(
      "Could not extract enough readable text from this URL. Try pasting the article text directly."
    );
  }

  const title = $("title").first().text().trim();

  return { text, title };
}
