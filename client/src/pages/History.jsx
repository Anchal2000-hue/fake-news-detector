import { useEffect, useState } from "react";
import api from "../api/axios";
import ResultCard from "../components/ResultCard";

export default function History() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/history");
      setItems(data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/history/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      // silently ignore, list will still show accurate state on next reload
    }
  }

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;

  return (
    <div className="history-page">
      <h1>Your history</h1>

      {error && <div className="alert-error">{error}</div>}

      {items.length === 0 && !error && (
        <p className="empty-state">No checks yet. Analyze something to see it here.</p>
      )}

      <div className="history-layout">
        <ul className="history-list">
          {items.map((item) => (
            <li
              key={item._id}
              className={`history-item ${selected?._id === item._id ? "active" : ""}`}
              onClick={() => setSelected(item)}
            >
              <div className="history-item-main">
                <span className={`verdict-dot verdict-${item.verdict.replace(/\W+/g, "-")}`} />
                <div>
                  <p className="history-item-title">
                    {(item.extractedText || item.inputRaw).slice(0, 80)}
                    {(item.extractedText || item.inputRaw).length > 80 ? "…" : ""}
                  </p>
                  <span className="history-item-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className="btn-ghost-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item._id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="history-detail">
          {selected ? (
            <ResultCard result={selected} />
          ) : (
            <p className="empty-state">Select a check to see full details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
