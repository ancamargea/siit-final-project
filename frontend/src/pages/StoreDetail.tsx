import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../features/Auth/AuthContext";

type Review = {
  id: number;
  userId: number;
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
  website?: string;
  reviews?: Review[];
};

function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [message, setMessage] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  const currentUserId = user ? Number(user.id) : null;

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
      setError("");
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
          userId: currentUserId,
          text: newReviewText,
          rating: newReviewRating,
          storeId: Number(id),
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

  async function handleDeleteReview(reviewId: number) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(`http://localhost:4000/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setMessage("Review deleted.");
      await fetchStore();
    } catch {
      setMessage("Failed to delete review.");
    } finally {
      setDeletingReviewId(null);
    }
  }

  // Calculate average rating from reviews
  const averageRating =
    store?.reviews && store.reviews.length > 0
      ? store.reviews.reduce((acc, r) => acc + r.rating, 0) /
        store.reviews.length
      : null;

  if (loading) return <p className="loading">Loading store details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!store) return <p className="no-store">No store found.</p>;

  return (
    <div className="store-detail">
      <h2 className="store-name">{store.name}</h2>

      <div className="store-info">
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
        <p className="store-rating">
          <strong>Rating:</strong>{" "}
          {averageRating !== null ? averageRating.toFixed(1) : "No reviews yet"}
        </p>
        {store.website && (
          <p className="store-website">
            <a href={store.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </p>
        )}
      </div>

      <section className="reviews-section">
        <h3>Reviews</h3>
        <ul className="reviews-list">
          {store.reviews && store.reviews.length > 0 ? (
            store.reviews.map((r) => (
              <li key={r.id} className="review-item">
                <p>
                  <strong>Rating:</strong> {r.rating}
                </p>
                <p className="review-text">{r.text}</p>
                {currentUserId === r.userId && (
                  <button
                    className="delete-review-btn"
                    onClick={() => handleDeleteReview(r.id)}
                    disabled={deletingReviewId === r.id}
                  >
                    {deletingReviewId === r.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </li>
            ))
          ) : (
            <li>No reviews yet.</li>
          )}
        </ul>
      </section>

      {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          <h4>Add your review</h4>
          <label htmlFor="review-text">
            Review:
            <input
              id="review-text"
              type="text"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="review-input"
            />
          </label>
          <br />
          <label htmlFor="review-rating">
            Rating (1-5):
            <input
              id="review-rating"
              type="number"
              min={1}
              max={5}
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(Number(e.target.value))}
              className="rating-input"
            />
          </label>
          <br />
          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>
      ) : (
        <p className="login-message">
          You must be logged in to leave a review.
        </p>
      )}
    </div>
  );
}

export default StoreDetail;
