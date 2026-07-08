// A lightweight, transparent heuristic layer that complements the LLM's
// judgement with a known-domain reputation signal. This is intentionally
// simple — it nudges the final credibility score, it doesn't decide it alone.

const HIGH_CREDIBILITY_DOMAINS = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "bbc.co.uk",
  "npr.org",
  "nature.com",
  "sciencedirect.com",
  "who.int",
  "un.org",
  "gov.in",
  "gov.uk",
  "nytimes.com",
  "theguardian.com",
  "wsj.com",
  "thehindu.com",
  "indianexpress.com",
];

const LOW_CREDIBILITY_SIGNALS = [
  "blogspot.com",
  "wordpress.com",
  ".xyz",
  ".click",
  ".info",
];

export function getDomainFromUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function scoreDomain(domain) {
  if (!domain) return { adjustment: 0, note: null };

  const isHighCred = HIGH_CREDIBILITY_DOMAINS.some((d) => domain.endsWith(d));
  if (isHighCred) {
    return {
      adjustment: 10,
      note: `${domain} is a widely recognized, editorially-reviewed news source.`,
    };
  }

  const isLowCred = LOW_CREDIBILITY_SIGNALS.some((d) => domain.includes(d));
  if (isLowCred) {
    return {
      adjustment: -15,
      note: `${domain} matches patterns often associated with low-oversight publishing platforms.`,
    };
  }

  return { adjustment: 0, note: null };
}

export function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
