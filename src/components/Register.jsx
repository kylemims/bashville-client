import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { registerUser } from "../services/auth.js";
import { ROUTES } from "../utils/constants.js";

const Register = () => {

  const { login } = useAuth();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form when user types
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Clear error when user starts typing
  if (error) setError('');
}

// Check if form is valid
const validateForm = () => {
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
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
    setError('');

    try {
      const response = await registerUser(formData);
      setAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
