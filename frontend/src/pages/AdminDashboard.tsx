import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Store = {
  storeId: number;
  name: string;
  city: string;
};

type Review = {
  reviewId: number;
  storeId: number;
  rating: number;
};

function AdminDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    // Decode token to get user id
    const user = JSON.parse(atob(token.split(".")[1]));
    const ownerId = user.id;

    // Fetch stores owned by this user
    fetch(`http://localhost:4000/stores?ownerId=${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setStores)
      .catch(() => setError("Failed to load stores"));

    // Fetch all reviews
    fetch("http://localhost:4000/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setError("Failed to load reviews"));
  }, []);

  if (error) return <p>{error}</p>;

  // Calculate total reviews and average rating for a store
  function getStoreReviews(storeId: number) {
    const storeReviews = reviews.filter((r) => r.storeId === storeId);
    const total = storeReviews.length;
    if (total === 0) return { total: 0, average: "0.0" };
    const sum = storeReviews.reduce((acc, r) => acc + r.rating, 0);
    return { total, average: (sum / total).toFixed(1) };
  }

  // Stores list and their reviews info
  return (
    <div>
      <h2>Your Stores</h2>
      <Link to="/admin/add-store">
        <button style={{ marginBottom: "1rem" }}>Add New Store</button>
      </Link>

      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <ul>
          {stores.map((store) => {
            const { total, average } = getStoreReviews(store.storeId);
            return (
              <li key={store.storeId} style={{ marginBottom: "1rem" }}>
                <strong>{store.name}</strong> — {store.city}
                <br />
                Reviews: {total} | Avg Rating: {average}
                <br />
                <Link to={`/admin/edit-store/${store.storeId}`}>
                  <button>Edit</button>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
