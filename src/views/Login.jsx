import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/auth.js";
import { ROUTES } from "../utils/constants";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useDocumentTitle("Login • BASH STASH");

  const from = location.state?.from || ROUTES.DASHBOARD;

  const [formData, setFormData] = useState({
    username: "",
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
    console.log("🔐 User trying to login...");

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData.username, formData.password);

      login(response.token);

      console.log("🎉 Login successful! Welcome back!");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("❌ Login failed:", error);
      setError(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="text-2xl mb-6">Welcome Back</h1>

      <div className="page-card">
        <h2 className="card-title">Sign In</h2>

        {from !== ROUTES.DASHBOARD && (
          <p className="mb-4" style={{ color: "var(--color-accent)" }}>
            Please sign in to access {from}
          </p>
        )}

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
              placeholder="Your username"
              required
              disabled={loading}
              autoFocus
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
              placeholder="Your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
            className="button mb-4"
            style={{ width: "100%" }}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <Link to={ROUTES.REGISTER} style={{ color: "var(--color-accent)" }}>
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
};
