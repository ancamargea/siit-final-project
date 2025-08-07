import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../Auth/AuthContext";

interface Review {
  id: number;
  storeId: number;
  userId: number;
  text: string;
  rating: number;
}

interface Store {
  id: number;
  name: string;
  city: string;
}

export default function ReviewStore() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [store, setStore] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setMessage("Invalid store ID.");
      setLoading(false);
      return;
    }

    async function fetchStoreAndReviews() {
      try {
        const storeRes = await fetch(`http://localhost:4000/stores/${id}`);
        if (!storeRes.ok) throw new Error("Failed to fetch store");
        const storeData = await storeRes.json();
        setStore(storeData);

        const reviewsRes = await fetch(
          `http://localhost:4000/reviews?storeId=${Number(id)}`
        );
        if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch {
        setMessage("Could not load store or reviews.");
      } finally {
        setLoading(false);
      }
    }
    fetchStoreAndReviews();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (!newReviewText.trim()) {
      setMessage("Please enter review text.");
      return;
    }

    const ratingNum = Number(newReviewRating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      setMessage("Please enter a valid rating between 1 and 5.");
      return;
    }

    if (!user) {
      setMessage("You must be logged in to add a review.");
      return;
    }

    if (!id || isNaN(Number(id))) {
      setMessage("Invalid store ID.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: Number(id),
          userId: user.id,
          text: newReviewText,
          rating: ratingNum,
        }),
      });

      if (!res.ok) throw new Error("Failed to add review");

      const createdReview = await res.json();
      setReviews((prev) => [...prev, createdReview]);
      setNewReviewText("");
      setNewReviewRating("");
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
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <li key={r.id}>
              <strong>Rating:</strong> {r.rating} <br />
              {r.text}
            </li>
          ))
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Add a review:
          <input
            type="text"
            value={newReviewText}
            required
            onChange={(e) => {
              setNewReviewText(e.target.value);
              setMessage("");
            }}
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
            required
            onChange={(e) => {
              setNewReviewRating(e.target.value);
              setMessage("");
            }}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
