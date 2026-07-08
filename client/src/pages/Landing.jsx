import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <div className="landing-hero">
        <p className="eyebrow">AI-powered media literacy</p>
        <h1>
          See past the headline.
          <br />
          <em>Verify before you believe.</em>
        </h1>
        <p className="lede">
          TruthLens analyzes news articles and claims using LLaMA 3.3, scoring
          credibility, flagging manipulation patterns, and explaining its
          reasoning in plain language — in seconds.
        </p>
        <div className="hero-actions">
          <Link to={user ? "/analyze" : "/signup"} className="btn-primary">
            {user ? "Analyze something" : "Get started free"}
          </Link>
          <Link to="/login" className="btn-ghost">
            {user ? "" : "I already have an account"}
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <span className="feature-num">01</span>
          <h3>Paste text or a URL</h3>
          <p>Drop in an article link or paste the claim directly — no setup needed.</p>
        </div>
        <div className="feature-card">
          <span className="feature-num">02</span>
          <h3>AI-driven analysis</h3>
          <p>
            LLaMA 3.3 examines language patterns, sourcing, and consistency to
            reach a verdict.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">03</span>
          <h3>Credibility score</h3>
          <p>
            Get a 0–100 score, confidence level, and red flags — plus a
            domain-reputation signal for URLs.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">04</span>
          <h3>Track your history</h3>
          <p>Every check is saved to your account so you can revisit past analyses.</p>
        </div>
      </div>
    </div>
  );
}
