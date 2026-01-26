// import { ActionButton } from "../common/ActionButton.jsx";
import "./ProjectTabs.css";
import { MaterialIcon } from "../common/MaterialIcon.jsx";

export const ProjectTabs = ({ activeTab, onTabChange, onAddNew }) => {
  const tabs = [
    { key: "commands", label: "Commands", icon: "terminal" },
    { key: "colors", label: "Colors", icon: "palette" },
    { key: "notes", label: "Notes", icon: "add_notes" },
    { key: "backend", label: "Backend", icon: "database" },
  ];

  const activeTabData = tabs.find((tab) => tab.key === activeTab);

  return (
    <div className="project-tabs-container">
      {/* Mobile Dropdown - shown on screens <= 768px */}
      <div className="project-tabs-mobile">
        <select
          className="project-tabs-dropdown"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}>
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs - shown on screens > 768px */}
      <div className="project-tabs">
        {tabs.map((tab) => (
          <button
            className={`all-tabs-select ${activeTab === tab.key ? "active" : ""}`}
            key={tab.key}
            onClick={() => onTabChange(tab.key)}>
            <MaterialIcon icon={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
