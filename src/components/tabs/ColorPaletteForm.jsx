import { useState } from "react";
import { FormField } from "../common/FormField";
import { ActionButton } from "../common/ActionButton";

const DEFAULT_COLORS = {
  name: "",
  primary_hex: "#000000",
  secondary_hex: "#404040",
  accent_hex: "#0EA5E9",
  background_hex: "#FFFFFF",
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
    { name: "primary_hex", label: "Primary", placeholder: "#000000" },
    { name: "secondary_hex", label: "Secondary", placeholder: "#404040" },
    { name: "accent_hex", label: "Accent", placeholder: "#0EA5E9" },
    { name: "background_hex", label: "Background", placeholder: "#FFFFFF" },
  ];

  return (
    <div className="palette-form-container">
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
            <FormField
              key={field.name}
              label={field.label}
              type="color"
              value={formData[field.name]}
              onChange={(value) => handleChange(field.name, value)}
              disabled={disabled}
            />
          ))}
        </div>

        <div className="palette-preview-live">
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
            {isEditing ? "Update Palette" : "Add New"}
          </ActionButton>
          <ActionButton type="button" variant="secondary" onClick={onCancel} disabled={disabled}>
            Cancel
          </ActionButton>
        </div>
      </form>
    </div>
  );
};
