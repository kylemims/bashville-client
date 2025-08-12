import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { registerUser } from "../services/auth.js";
import { ROUTES } from "../utils/constants.js";

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear error when user starts typing
  const handleInputChange = (e) => {
    if (error) setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if form is valid
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  // Handle form submission (when user clicks "Create Account")
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✏️ User trying to register...");

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await registerUser(formData.username, formData.email, formData.password);

      login(response.token, response.user);

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("❌ Registration failed:", error);
      setError(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Register</h2>
      {error && <p className="error">{error}</p>}
      <div className="page-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" disabled={loading}>
            Register
          </button>
        </form>
      </div>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
