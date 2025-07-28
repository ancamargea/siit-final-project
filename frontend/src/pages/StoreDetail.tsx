import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Store = {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  openHours: string;
  rating: number;
  website?: string;
};

function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch(`http://localhost:4000/stores/${id}`);
        if (!res.ok) throw new Error("Failed to fetch store details");
        const data = await res.json();
        setStore(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [id]);

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
    </div>
  );
}

export default StoreDetail;
