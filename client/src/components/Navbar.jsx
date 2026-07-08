import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">◈</span>
        <span>TruthLens</span>
      </Link>
      <nav className="nav-links">
        {user ? (
          <>
            <Link to="/analyze">Analyze</Link>
            <Link to="/history">History</Link>
            <span className="nav-user">{user.name.split(" ")[0]}</span>
            <button className="btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn-primary-sm">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
