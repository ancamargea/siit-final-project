import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Auth/AuthContext";

export default function EditStore() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuthContext();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [openHours, setOpenHours] = useState("");
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "owner") {
      setMessage("You do not have permission to edit stores.");
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchStore() {
      if (!id || !accessToken) return;

      try {
        const res = await fetch(`http://localhost:4000/stores/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch store");

        const data = await res.json();

        setName(data.name);
        setCity(data.city);
        setAddress(data.address || "");
        setDescription(data.description || "");
        setOpenHours(data.openHours || "");
        setWebsite(data.website || "");
      } catch (err) {
        setMessage("Could not load store.");
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, [id, accessToken]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!accessToken) {
      setMessage("You must be logged in to update the store.");
      return;
    }

    if (!id) {
      setMessage("Store ID is missing.");
      return;
    }

    const updatedStore = {
      name,
      city,
      address,
      description,
      openHours,
      website,
    };

    try {
      const res = await fetch(`http://localhost:4000/stores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedStore),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("Store updated!");
      navigate("/admin");
    } catch {
      setMessage("Something went wrong.");
    }
  }

  if (loading) return <p>Loading store...</p>;
  if (message === "You do not have permission to edit stores.")
    return <p>{message}</p>;
  if (message === "Could not load store.") return <p>{message}</p>;

  return (
    <div className="edit-store-container">
      <h1 className="secondary-title">Edit Store</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Open Hours:
          <input
            type="text"
            value={openHours}
            onChange={(e) => setOpenHours(e.target.value)}
          />
        </label>
        <br />
        <label>
          Website:
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
