import { useState } from "react";
import api from "../api/axios";
import ResultCard from "../components/ResultCard";

export default function Analyze() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post("/analyze", { input: input.trim() });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="analyze-page">
      <div className="analyze-intro">
        <h1>Check a claim or article</h1>
        <p>Paste the text of a news story, a claim, or a URL to an article.</p>
      </div>

      <form className="analyze-form" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste article text, a claim, or a URL (https://...)"
          rows={7}
          required
        />
        <div className="analyze-form-footer">
          <span className="char-count">{input.length} characters</span>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Reading and cross-checking the content…</p>
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
