import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Review {
  id: string;
  text: string;
}

interface Store {
  id: string;
  name: string;
  city: string;
  reviews: Review[];
}

export default function ReviewStore() {
  const { id } = useParams<{ id: string }>();

  const [store, setStore] = useState<Store | null>(null);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch(`http://localhost:4000/vinylStores/${id}`);
        if (!res.ok) throw new Error("Failed to fetch store");
        const data = await res.json();
        setStore(data);
      } catch {
        setMessage("Could not load store.");
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:4000/vinylStores/${id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newReview }),
        }
      );

      if (!res.ok) throw new Error("Failed to add review");

      // After adding, refresh store data
      const updatedStore = await res.json();
      setStore(updatedStore);
      setNewReview("");
      setMessage("Review added!");
    } catch {
      setMessage("Failed to add review.");
    }
  }

  if (loading) return <p>Loading store reviews...</p>;

  if (!store) return <p>{message || "Store not found."}</p>;

  return (
    <div>
      <h2>Reviews for {store.name}</h2>

      <ul>
        {store.reviews?.length > 0 ? (
          store.reviews.map((r) => <li key={r.id}>{r.text}</li>)
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Add a review:
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
