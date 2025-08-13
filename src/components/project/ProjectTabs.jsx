import { ActionButton } from "../common/ActionButton.jsx";
import "./ProjectTabs.css";

export const ProjectTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: "commands", label: "Commands" },
    { key: "colors", label: "Colors" },
  ];

  return (
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
  );
};
