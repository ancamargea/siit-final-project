import { Link } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";

export function Nav() {
  const { user, logout } = useAuthContext();

  function handleLogout() {
    logout();
  }

  return (
    <nav className="nav-container">
      {/* Left side - Site Title */}
      <div className="nav-left">
        <h1 className="site-title">
          <Link to="/">SpinPoint</Link>
        </h1>
      </div>

      {/* Right side - Links */}
      <ul className="nav-right">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/stores">Stores</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            {user.role === "owner" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
