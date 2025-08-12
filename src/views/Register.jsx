import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { registerUser } from "../services/auth";
import { ROUTES } from "../utils/constants";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useDocumentTitle("Register • BASH STASH");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser(formData.username, formData.email, formData.password);
      login(response.token, response.user);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      setError(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="text-2xl mb-6">Join Bash Stash</h1>

      <div className="page-card">
        <h2 className="card-title">Create Account</h2>

        {error && (
          <p className="mb-4" style={{ color: "var(--color-secondary)" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="text-sm mb-2" style={{ display: "block" }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input"
              placeholder="Choose a username"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="text-sm mb-2" style={{ display: "block" }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="text-sm mb-2" style={{ display: "block" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.username || !formData.email || !formData.password}
            className="button mb-4"
            style={{ width: "100%" }}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
          <Link to={ROUTES.LOGIN} style={{ color: "var(--color-accent)" }}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
