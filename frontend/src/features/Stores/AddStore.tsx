import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const addStoreSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  openHours: z.string().min(1, { message: "Open hours are required" }),
  website: z
    .string()
    .url({ message: "Website must be a valid URL" })
    .optional()
    .or(z.literal("")),
});

type AddStoreData = z.infer<typeof addStoreSchema>;

function AddStore() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddStoreData>({
    name: "",
    city: "",
    address: "",
    description: "",
    openHours: "",
    website: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddStoreData, string>>
  >({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = addStoreSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddStoreData, string>> = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof AddStoreData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setServerError("");
      setSuccessMessage("");
      return;
    }

    setErrors({});
    setServerError("");
    setSuccessMessage("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setServerError("You must be logged in to add a store.");
      return;
    }

    try {
      const user = JSON.parse(atob(token.split(".")[1]));
      const ownerId = user.id;

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
        setServerError("Something went wrong while adding the store.");
        return;
      }

      setSuccessMessage("Store added successfully!");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      console.error("Error creating store:", err);
      setServerError("Failed to add store. Try again.");
    }
  };

  return (
    <div className="add-store-container">
      <h1 className="secondary-title">Add Store</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div>
          <label>Open Hours:</label>
          <input
            type="text"
            name="openHours"
            value={formData.openHours}
            onChange={handleChange}
          />
          {errors.openHours && (
            <p style={{ color: "red" }}>{errors.openHours}</p>
          )}
        </div>

        <div>
          <label>Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
          {errors.website && <p style={{ color: "red" }}>{errors.website}</p>}
        </div>

        <button type="submit">Add Store</button>
      </form>

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
}

export default AddStore;
