const VERDICT_STYLES = {
  "Likely Real": { color: "var(--good)", label: "Likely Real" },
  "Likely Fake": { color: "var(--bad)", label: "Likely Fake" },
  Uncertain: { color: "var(--warn)", label: "Uncertain" },
  "Satire/Opinion": { color: "var(--info)", label: "Satire / Opinion" },
};

export default function ResultCard({ result }) {
  const style = VERDICT_STYLES[result.verdict] || VERDICT_STYLES.Uncertain;

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="verdict-badge" style={{ "--verdict-color": style.color }}>
          {style.label}
        </span>
        <span className="result-date">
          {new Date(result.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="score-row">
        <ScoreGauge label="Credibility" value={result.credibilityScore} />
        <ScoreGauge label="Confidence" value={result.confidence} />
      </div>

      <p className="result-explanation">{result.explanation}</p>

      {result.redFlags?.length > 0 && (
        <div className="red-flags">
          <h4>Flags detected</h4>
          <ul>
            {result.redFlags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {result.sourceDomain && (
        <div className="source-domain">Source: {result.sourceDomain}</div>
      )}

      <details className="raw-input-details">
        <summary>View analyzed content</summary>
        <p>{result.extractedText || result.inputRaw}</p>
      </details>
    </div>
  );
}

function ScoreGauge({ label, value }) {
  return (
    <div className="score-gauge">
      <div className="gauge-ring" style={{ "--pct": value }}>
        <span>{value}</span>
      </div>
      <span className="gauge-label">{label}</span>
    </div>
  );
}
