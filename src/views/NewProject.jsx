import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ROUTES } from "../utils/constants";

export const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useDocumentTitle("New Project • Bash Stash");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Implement createProject service
      // const newProject = await createProject(formData);
      console.log("Creating project:", formData);

      // Simulate success - navigate to dashboard
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1000);
    } catch (err) {
      setError(`Failed to create project: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="text-2xl mb-6">Create New Project</h1>

      <div className="page-card">
        <h2 className="card-title">Project Details</h2>

        {error && (
          <div className="mb-4">
            <p style={{ color: "var(--color-secondary)" }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="name" className="form-label">
              Project Title
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input"
              placeholder="my-awesome-project"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-section">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input"
              placeholder="Brief description of your project..."
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="button"
              style={{ flex: 1 }}>
              {loading ? "Creating Project..." : "Create Project"}
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="button secondary"
              disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
