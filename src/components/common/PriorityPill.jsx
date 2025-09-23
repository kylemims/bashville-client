import { MaterialIcon } from "./MaterialIcon.jsx";
import "./PriorityPill.css";

export const PriorityPill = ({ priority, size = "sm", showIcon = true, showText = false }) => {
  const priorityConfig = {
    high: {
      icon: "priority_high",
      label: "High",
      className: "priority-high",
      color: "var(--color-secondary)", // Red
    },
    medium: {
      icon: "remove",
      label: "Medium",
      className: "priority-medium",
      color: "var(--color-primary)", // Yellow
    },
    low: {
      icon: "keyboard_arrow_down",
      label: "Low",
      className: "priority-low",
      color: "var(--accent)", // Green
    },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={`priority-pill ${config.className} priority-${size}`} title={`${config.label} Priority`}>
      {showIcon && (
        <MaterialIcon
          icon={config.icon}
          size={size === "xs" ? 12 : size === "sm" ? 14 : 16}
          color={config.color}
        />
      )}
      {showText && <span className="priority-text">{config.label}</span>}
    </span>
  );
};
