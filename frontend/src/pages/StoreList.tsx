import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Review = {
  id: string;
  storeId: number;
  rating: number;
};

type Store = {
  id: number;
  name: string;
  city: string;
};

type StoreWithRating = Store & {
  averageRating: number | null;
};

function StoreList() {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStoresAndReviews() {
      try {
        const [storeRes, reviewRes] = await Promise.all([
          fetch("http://localhost:4000/stores"),
          fetch("http://localhost:4000/reviews"),
        ]);

        if (!storeRes.ok || !reviewRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const storeData: Store[] = await storeRes.json();
        const reviewData: Review[] = await reviewRes.json();

        const storeWithRatings: StoreWithRating[] = storeData.map((store) => {
          const storeReviews = reviewData.filter((r) => r.storeId === store.id);
          const averageRating =
            storeReviews.length > 0
              ? storeReviews.reduce((sum, r) => sum + r.rating, 0) /
                storeReviews.length
              : null;

          return {
            ...store,
            averageRating,
          };
        });

        setStores(storeWithRatings);
      } catch (err) {
        console.error(err);
        setError("Could not load stores");
      }
    }

    fetchStoresAndReviews();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Stores</h2>
      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <ul>
          {stores.map((store) => (
            <li key={store.id}>
              <Link to={`/stores/${store.id}`}>
                <strong>{store.name}</strong>
              </Link>{" "}
              — {store.city} — Rating:{" "}
              {store.averageRating !== null
                ? store.averageRating.toFixed(1)
                : "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StoreList;
