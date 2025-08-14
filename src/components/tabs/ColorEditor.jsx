import { useState } from "react";
import { ActionButton } from "../common/ActionButton.jsx";
import "./ColorEditor.css";
import "./ColorPaletteForm.css";
import "./ColorPaletteCard.css";

export const ColorEditor = ({ colorName, colorValue, onSave, onCancel, disabled = false }) => {
  const [hexValue, setHexValue] = useState(colorValue);
  const [error, setError] = useState("");

  const validateHex = (hex) => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(hex);
  };

  const handleSave = () => {
    if (!validateHex(hexValue)) {
      setError("Please enter a valid hex color (e.g., #FF5733)");
      return;
    }
    setError("");
    onSave(hexValue.toUpperCase());
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    setHexValue(value);
    setError("");
  };

  return (
    <div className="color-editor">
      <div className="color-editor-preview">
        <div
          className="color-swatch"
          style={{ backgroundColor: validateHex(hexValue) ? hexValue : "#cccccc" }}
        />
        <span className="color-name">{colorName}</span>
      </div>
      <div className="color-editor-input">
        <input
          type="text"
          value={hexValue}
          onChange={handleInputChange}
          className={`hex-input ${error ? "error" : ""}`}
          placeholder="#FFFFFF"
          maxLength={7}
          disabled={disabled}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
      <div className="color-editor-actions">
        <ActionButton onClick={handleSave} variant="primary" size="sm" disabled={disabled}>
          ✓
        </ActionButton>
        <ActionButton onClick={onCancel} variant="secondary" size="sm" disabled={disabled}>
          ✕
        </ActionButton>
      </div>
    </div>
  );
};
