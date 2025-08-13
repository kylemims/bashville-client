/* filepath: src/components/tabs/ColorPaletteForm.jsx */
import { useState } from "react";
import { FormField } from "../common/FormField.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import "./ColorPaletteForm.css";

const DEFAULT_COLORS = {
  name: "",
  primary_hex: "#fee394",
  secondary_hex: "#d46a6a",
  accent_hex: "#46cba7",
  background_hex: "#0c0806",
};

export const ColorPaletteForm = ({ palette, onSubmit, onCancel, disabled, isEditing = false }) => {
  const [formData, setFormData] = useState(palette || DEFAULT_COLORS);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const colorFields = [
    { name: "primary_hex", label: "Primary", placeholder: "#fee394" },
    { name: "secondary_hex", label: "Secondary", placeholder: "#d46a6a" },
    { name: "accent_hex", label: "Accent", placeholder: "#46cba7" },
    { name: "background_hex", label: "Background", placeholder: "#0c0806" },
  ];

  return (
    <div className="palette-form-container">
      <h3>{isEditing ? "Edit Color Palette" : "Create New Color Palette"}</h3>
      <form onSubmit={handleSubmit} className="palette-form">
        <FormField
          label="Palette Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
          placeholder="Dark Theme Magic"
          required
          disabled={disabled}
          autoFocus={!isEditing}
        />

        <div className="color-fields-grid">
          {colorFields.map((field) => (
            <div key={field.name} className="color-field">
              <FormField
                label={field.label}
                type="color"
                value={formData[field.name]}
                onChange={(value) => handleChange(field.name, value)}
                disabled={disabled}
              />
              <FormField
                type="text"
                value={formData[field.name]}
                onChange={(value) => handleChange(field.name, value)}
                placeholder={field.placeholder}
                disabled={disabled}
                className="hex-input"
              />
            </div>
          ))}
        </div>

        <div className="palette-preview-live">
          <h4>Preview</h4>
          <div className="color-swatch-row">
            {colorFields.map((field) => (
              <div
                key={field.name}
                className={`color-swatch ${field.name.replace("_hex", "")}`}
                style={{ backgroundColor: formData[field.name] }}
                title={`${field.label}: ${formData[field.name]}`}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <ActionButton type="submit" variant="primary" disabled={disabled || !formData.name.trim()}>
            {isEditing ? "Update Palette" : "Create Palette"}
          </ActionButton>
          <ActionButton type="button" variant="secondary" onClick={onCancel} disabled={disabled}>
            Cancel
          </ActionButton>
        </div>
      </form>
    </div>
  );
};
