import { useEffect, useState } from "react";

type Store = {
  id: number;
  name: string;
  city: string;
  rating?: number;
};

function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/stores")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stores");
        return res.json();
      })
      .then((data) => setStores(data))
      .catch(() => setError("Could not load stores"));
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
              <strong>{store.name}</strong> — {store.city} — Rating:{" "}
              {store.rating ?? "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StoreList;
