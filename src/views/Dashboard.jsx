import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getProjects } from "../services/projectService";
import { ROUTES } from "../utils/constants";

export const Dashboard = () => {
  // const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle("Dashboard • Bash Stash");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // TODO: Implement deleteProject service
        // await deleteProject(projectId);
        setProjects(projects.filter((p) => p.id !== projectId));
      } catch (err) {
        setError("Failed to delete project");
      }
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Your Projects</h1>
        <Link to="/projects/new" className="button">
          Create New
        </Link>
      </div>

      {error && (
        <div className="page-card mb-4">
          <p style={{ color: "var(--color-secondary)" }}>{error}</p>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="page-card text-center">
          <h2 className="card-title mb-4">No Projects Yet</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Create your first project to get started with Bash Stash!
          </p>
          <Link to="/projects/new" className="button">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
          ))}
        </div>
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">{project.name}</h3>
        <div className="project-actions">
          <button className="action-btn edit-btn" title="Edit Project" aria-label="Edit project">
            ✏️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(project.id)}
            title="Delete Project"
            aria-label="Delete project">
            🗑️
          </button>
          <button className="action-btn launch-btn" title="Launch Project" aria-label="Launch project">
            🚀
          </button>
        </div>
      </div>

      {project.description && <p className="project-description">{project.description}</p>}

      <Link to={`/projects/${project.id}`} className="project-view-btn">
        VIEW
      </Link>
    </div>
  );
};
