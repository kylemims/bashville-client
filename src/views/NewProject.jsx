import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/projectService";
import { FormField } from "../components/common/FormField.jsx";
import { ActionButton } from "../components/common/ActionButton.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ROUTES } from "../utils/constants";
import { ErrorMessage } from "../components/common/ErrorMessage.jsx";

export const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useDocumentTitle("New Project • Bash Stash");

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Project title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newProject = await createProject(formData);
      console.log("Creating project:", newProject);

      navigate(`/projects/${newProject.id}`, { replace: true });
    } catch (err) {
      setError(`Failed to create project: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim();

  return (
    <div className="page-content page-enter">
      <div className="container">
        <div className="page-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 className="card-title text-2xl">New Project</h1>

          <ErrorMessage message={error} onDismiss={() => setError("")} />

          <form onSubmit={handleSubmit}>
            <FormField
              label="Project Title"
              type="text"
              value={formData.title}
              onChange={(value) => handleInputChange("title", value)}
              placeholder="name your project"
              required
              disabled={loading}
              autoFocus
            />

            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              placeholder="Brief description of your project..."
              disabled={loading}
            />

            <div className="form-actions">
              <ActionButton
                type="submit"
                variant="primary"
                disabled={loading || !isFormValid}
                style={{ flex: 1 }}>
                {loading ? "Creating Project..." : "Create Project"}
              </ActionButton>

              <ActionButton
                type="button"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                variant="secondary"
                disabled={loading}>
                Cancel
              </ActionButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
