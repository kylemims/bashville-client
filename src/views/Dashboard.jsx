import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getProjects, deleteProject } from "../services/projectService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { ActionButton } from "../components/ActionButton";
import "./Dashboard.css";

export const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useDocumentTitle("Dashboard • Bash Stash");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectData = await getProjects();
        setProjects(projectData);
        setError(null);
      } catch (err) {
        setError(`Failed to load projects: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    const confirmMessage = `Are you sure you want to delete "${
      project?.title || "this project"
    }"?\n\nThis action cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setDeletingId(projectId);
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setError(null);
    } catch (err) {
      setError(`Failed to delete project: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLaunchProject = (project) => {
    // TODO: Implement project launch functionality
    console.log("🚀 Launching project:", project.title);
    alert(`Launch functionality for "${project.title}" coming soon!`);
  };

  if (loading) {
    return (
      <div className="page-content">
        <LoadingSpinner size="lg" text="Loading your projects..." />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">
            {user?.username ? `${user.username}'s Projects` : "Your Projects"}
          </h1>
          <p className="dashboard-subtitle">Manage your development project stashes</p>
        </div>
        <Link to="/projects/new" className="button">
          Create New
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="projects-section">
          <div className="projects-stats">
            <span className="stats-text">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </span>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                onLaunch={handleLaunchProject}
                isDeleting={deletingId === project.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-state-content">
      <div className="empty-state-icon">📁</div>
      <h2 className="empty-state-title">No Projects Yet</h2>
      <p className="empty-state-description">
        Create your first project to start organizing your development commands and color palettes!
      </p>
      <Link to="/projects/new" className="button">
        Create Your First Project
      </Link>
    </div>
  </div>
);

const ProjectCard = ({ project, onDelete, onLaunch, isDeleting }) => {
  const hasCommands = project.commands_preview && project.commands_preview.length > 0;
  const hasColors = project.color_palette_preview;

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">{project.title}</h3>
        <div className="project-actions">
          <Link
            to={`/projects/${project.id}`}
            className="action-btn edit-btn"
            title="Edit Project"
            aria-label="Edit project">
            ✏️
          </Link>
          <ActionButton
            onClick={() => onDelete(project.id)}
            variant="delete"
            size="sm"
            disabled={isDeleting}
            title="Delete Project"
            aria-label="Delete project">
            {isDeleting ? "⏳" : "🗑️"}
          </ActionButton>
          <ActionButton
            onClick={() => onLaunch(project)}
            variant="launch"
            size="sm"
            title="Launch Project"
            aria-label="Launch project">
            🚀
          </ActionButton>
        </div>
      </div>

      {project.description && <p className="project-description">{project.description}</p>}

      <div className="project-stats">
        <div className="project-stat">
          <span className="stat-icon">⚡</span>
          <span className="stat-text">
            {hasCommands ? `${project.commands_preview.length} commands` : "No commands"}
          </span>
        </div>
        <div className="project-stat">
          <span className="stat-icon">🎨</span>
          <span className="stat-text">{hasColors ? project.color_palette_preview.name : "No palette"}</span>
        </div>
      </div>

      <Link to={`/projects/${project.id}`} className="project-view-btn">
        VIEW PROJECT
      </Link>
    </div>
  );
};
