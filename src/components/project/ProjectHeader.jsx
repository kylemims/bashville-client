import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import "./ProjectHeader.css";

export const ProjectHeader = ({ title, onBack, onGenerateSetup }) => (
  <div className="project-header">
    <ActionButton onClick={onBack} variant="back" aria-label="Back to Dashboard">
      ←
    </ActionButton>
    <h1 className="project-title">&lt;{title} /&gt;</h1>
    <ActionButton onClick={onGenerateSetup} variant="accent" aria-label="Generate Setup Script & README">
      <MaterialIcon icon="markdown" size={30} color="var(--color-bg)" className="hover-primary" />
    </ActionButton>
  </div>
);
