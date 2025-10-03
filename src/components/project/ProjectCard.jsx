// import { Link } from "react-router-dom";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { ColorPreview } from "../common/ColorPreview.jsx";
import "./ProjectCard.css";
import { useNavigate } from "react-router-dom";

export const ProjectCard = ({ project, onDelete, onLaunch, isDeleting, onGenerateSetup }) => {
  const hasCommands = project.commands_preview && project.commands_preview.length > 0;
  const hasNotes = project.notes_count && project.notes_count.length > 0;
  const hasColors = project.color_palette_preview;
  const navigate = useNavigate();

  const getProjectTypeConfig = (type) => {
    const configs = {
      "static-tailwind": {
        label: "Static + Tailwind",
        icon: "bolt",
        color: "var(--color-accent)",
        complexity: "Simple",
      },
      "static-css": {
        label: "Static + CSS",
        icon: "palette",
        color: "var(--color-accent)",
        complexity: "Simple",
      },
      "fullstack-tailwind": {
        label: "Full-Stack + Tailwind",
        icon: "rocket_launch",
        color: "var(--color-secondary)",
        complexity: "Advanced",
      },
      "fullstack-css": {
        label: "Full-Stack + CSS",
        icon: "settings",
        color: "var(--color-secondary)",
        complexity: "Advanced",
      },
    };
    return configs[type] || configs["static-tailwind"];
  };

  const typeConfig = getProjectTypeConfig(project.project_type);

  return (
    <div className="project-card">
      <div className="card-grid-left">
        {/* <div className="project-card-header"> */}
        <div className="title-and-line-container">
          <h3 className="project-title">{project.title}</h3>
          <div className="command-gradient-line"></div>
        </div>
        {/* </div> */}

        <div className="project-attributes-container">
          <div className="project-attributes">
            <div className="card-commands-and-notes">
              <div className="project-stat-data1">
                <MaterialIcon icon="terminal" size={18} color="var(--color-accent)" />
                <span className="stat-text">
                  {hasCommands ? `${project.commands_preview.length} commands` : "0 commands"}
                </span>
              </div>
              <div className="project-stat-data2">
                <MaterialIcon icon="checklist" size={18} color="var(--color-accent)" />
                <span className="stat-text">
                  {hasNotes ? `${project.notes_count.length} notes` : "0 notes"}
                </span>
              </div>
            </div>
            {hasColors ? (
              <div className="project-stat-palette1">
                <ColorPreview palette={hasColors} size="md" showTooltip={true} />
                <span className="stat-text">{hasColors.name}</span>
              </div>
            ) : (
              <div className="project-stat-palette2">
                <MaterialIcon icon="palette" size={18} color="var(--muted)" />
                <span className="stat-text">No palette</span>
              </div>
            )}
          </div>
          <div className="project-card-body-container">
            {project.description && <p className="project-description">{project.description}</p>}
          </div>
          <div className="project-type-container">
            <div className="project-type-badge" style={{ borderColor: typeConfig.color }}>
              <MaterialIcon icon={typeConfig.icon} />
              <span className="project-type-label">{typeConfig.label}</span>
              <span className="project-complexity">{typeConfig.complexity}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-grid-right">
        <div className="card-grid-actions">
          <ActionButton
            onClick={() => navigate(`/projects/${project.id}`)}
            className="action-btn launch-btn"
            variant="back"
            size="sm"
            title="View project details"
            aria-label="View project details">
            <MaterialIcon
              icon="visibility"
              size={22}
              color="var(--color-primary)"
              className="hover-primary"
            />
          </ActionButton>
          <ActionButton
            onClick={() => onDelete(project.id)}
            className="action-btn launch-btn"
            variant="delete"
            size="sm"
            disabled={isDeleting}
            title="Delete Project"
            aria-label="Delete project">
            <MaterialIcon icon="delete" size={22} color="var(--color-secondary)" className="hover-primary" />
          </ActionButton>
          <ActionButton
            onClick={() => onLaunch(project)}
            className="action-btn launch-btn"
            variant="launch"
            size="sm"
            title="Generate Setup Scripts"
            aria-label="Generate setup scripts">
            <MaterialIcon
              icon="rocket_launch"
              size={22}
              color="var(--color-accent)"
              className="hover-primary"
            />
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
