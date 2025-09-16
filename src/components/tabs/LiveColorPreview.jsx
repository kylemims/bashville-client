import { useEffect, useState } from "react";
import "./LiveColorPreview.css";

export const LiveColorPreview = ({ formData, isVisible = true }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to get component-specific colors with overrides
  const getComponentColor = (componentType, colorType, defaultColor) => {
    const overrides = formData.style_preferences?.component_overrides || {};
    const componentOverride = overrides[componentType];

    if (componentOverride && componentOverride[colorType]) {
      return componentOverride[colorType];
    }

    return defaultColor;
  };

  // Helper function specifically for hero button colors
  const getHeroButtonColor = (buttonType, colorType, defaultColor) => {
    const overrides = formData.style_preferences?.component_overrides || {};
    const heroButtonOverrides = overrides["hero_buttons"];

    if (heroButtonOverrides && heroButtonOverrides[buttonType]) {
      return heroButtonOverrides[buttonType];
    }

    // Fallback to regular button overrides
    return getComponentColor("button", colorType, defaultColor);
  };

  // Update CSS custom properties whenever formData changes
  useEffect(() => {
    if (!mounted || !formData) return;

    const root = document.documentElement;
    const stylePrefs = formData.style_preferences || {};

    // Base colors - use the correct property names from formData
    root.style.setProperty("--primary-color", formData.primary_hex || "#fee394");
    root.style.setProperty("--secondary-color", formData.secondary_hex || "#d46a6a");
    root.style.setProperty("--accent-color", formData.accent_hex || "#46cba7");
    root.style.setProperty("--background-color", formData.background_hex || "#0c0806");
    root.style.setProperty("--ui-color", formData.ui_hex || "#efefef");
    root.style.setProperty("--text-color", formData.ui_hex || "#1f2937");
    root.style.setProperty("--border-color", "#e5e7eb");

    // Hero section styling
    if (stylePrefs.hero_style === "gradient" && formData.primary_hex && formData.secondary_hex) {
      const gradientValue = `linear-gradient(135deg, ${formData.primary_hex}, ${formData.secondary_hex})`;
      root.style.setProperty("--hero-background", gradientValue);
    } else {
      root.style.setProperty("--hero-background", formData.primary_hex || "#fee394");
    }

    // Border radius
    const borderRadius = stylePrefs.border_radius || "medium";
    const radiusMap = {
      none: "0px",
      small: "4px",
      medium: "8px",
      large: "12px",
      xl: "24px",
      full: "9999px",
    };
    root.style.setProperty("--border-radius", radiusMap[borderRadius]);

    // Component overrides
    const overrides = stylePrefs.component_overrides || {};
    Object.entries(overrides).forEach(([component, styles]) => {
      Object.entries(styles).forEach(([property, value]) => {
        if (value) {
          const cssVar = `--${component}-${property.replace("_", "-")}`;
          root.style.setProperty(cssVar, value);
        }
      });
    });
  }, [formData, mounted]);

  if (!isVisible || !formData) {
    return null;
  }

  const stylePrefs = formData.style_preferences || {};

  // Border radius mapping
  const radiusMap = {
    none: "0px",
    small: "4px",
    medium: "8px",
    large: "12px",
    xl: "24px",
    full: "9999px",
  };

  // Visual indicators for applied styles
  const getStyleIndicators = () => {
    const indicators = [];

    if (stylePrefs.hero_style === "gradient") {
      indicators.push("Gradient Hero");
    }

    if (stylePrefs.animations_enabled) {
      indicators.push("Animations");
    }

    if (stylePrefs.shadows_enabled) {
      indicators.push("Shadows");
    }

    const borderRadius = stylePrefs.border_radius;
    if (borderRadius && borderRadius !== "medium") {
      indicators.push(`${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)} Radius`);
    }

    const overrides = stylePrefs.component_overrides || {};
    const overrideCount = Object.keys(overrides).filter((key) =>
      Object.values(overrides[key] || {}).some((value) => value)
    ).length;

    if (overrideCount > 0) {
      indicators.push(`${overrideCount} Override${overrideCount === 1 ? "" : "s"}`);
    }

    // Add debug info for component overrides
    if (overrideCount > 0) {
      console.log("🔍 Component overrides active:", overrides);
    }

    return indicators;
  };

  const styleIndicators = getStyleIndicators();

  return (
    <div className="live-preview-container">
      {styleIndicators.length > 0 && (
        <div className="style-indicators">
          <span className="indicators-label">Applied Styles:</span>
          {styleIndicators.map((indicator, index) => (
            <span key={index} className="style-indicator">
              {indicator}
            </span>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav
        className="preview-nav"
        style={{
          backgroundColor: getComponentColor("navigation", "background_color", formData.ui_hex),
          borderColor: getComponentColor("navigation", "border_color", "#e5e7eb"),
          boxShadow: stylePrefs.shadows_enabled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        }}>
        <div
          className="nav-brand"
          style={{ color: getComponentColor("navigation", "text_color", formData.primary_hex) }}>
          Brand
        </div>
        <div className="nav-links">
          {["Home", "About", "Services", "Contact"].map((link, index) => (
            <button
              key={link}
              type="button"
              className="nav-link-button"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                color: getComponentColor("navigation", "text_color", "#1f2937"),
                cursor: "pointer",
                font: "inherit",
                textDecoration: "underline",
                animation: stylePrefs.animations_enabled
                  ? `fadeInDown ${0.3 + index * 0.1}s ease-out`
                  : "none",
              }}
              aria-label={link}
              tabIndex={0}>
              {link}
            </button>
          ))}
        </div>
      </nav>

      <div className="preview-content">
        {/* Hero Section */}
        <div
          className={`preview-hero ${stylePrefs.hero_style === "gradient" ? "gradient-bg" : "solid-bg"}`}
          style={{
            backgroundColor: stylePrefs.hero_style === "gradient" ? "transparent" : formData.primary_hex,
            backgroundImage:
              stylePrefs.hero_style === "gradient"
                ? `linear-gradient(135deg, ${formData.primary_hex}, ${formData.secondary_hex})`
                : "none",
            borderRadius:
              stylePrefs.border_radius === "none"
                ? "0"
                : radiusMap[stylePrefs.border_radius] || radiusMap.medium,
            boxShadow: stylePrefs.shadows_enabled ? "0 10px 25px rgba(0,0,0,0.1)" : "none",
          }}>
          <h1
            style={{
              color: getComponentColor("hero", "text_color", formData.background_hex || "#ffffff"),
              animation: stylePrefs.animations_enabled ? "fadeInUp 0.6s ease-out" : "none",
            }}>
            Welcome to Your Site
          </h1>
          <p
            style={{
              color: getComponentColor("hero", "text_color", formData.background_hex || "#ffffff"),
              opacity: 0.9,
              animation: stylePrefs.animations_enabled ? "fadeInUp 0.8s ease-out" : "none",
            }}>
            Beautiful design meets powerful functionality
          </p>
          <button
            className="preview-button"
            style={{
              backgroundColor: getHeroButtonColor("primary", "background_color", formData.accent_hex),
              color: getHeroButtonColor("primary", "text_color", formData.background_hex),
              borderRadius: radiusMap[stylePrefs.border_radius] || radiusMap.medium,
              boxShadow: stylePrefs.shadows_enabled ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              animation: stylePrefs.animations_enabled ? "fadeInUp 1s ease-out" : "none",
            }}>
            Get Started
          </button>
        </div>

        {/* Content Section */}
        <div
          className="preview-content-section"
          style={{
            backgroundColor: getComponentColor("content", "background_color", formData.ui_hex),
            color: getComponentColor("content", "text_color", "#1f2937"),
          }}>
          <div className="content-grid">
            {[1, 2, 3].map((item, index) => (
              <div
                key={item}
                className="content-card"
                style={{
                  backgroundColor: getComponentColor("card", "background_color", formData.ui_hex),
                  borderColor: getComponentColor("card", "border_color", "#e5e7eb"),
                  borderRadius: radiusMap[stylePrefs.border_radius] || radiusMap.medium,
                  boxShadow: stylePrefs.shadows_enabled
                    ? "0 4px 12px rgba(0,0,0,0.08)"
                    : `1px 1px 3px #e5e7eb`,
                  animation: stylePrefs.animations_enabled
                    ? `fadeInUp ${0.4 + index * 0.2}s ease-out`
                    : "none",
                }}>
                <div
                  className="card-icon"
                  style={{
                    backgroundColor: formData.secondary_hex,
                    borderRadius: radiusMap[stylePrefs.border_radius] || radiusMap.medium,
                  }}></div>
                <h3 style={{ color: getComponentColor("card", "text_color", "#1f2937") }}>Feature {item}</h3>
                <p style={{ color: getComponentColor("card", "text_color", "#1f2937"), opacity: 0.7 }}>
                  Showcase your amazing features with this beautiful card design.
                </p>
                <button
                  style={{
                    backgroundColor: getComponentColor("button", "background_color", formData.primary_hex),
                    color: getComponentColor("button", "text_color", formData.background_hex),
                    borderRadius: radiusMap[stylePrefs.border_radius] || radiusMap.medium,
                    boxShadow: stylePrefs.shadows_enabled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  }}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="preview-footer"
          style={{
            backgroundColor: getComponentColor("footer", "background_color", "#1f2937"),
            color: getComponentColor("footer", "text_color", formData.ui_hex),
            borderTopColor: getComponentColor("footer", "border_color", "#e5e7eb"),
          }}>
          <p>&copy; 2024 Your Website. Built with Bashville.</p>
        </footer>
      </div>
    </div>
  );
};
