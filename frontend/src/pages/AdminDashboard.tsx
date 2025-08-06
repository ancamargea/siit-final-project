import { useEffect, useState } from "react";

type Store = {
  id: number;
  name: string;
  city: string;
};

type Review = {
  id: number;
  storeId: number;
  rating: number;
};

function AdminDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to view this page.");
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
      .then((data) => setStores(data))
      .catch(() => setError("Failed to load stores"));

    // Fetch all reviews
    fetch("http://localhost:4000/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setError("Failed to load reviews"));
  }, []);

  if (error) return <p>{error}</p>;
}

export default AdminDashboard;
