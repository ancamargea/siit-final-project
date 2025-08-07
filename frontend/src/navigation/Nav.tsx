import { Link } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";

export function Nav() {
  const { user, logout } = useAuthContext();

  function handleLogout() {
    logout();
  }

  return (
    <nav className="nav-container">
      {/* Left side - Home and Stores */}
      <ul className="nav-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/stores">Stores</Link>
        </li>
      </ul>

      {/* Right side - Auth Links */}
      <ul className="nav-right">
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
            {/* Show Admin Dashboard link only if user role is "owner" */}
            {user.role === "owner" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
