import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";

type Review = {
  id: string;
  userId: string;
  text: string;
  rating: number;
};

type Store = {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  openHours: string;
  rating: number;
  website?: string;
  reviews?: Review[];
};

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [message, setMessage] = useState("");

  async function fetchStore() {
    try {
      const storeRes = await fetch(`http://localhost:4000/stores/${id}`);
      if (!storeRes.ok) throw new Error("Failed to fetch store details");
      const storeData = await storeRes.json();

      const reviewsRes = await fetch(
        `http://localhost:4000/reviews?storeId=${id}`
      );
      if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
      const reviewsData = await reviewsRes.json();

      storeData.reviews = reviewsData;
      setStore(storeData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchStore().finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newReviewText.trim() || newReviewRating <= 0) {
      setMessage("Please enter a review text and a rating greater than 0.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          text: newReviewText,
          rating: newReviewRating,
          storeId: Number(id), // ensures it's saved as a number
        }),
      });

      if (!res.ok) throw new Error("Failed to add review");

      setNewReviewText("");
      setNewReviewRating(0);
      setMessage("Review added!");

      await fetchStore();
    } catch {
      setMessage("Failed to add review.");
    }
  }

  if (loading) return <p>Loading store details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!store) return <p>No store found.</p>;

  return (
    <div>
      <h2>{store.name}</h2>
      <p>
        <strong>City:</strong> {store.city}
      </p>
      <p>
        <strong>Address:</strong> {store.address}
      </p>
      <p>
        <strong>Description:</strong> {store.description}
      </p>
      <p>
        <strong>Open Hours:</strong> {store.openHours}
      </p>
      <p>
        <strong>Rating:</strong> {store.rating.toFixed(1)}
      </p>
      {store.website && (
        <p>
          <a href={store.website} target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
        </p>
      )}

      <h3>Reviews</h3>
      <ul>
        {store.reviews && store.reviews.length > 0 ? (
          store.reviews.map((r) => (
            <li key={r.id}>
              <strong>Rating:</strong> {r.rating} <br />
              {r.text}
            </li>
          ))
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit}>
          <h4>Add your review</h4>
          <label>
            Review:
            <input
              type="text"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
            />
          </label>
          <br />
          <label>
            Rating (1-5):
            <input
              type="number"
              min={1}
              max={5}
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(Number(e.target.value))}
            />
          </label>
          <br />
          <button type="submit">Submit Review</button>
          {message && <p>{message}</p>}
        </form>
      ) : (
        <p>You must be logged in to leave a review.</p>
      )}
    </div>
  );
}
