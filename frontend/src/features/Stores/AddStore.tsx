import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStore() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    description: "",
    openHours: "",
    rating: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch("http://localhost:4000/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, rating: Number(formData.rating) }),
      });

      if (!res.ok) {
        alert("Something went wrong");
        return;
      }

      navigate("/stores");
    } catch (err) {
      console.error("Error creating store:", err);
    }
  };

  return (
    <div>
      <h2>Add Store</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="openHours"
          placeholder="Open Hours"
          value={formData.openHours}
          onChange={handleChange}
        />
        <input
          name="rating"
          type="number"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
        />
        <input
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddStore;
