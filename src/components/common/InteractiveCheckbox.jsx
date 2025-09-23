import { MaterialIcon } from "./MaterialIcon.jsx";
import "./InteractiveCheckbox.css";

export const InteractiveCheckbox = ({ isChecked, text, onToggle, disabled = false, className = "" }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!disabled) {
      onToggle(!isChecked);
    }
  };

  return (
    <div
      className={`interactive-checkbox ${className} ${isChecked ? "checked" : ""} ${
        disabled ? "disabled" : ""
      }`}>
      <button
        className="checkbox-toggle"
        onClick={handleClick}
        disabled={disabled}
        type="button"
        aria-label={isChecked ? "Mark as incomplete" : "Mark as complete"}>
        <MaterialIcon
          icon={isChecked ? "check_box" : "check_box_outline_blank"}
          size={18}
          color={isChecked ? "var(--accent)" : "var(--muted)"}
        />
      </button>
      <span className={`checkbox-text ${isChecked ? "completed" : ""}`} onClick={handleClick}>
        {text}
      </span>
    </div>
  );
};
