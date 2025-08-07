import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      // Save token & user info to context
      login({ accessToken: data.accessToken, user: data.user });

      // Redirect based on role
      if (data.user.role === "owner") {
        navigate("/admin"); // AdminDashboard route
      } else {
        navigate("/profile"); // Regular user
      }
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  }

  return (
    <main>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </main>
  );
}
