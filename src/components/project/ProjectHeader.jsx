import { ActionButton } from "../common/ActionButton.jsx";
import "./ProjectHeader.css";

export const ProjectHeader = ({ title, onBack, onGenerateSetup }) => (
  <div className="project-header">
    <ActionButton onClick={onBack} variant="back" aria-label="Back to Dashboard">
      ←
    </ActionButton>
    <h1 className="project-title">&lt;{title} /&gt;</h1>
    <ActionButton onClick={onGenerateSetup} variant="primary" aria-label="Generate Setup Script & README">
      📋 Generate Setup
    </ActionButton>
  </div>
);
