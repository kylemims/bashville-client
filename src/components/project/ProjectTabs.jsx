// src/components/project/ProjectTabs.jsx

import { ActionButton } from "../common/ActionButton.jsx";
import "./ProjectTabs.css";

export const ProjectTabs = ({ activeTab, onTabChange, onAddNew }) => {
  const tabs = [
    { key: "commands", label: "Commands" },
    { key: "colors", label: "Colors" },
    { key: "backend", label: "Backend" },
  ];

  const getAddButtonText = () => {
    switch (activeTab) {
      case "commands":
        return "Add New";
      case "colors":
        return "Add New";
      default:
        return "Add New";
    }
  };

  return (
    <div className="project-tabs-container">
      {/* Left side - Tab buttons */}
      <div className="project-tabs">
        {tabs.map((tab) => (
          <ActionButton
            key={tab.key}
            variant={activeTab === tab.key ? "tab-active" : "tab"}
            onClick={() => onTabChange(tab.key)}>
            {tab.label}
          </ActionButton>
        ))}
      </div>

      {/* Right side - Add button */}
      <div className="project-tabs-actions">
        <ActionButton
          onClick={onAddNew}
          variant="accent"
          size="sm"
          className="add-button"
          aria-label={getAddButtonText()}>
          {/* <MaterialIcon icon={getAddButtonIcon()} size={18} /> */}
          {getAddButtonText()}
        </ActionButton>
      </div>
    </div>
  );
};
