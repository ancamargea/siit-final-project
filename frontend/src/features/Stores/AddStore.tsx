import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStore() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    openHours: "",
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
    if (!token) {
      alert("You must be logged in to add a store.");
      return;
    }

    // Decode token to get user id (ownerId)
    const user = JSON.parse(atob(token.split(".")[1]));
    const ownerId = user.id;

    try {
      const res = await fetch("http://localhost:4000/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          ownerId,
        }),
      });

      if (!res.ok) {
        alert("Something went wrong while adding the store.");
        return;
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error creating store:", err);
      alert("Failed to add store. Try again.");
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
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
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
