import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Store = {
  id: number;
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

    const user = JSON.parse(atob(token.split(".")[1]));
    const ownerId = user.id;

    fetch(`http://localhost:4000/stores?ownerId=${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setStores)
      .catch(() => setError("Failed to load stores"));

    fetch("http://localhost:4000/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setError("Failed to load reviews"));
  }, []);

  function getStoreReviews(storeId: number) {
    const storeReviews = reviews.filter((r) => r.storeId === storeId);
    const total = storeReviews.length;
    if (total === 0) return { total: 0, average: "0.0" };
    const sum = storeReviews.reduce((acc, r) => acc + r.rating, 0);
    return { total, average: (sum / total).toFixed(1) };
  }

  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="container">
      <div className="site-header">
        <h2>Your Stores</h2>
        <Link to="/admin/add-store" className="button-primary">
          Add New Store
        </Link>
      </div>

      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <ul className="store-list">
          {stores.map((store) => {
            const { total, average } = getStoreReviews(store.id);
            return (
              <li key={store.id} className="store-card">
                <h3>{store.name}</h3>
                <p>City: {store.city}</p>
                <p>
                  Reviews: {total} | Avg Rating: {average}
                </p>
                <Link
                  to={`/stores/${store.id}/edit`}
                  className="button-secondary"
                >
                  Edit Store
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
