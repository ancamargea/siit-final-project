import { useState } from "react";
import { useAuthContext } from "../features/Auth/AuthContext";
import type { User } from "../features/Auth/types";

export default function Profile() {
  const { user, accessToken, login } = useAuthContext();

  const typedUser = user as User | null;

  const [firstName, setFirstName] = useState(typedUser?.firstName ?? "");
  const [lastName, setLastName] = useState(typedUser?.lastName ?? "");
  const [email, setEmail] = useState(typedUser?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();
      login({ accessToken: accessToken!, user: updatedUser });
      setMessage("Profile updated!");
    } catch {
      setMessage("Error updating profile.");
    }

    setLoading(false);
  }

  return (
    <div className="profile-container">
      <main>
        <h1 className="secondary-title">Edit Profile</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <br />
          <label>
            E-mail:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </main>
    </div>
  );
}
