import { useState } from "react";
import "./AdvancedStyleControls.css";
import { getBestTextColor, isContrastAccessible } from "../../utils/colorUtils.js";
import {
  LAYOUT_STYLES,
  BORDER_RADIUS,
  HERO_BACKGROUND_TYPES,
  FEATURE_CARD_STYLES,
  getSmartDefaults,
} from "../../utils/styleConstants.js";

// Helper to ensure color values are never null/undefined for inputs
const sanitizeColorValue = (value) => {
  if (!value) return "#3b82f6";
  if (typeof value !== "string") return "#3b82f6";
  if (value.startsWith("#") && value.length >= 4) return value;
  // Handle rgb/rgba values by returning a fallback - we only support hex in color inputs
  return "#3b82f6";
};

// Advanced style controls for developer-friendly customization
export const AdvancedStyleControls = ({ formData, onStyleChange, className = "" }) => {
  const [activeTab, setActiveTab] = useState("layout");
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current style preferences with defaults
  const stylePrefs = formData?.style_preferences || {};
  const getStyleValue = (key, defaultValue) => {
    const value = stylePrefs.hasOwnProperty(key) ? stylePrefs[key] : defaultValue;
    // Ensure we never return null or undefined for UI inputs
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Shared helper function for getting component overrides
  const getComponentOverride = (component, property) => {
    return stylePrefs?.component_overrides?.[component]?.[property] || null;
  };

  // Handle style preference changes
  const handleStyleChange = (key, value) => {
    const newPrefs = { ...stylePrefs, [key]: value };
    onStyleChange(newPrefs);
  };

  // Handle bulk style changes (e.g., smart defaults)
  const handleBulkStyleChange = (changes) => {
    const newPrefs = { ...stylePrefs, ...changes };
    onStyleChange(newPrefs);
  };

  // Handle component override changes
  const handleComponentOverride = (component, property, value) => {
    const currentOverrides = stylePrefs?.component_overrides || {};
    const componentOverrides = currentOverrides[component] || {};

    const newOverrides = {
      ...currentOverrides,
      [component]: {
        ...componentOverrides,
        [property]: value || null,
      },
    };

    // Clean up null values
    Object.keys(newOverrides).forEach((comp) => {
      Object.keys(newOverrides[comp]).forEach((prop) => {
        if (!newOverrides[comp][prop]) {
          delete newOverrides[comp][prop];
        }
      });
      if (Object.keys(newOverrides[comp]).length === 0) {
        delete newOverrides[comp];
      }
    });

    const newPrefs = {
      ...stylePrefs,
      component_overrides: newOverrides,
    };
    onStyleChange(newPrefs);
  };

  // Check if gradient causes contrast issues
  const hasGradientContrastIssues = () => {
    if (getStyleValue("hero_background_type", "gradient") !== "gradient") return false;

    const primaryText = getBestTextColor(formData?.primary_hex || "#3b82f6");
    const secondaryText = getBestTextColor(formData?.secondary_hex || "#1e40af");

    // Check if buttons will have contrast issues on gradient
    const primaryContrast = isContrastAccessible(primaryText, formData?.primary_hex);
    const secondaryContrast = isContrastAccessible(secondaryText, formData?.secondary_hex);

    return !primaryContrast || !secondaryContrast;
  };

  const tabs = [
    { id: "layout", label: "Layout", icon: "🎨" },
    { id: "hero", label: "Hero", icon: "🌟" },
    { id: "features", label: "Features", icon: "⭐" },
    { id: "components", label: "Components", icon: "🧩" },
    { id: "developer", label: "Developer", icon: "⚡" },
  ];

  return (
    <div className={`advanced-style-controls ${className}`}>
      <div className="controls-header">
        <button
          className="controls-toggle"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          aria-expanded={isExpanded}
          type="button">
          <span className="toggle-icon">{isExpanded ? "▼" : "▶"}</span>
          <span className="toggle-label">Advanced Styling</span>
          {hasGradientContrastIssues() && (
            <span className="contrast-alert" title="Gradient may cause contrast issues">
              ⚠️
            </span>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="controls-content">
          <div className="controls-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(tab.id);
                }}
                type="button">
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="controls-panel">
            {activeTab === "layout" && (
              <LayoutControls
                stylePrefs={stylePrefs}
                onStyleChange={handleStyleChange}
                onBulkStyleChange={handleBulkStyleChange}
              />
            )}

            {activeTab === "hero" && (
              <HeroControls
                formData={formData}
                stylePrefs={stylePrefs}
                onStyleChange={handleStyleChange}
                onComponentOverride={handleComponentOverride}
                hasContrastIssues={hasGradientContrastIssues()}
                getComponentOverride={getComponentOverride}
              />
            )}

            {activeTab === "features" && (
              <FeatureControls
                formData={formData}
                stylePrefs={stylePrefs}
                onStyleChange={handleStyleChange}
              />
            )}

            {activeTab === "components" && (
              <ComponentControls
                formData={formData}
                onComponentOverride={handleComponentOverride}
                getComponentOverride={getComponentOverride}
              />
            )}

            {activeTab === "developer" && (
              <DeveloperControls stylePrefs={stylePrefs} onStyleChange={handleStyleChange} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Layout controls with distinct visual styles and separate border radius controls
const LayoutControls = ({ stylePrefs, onStyleChange, onBulkStyleChange }) => {
  const getStyleValue = (key, defaultValue) => {
    const value = stylePrefs.hasOwnProperty(key) ? stylePrefs[key] : defaultValue;
    // Ensure we never return null or undefined for UI inputs
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const handleLayoutStyleChange = (layoutStyle) => {
    const smartDefaults = getSmartDefaults(layoutStyle);
    onBulkStyleChange(smartDefaults);
  };

  return (
    <div className="control-section">
      <h4>Layout Style</h4>
      <p className="control-desc">Choose an overall visual style that affects all components</p>

      <div className="control-group">
        <label>Style Theme</label>
        <div className="layout-style-grid">
          {Object.entries(LAYOUT_STYLES).map(([key, style]) => {
            const isSelected = getStyleValue("layout_style", "modern") === key;
            return (
              <div
                key={key}
                className={`layout-style-card ${isSelected ? "selected" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLayoutStyleChange(key);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLayoutStyleChange(key);
                  }
                }}>
                <div className="layout-preview">
                  <div className={`preview-element card-${style.cardStyle}`}></div>
                  <div className={`preview-element button-${style.buttonStyle}`}></div>
                  <div className={`preview-element hero-${style.heroStyle}`}></div>
                </div>
                <div className="layout-info">
                  <h5>{style.name}</h5>
                  <p>{style.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="control-group">
        <h5>Border Radius Controls</h5>
        <p className="control-desc">Set different border radius values for different elements</p>

        <div className="border-radius-grid">
          {[
            { key: "card_radius", label: "Cards", icon: "🃏" },
            { key: "button_radius", label: "Buttons", icon: "🔘" },
            { key: "hero_radius", label: "Hero Section", icon: "🌟" },
          ].map((control) => (
            <div key={control.key} className="border-radius-control">
              <label>
                <span className="control-icon">{control.icon}</span>
                {control.label}
              </label>
              <select
                value={getStyleValue(control.key, "medium")}
                onChange={(e) => onStyleChange(control.key, e.target.value)}>
                {Object.entries(BORDER_RADIUS).map(([value, config]) => (
                  <option key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)} ({config.css})
                  </option>
                ))}
              </select>
              <div
                className="radius-preview"
                style={{ borderRadius: BORDER_RADIUS[getStyleValue(control.key, "medium")].css }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="control-group">
        <h5>Visual Effects</h5>
        <div className="toggle-group">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("shadows_enabled", true)}
              onChange={(e) => onStyleChange("shadows_enabled", e.target.checked)}
            />
            <span>Drop Shadows</span>
            <span className="control-desc">Add depth with subtle shadows</span>
          </label>

          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("animations_enabled", true)}
              onChange={(e) => onStyleChange("animations_enabled", e.target.checked)}
            />
            <span>Hover Animations</span>
            <span className="control-desc">Smooth transitions and hover effects</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Enhanced hero section controls with multiple background types
const HeroControls = ({
  formData,
  stylePrefs,
  onStyleChange,
  onComponentOverride,
  hasContrastIssues,
  getComponentOverride,
}) => {
  const getStyleValue = (key, defaultValue) => {
    const value = stylePrefs.hasOwnProperty(key) ? stylePrefs[key] : defaultValue;
    // Ensure we never return null or undefined for UI inputs
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const currentBackgroundType = getStyleValue("hero_background_type", "gradient");

  return (
    <div className="control-section">
      <h4>Hero Section</h4>

      {hasContrastIssues && (
        <div className="contrast-warning-banner">
          <span className="warning-icon">⚠️</span>
          <span>
            Gradient may cause button contrast issues. Consider using solid background or override button
            colors below.
          </span>
        </div>
      )}

      <div className="control-group">
        <label>Background Type</label>
        <div className="background-type-grid">
          {Object.entries(HERO_BACKGROUND_TYPES).map(([key, bgType]) => (
            <div
              key={key}
              className={`background-type-card ${currentBackgroundType === key ? "selected" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStyleChange("hero_background_type", key);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStyleChange("hero_background_type", key);
                }
              }}>
              <div className={`background-preview bg-${key}`}>
                <div className="preview-content">
                  <div className="preview-title">Hero Title</div>
                  <div className="preview-button">CTA Button</div>
                </div>
              </div>
              <div className="background-info">
                <h6>{bgType.name}</h6>
                <p>{bgType.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient-specific controls */}
      {currentBackgroundType === "gradient" && (
        <div className="control-group">
          <label>Gradient Direction</label>
          <select
            value={getStyleValue("hero_gradient_direction", "135deg")}
            onChange={(e) => onStyleChange("hero_gradient_direction", e.target.value)}>
            <option value="90deg">Left to Right →</option>
            <option value="180deg">Top to Bottom ↓</option>
            <option value="135deg">Diagonal ↘ (Default)</option>
            <option value="45deg">Diagonal ↗</option>
            <option value="0deg">Bottom to Top ↑</option>
            <option value="270deg">Right to Left ←</option>
          </select>
        </div>
      )}

      {/* Solid color-specific controls */}
      {currentBackgroundType === "solid" && (
        <div className="control-group">
          <label>Background Color</label>
          <div className="color-picker-group">
            <input
              type="color"
              value={sanitizeColorValue(
                getStyleValue("hero_background_color", formData?.primary_hex || "#3b82f6")
              )}
              onChange={(e) => onStyleChange("hero_background_color", e.target.value)}
            />
            <span className="color-value">
              {getStyleValue("hero_background_color", formData?.primary_hex || "#3b82f6")}
            </span>
            <button
              className="use-palette-color"
              onClick={() => onStyleChange("hero_background_color", formData?.primary_hex)}
              title="Use primary color">
              Use Primary
            </button>
          </div>
        </div>
      )}

      {/* Image background-specific controls */}
      {currentBackgroundType === "image" && (
        <div className="control-group">
          <label>Background Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={getStyleValue("hero_background_image", "")}
            onChange={(e) => onStyleChange("hero_background_image", e.target.value)}
          />
          <div className="control-group">
            <label>Overlay Color</label>
            <div className="color-picker-group">
              <input
                type="color"
                value={sanitizeColorValue(
                  getStyleValue("hero_overlay_color", formData?.primary_hex || "#3b82f6")
                )}
                onChange={(e) => onStyleChange("hero_overlay_color", e.target.value)}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={getStyleValue("hero_overlay_opacity", 70)}
                onChange={(e) => onStyleChange("hero_overlay_opacity", parseInt(e.target.value))}
              />
              <span className="opacity-value">{getStyleValue("hero_overlay_opacity", 70)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="control-group">
        <h5>Hero Button Color Overrides</h5>
        <p className="control-desc">Override button colors specifically for the hero section</p>

        <div className="color-override-grid">
          {[
            { key: "primary", label: "Primary Button", current: formData?.primary_hex },
            { key: "secondary", label: "Secondary Button", current: formData?.secondary_hex },
            { key: "accent", label: "Accent Button", current: formData?.accent_hex },
          ].map((button) => {
            const overrideColor = getComponentOverride("hero_buttons", button.key);
            return (
              <div key={button.key} className="color-override-item">
                <label>{button.label}</label>
                <div className="color-override-input">
                  <input
                    type="color"
                    value={sanitizeColorValue(overrideColor || button.current || "#000000")}
                    onChange={(e) => onComponentOverride("hero_buttons", button.key, e.target.value)}
                  />
                  <span className="current-color">
                    {overrideColor ? "Override: " : "Default: "}
                    {overrideColor || button.current}
                  </span>
                  {overrideColor && (
                    <button
                      className="reset-override"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onComponentOverride("hero_buttons", button.key, null);
                      }}
                      title="Reset to default"
                      type="button">
                      ↺
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Individual feature card controls
const FeatureControls = ({ formData, stylePrefs, onStyleChange }) => {
  const getStyleValue = (key, defaultValue) => {
    const value = stylePrefs.hasOwnProperty(key) ? stylePrefs[key] : defaultValue;
    // Ensure we never return null or undefined for UI inputs
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const featureCards = [
    {
      id: 1,
      title: "Feature Card 1",
      icon: "🚀",
      defaultBg: formData?.ui_hex || "#ffffff",
      defaultText: "#1f2937",
      defaultAccent: formData?.accent_hex || "#3b82f6",
    },
    {
      id: 2,
      title: "Feature Card 2",
      icon: "⚡",
      defaultBg: formData?.ui_hex || "#ffffff",
      defaultText: "#1f2937",
      defaultAccent: formData?.primary_hex || "#3b82f6",
    },
    {
      id: 3,
      title: "Feature Card 3",
      icon: "✨",
      defaultBg: formData?.ui_hex || "#ffffff",
      defaultText: "#1f2937",
      defaultAccent: formData?.secondary_hex || "#3b82f6",
    },
  ];

  return (
    <div className="control-section">
      <h4>Feature Cards</h4>
      <p className="control-desc">Customize each feature card independently for unique visual impact</p>

      {featureCards.map((card) => (
        <div key={card.id} className="feature-card-control-group">
          <div className="feature-card-header">
            <span className="feature-icon">{card.icon}</span>
            <h5>{card.title}</h5>
          </div>

          <div className="feature-card-controls">
            {/* Card Style */}
            <div className="control-group">
              <label>Card Style</label>
              <select
                value={getStyleValue(`feature_${card.id}_style`, "default")}
                onChange={(e) => onStyleChange(`feature_${card.id}_style`, e.target.value)}>
                {Object.entries(FEATURE_CARD_STYLES).map(([key, style]) => (
                  <option key={key} value={key}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Colors */}
            <div className="color-controls-grid">
              <div className="color-control">
                <label>Background</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={sanitizeColorValue(getStyleValue(`feature_${card.id}_bg`, card.defaultBg))}
                    onChange={(e) => onStyleChange(`feature_${card.id}_bg`, e.target.value)}
                  />
                  <button
                    className="reset-color"
                    onClick={() => onStyleChange(`feature_${card.id}_bg`, card.defaultBg || "#ffffff")}
                    title="Reset to default">
                    ↺
                  </button>
                </div>
              </div>

              <div className="color-control">
                <label>Text Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={sanitizeColorValue(getStyleValue(`feature_${card.id}_text`, card.defaultText))}
                    onChange={(e) => onStyleChange(`feature_${card.id}_text`, e.target.value)}
                  />
                  <button
                    className="reset-color"
                    onClick={() => onStyleChange(`feature_${card.id}_text`, card.defaultText || "#1f2937")}
                    title="Reset to default">
                    ↺
                  </button>
                </div>
              </div>

              <div className="color-control">
                <label>Accent Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={sanitizeColorValue(getStyleValue(`feature_${card.id}_accent`, card.defaultAccent))}
                    onChange={(e) => onStyleChange(`feature_${card.id}_accent`, e.target.value)}
                  />
                  <button
                    className="reset-color"
                    onClick={() =>
                      onStyleChange(`feature_${card.id}_accent`, card.defaultAccent || "#3b82f6")
                    }
                    title="Reset to default">
                    ↺
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="feature-preview">
              <div
                className={`preview-feature-card style-${getStyleValue(
                  `feature_${card.id}_style`,
                  "default"
                )}`}
                style={{
                  backgroundColor: getStyleValue(`feature_${card.id}_bg`, card.defaultBg),
                  color: getStyleValue(`feature_${card.id}_text`, card.defaultText),
                  borderColor: getStyleValue(`feature_${card.id}_accent`, card.defaultAccent),
                }}>
                <div
                  className="preview-accent"
                  style={{ backgroundColor: getStyleValue(`feature_${card.id}_accent`, card.defaultAccent) }}>
                  {card.icon}
                </div>
                <div className="preview-content">
                  <h6>Feature Title</h6>
                  <p>Feature description text goes here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bulk-feature-controls">
        <h5>Bulk Actions</h5>
        <div className="bulk-action-buttons">
          <button
            className="bulk-action-btn"
            onClick={() => {
              featureCards.forEach((card) => {
                onStyleChange(`feature_${card.id}_bg`, card.defaultBg);
                onStyleChange(`feature_${card.id}_text`, card.defaultText);
                onStyleChange(`feature_${card.id}_accent`, card.defaultAccent);
                onStyleChange(`feature_${card.id}_style`, "default");
              });
            }}>
            Reset All to Defaults
          </button>
          <button
            className="bulk-action-btn"
            onClick={() => {
              const primaryBg = formData?.primary_hex;
              const secondaryBg = formData?.secondary_hex;
              const accentBg = formData?.accent_hex;
              const textColor = getBestTextColor(primaryBg);

              onStyleChange(`feature_1_bg`, primaryBg);
              onStyleChange(`feature_1_text`, textColor);
              onStyleChange(`feature_2_bg`, secondaryBg);
              onStyleChange(`feature_2_text`, getBestTextColor(secondaryBg));
              onStyleChange(`feature_3_bg`, accentBg);
              onStyleChange(`feature_3_text`, getBestTextColor(accentBg));
            }}>
            Use Palette Colors
          </button>
        </div>
      </div>
    </div>
  );
};

// Component-specific controls
const ComponentControls = ({ formData, onComponentOverride, getComponentOverride }) => {
  const components = [
    {
      name: "navigation",
      label: "Navigation Bar",
      properties: [
        { key: "background_color", label: "Background", current: formData?.ui_hex },
        { key: "text_color", label: "Text Color", current: getBestTextColor(formData?.ui_hex || "#ffffff") },
        { key: "border_color", label: "Border Color", current: "#e5e7eb" },
      ],
    },
    {
      name: "card",
      label: "Cards & Content",
      properties: [
        { key: "background_color", label: "Background", current: formData?.ui_hex },
        { key: "border_color", label: "Border Color", current: "#e5e7eb" },
        { key: "text_color", label: "Text Color", current: "#1f2937" },
      ],
    },
    {
      name: "footer",
      label: "Footer",
      properties: [
        { key: "background_color", label: "Background", current: "#1f2937" },
        { key: "text_color", label: "Text Color", current: formData?.ui_hex },
        { key: "border_color", label: "Border Color", current: "#e5e7eb" },
      ],
    },
    {
      name: "content",
      label: "Content Section",
      properties: [
        { key: "background_color", label: "Background", current: formData?.ui_hex },
        { key: "text_color", label: "Text Color", current: "#1f2937" },
      ],
    },
    {
      name: "button",
      label: "Regular Buttons",
      properties: [
        { key: "background_color", label: "Background", current: formData?.primary_hex },
        { key: "text_color", label: "Text Color", current: formData?.background_hex },
      ],
    },
  ];

  return (
    <div className="control-section">
      <h4>Component Overrides</h4>
      <p className="control-desc">Fine-tune individual components beyond the main color palette</p>

      {components.map((component) => (
        <div key={component.name} className="component-override-group">
          <h5>{component.label}</h5>

          <div className="color-override-grid">
            {component.properties.map((property) => {
              const overrideColor = getComponentOverride(component.name, property.key);
              return (
                <div key={property.key} className="color-override-item">
                  <label>{property.label}</label>
                  <div className="color-override-input">
                    <input
                      type="color"
                      value={sanitizeColorValue(overrideColor || property.current || "#000000")}
                      onChange={(e) => onComponentOverride(component.name, property.key, e.target.value)}
                    />
                    <span className="current-color">
                      {overrideColor ? "Override: " : "Default: "}
                      {overrideColor || property.current}
                    </span>
                    {overrideColor && (
                      <button
                        className="reset-override"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onComponentOverride(component.name, property.key, null);
                        }}
                        title="Reset to default"
                        type="button">
                        ↺
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced developer controls with preview options and code generation settings
const DeveloperControls = ({ stylePrefs, onStyleChange }) => {
  const getStyleValue = (key, defaultValue) => {
    return stylePrefs.hasOwnProperty(key) ? stylePrefs[key] : defaultValue;
  };

  return (
    <div className="control-section">
      <h4>Developer Options</h4>

      <div className="control-group">
        <h5>Preview Settings</h5>
        <div className="preview-controls">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("preview_dark_mode", false)}
              onChange={(e) => onStyleChange("preview_dark_mode", e.target.checked)}
            />
            <span>Dark Mode Preview</span>
            <span className="control-desc">Toggle dark mode for preview (if supported)</span>
          </label>
        </div>
      </div>

      <div className="control-group">
        <label>CSS Framework</label>
        <select
          value={getStyleValue("css_framework", "css")}
          onChange={(e) => onStyleChange("css_framework", e.target.value)}>
          <option value="css">Custom CSS</option>
          <option value="tailwind">Tailwind CSS</option>
          <option value="scss">SCSS/Sass</option>
          <option value="styled-components">Styled Components</option>
        </select>
        <p className="control-desc">Choose the CSS framework for generated code</p>
      </div>

      <div className="control-group">
        <label>Accessibility Level</label>
        <select
          value={getStyleValue("accessibility_mode", "auto")}
          onChange={(e) => onStyleChange("accessibility_mode", e.target.value)}>
          <option value="strict">Strict WCAG AA</option>
          <option value="auto">Auto-optimize</option>
          <option value="relaxed">Relaxed (AA Large)</option>
          <option value="custom">Custom Settings</option>
        </select>
        <p className="control-desc">Set accessibility standards for color contrast</p>
      </div>

      <div className="control-group">
        <h5>Code Generation</h5>
        <div className="toggle-group">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("semantic_colors", true)}
              onChange={(e) => onStyleChange("semantic_colors", e.target.checked)}
            />
            <span>Semantic CSS Variables</span>
            <span className="control-desc">Generate --color-primary, --color-secondary variables</span>
          </label>

          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("responsive_classes", true)}
              onChange={(e) => onStyleChange("responsive_classes", e.target.checked)}
            />
            <span>Responsive Utilities</span>
            <span className="control-desc">Include mobile-first responsive classes</span>
          </label>

          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("component_styles", true)}
              onChange={(e) => onStyleChange("component_styles", e.target.checked)}
            />
            <span>Component-Specific Styles</span>
            <span className="control-desc">Generate CSS for each component type</span>
          </label>

          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("css_comments", true)}
              onChange={(e) => onStyleChange("css_comments", e.target.checked)}
            />
            <span>CSS Comments</span>
            <span className="control-desc">Include helpful comments in generated CSS</span>
          </label>
        </div>
      </div>

      <div className="control-group">
        <h5>Export Options</h5>
        <div className="export-format-grid">
          {[
            { key: "export_css", label: "CSS File", desc: "Complete CSS stylesheet" },
            { key: "export_scss", label: "SCSS File", desc: "SCSS with variables and mixins" },
            { key: "export_tailwind", label: "Tailwind Config", desc: "tailwind.config.js file" },
            { key: "export_json", label: "JSON Config", desc: "Configuration as JSON data" },
          ].map((format) => (
            <label key={format.key} className="export-format-option">
              <input
                type="checkbox"
                checked={getStyleValue(format.key, true)}
                onChange={(e) => onStyleChange(format.key, e.target.checked)}
              />
              <div className="format-info">
                <span className="format-label">{format.label}</span>
                <span className="format-desc">{format.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="control-group">
        <h5>Performance</h5>
        <div className="toggle-group">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("optimize_css", true)}
              onChange={(e) => onStyleChange("optimize_css", e.target.checked)}
            />
            <span>Optimize CSS Output</span>
            <span className="control-desc">Minify and optimize generated CSS</span>
          </label>

          <label className="toggle-option">
            <input
              type="checkbox"
              checked={getStyleValue("remove_unused", false)}
              onChange={(e) => onStyleChange("remove_unused", e.target.checked)}
            />
            <span>Remove Unused Styles</span>
            <span className="control-desc">Only include styles that are actually used</span>
          </label>
        </div>
      </div>
    </div>
  );
};
