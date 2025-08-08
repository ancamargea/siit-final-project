import { useState } from "react";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.enum(["user", "owner"]),
});

type RegisterData = z.infer<typeof registerSchema>;

function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState(""); // for backend errors

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterData, string>> = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof RegisterData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setSuccessMessage("");
      setServerError("");
      return;
    }

    setErrors({});
    setServerError("");

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message || `Failed to register: ${response.statusText}`;
        setServerError(message);
        setSuccessMessage("");
        return;
      }

      // Registration success
      setSuccessMessage("Registration successful! You can now log in.");
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
      });
    } catch (error) {
      setServerError("Network error. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="register-container">
      <h1 className="secondary-title">Register</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p style={{ color: "red" }}>{errors.firstName}</p>
          )}
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
        </div>

        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
}

export default Register;
