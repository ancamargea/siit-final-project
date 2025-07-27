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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    } else {
      setErrors({});
      console.log("✅ Registering:", formData);
      setSuccessMessage("Registration successful!");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p>{errors.lastName}</p>}
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

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Register;
