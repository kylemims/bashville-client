import { useEffect, useState, useCallback } from "react";
import { BORDER_RADIUS, LAYOUT_STYLES } from "../../utils/styleConstants.js";
import "./LiveColorPreview.css";

export const LiveColorPreview = ({
  formData,
  isVisible = true,
  isMobilePreview = false,
  onTogglePreview,
}) => {
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

  // Helper function to get feature-specific colors
  const getFeatureColor = (featureId, colorType, defaultColor) => {
    const stylePrefs = formData.style_preferences || {};
    const featureKey = `feature_${featureId}_${colorType}`;

    if (stylePrefs[featureKey]) {
      return stylePrefs[featureKey];
    }

    return defaultColor;
  };

  // Helper function to get theme-specific shadows with shadows_enabled override
  const getThemeShadow = (elementType) => {
    const stylePrefs = formData.style_preferences || {};

    // If shadows are disabled globally, return none regardless of theme
    if (stylePrefs.shadows_enabled === false) {
      return "none";
    }

    const theme = LAYOUT_STYLES[stylePrefs.style_theme] || LAYOUT_STYLES.modern;

    // Map element types to shadow properties
    const shadowMap = {
      card: theme.css.cardShadow,
      button: theme.css.buttonShadow,
      nav: theme.css.cardShadow, // Navigation uses card shadow
      hero: theme.css.cardShadow, // Hero uses card shadow
    };

    return shadowMap[elementType] || "none";
  };

  // Helper function to get element-specific border radius
  const getElementRadius = (elementType) => {
    const stylePrefs = formData.style_preferences || {};
    const radiusKey = `${elementType}_radius`;
    const radiusValue = stylePrefs[radiusKey] || "medium";
    return BORDER_RADIUS[radiusValue]?.css || BORDER_RADIUS.medium.css;
  };

  // Helper function to get hero background styles
  const getHeroBackgroundStyle = useCallback(() => {
    const stylePrefs = formData.style_preferences || {};
    const backgroundType = stylePrefs.hero_background_type || "gradient";

    console.log("🎨 Hero background type:", backgroundType, "Style prefs:", stylePrefs);

    switch (backgroundType) {
      case "gradient":
        const direction = stylePrefs.hero_gradient_direction || "135deg";
        const primary = formData.primary_hex || "#3b82f6";
        const secondary = formData.secondary_hex || "#1e40af";
        return {
          backgroundColor: "transparent",
          backgroundImage: `linear-gradient(${direction}, ${primary}, ${secondary})`,
        };

      case "solid":
        const solidColor = stylePrefs.hero_background_color || formData.primary_hex || "#3b82f6";
        return {
          backgroundColor: solidColor,
          backgroundImage: "none",
        };

      case "transparent":
        return {
          backgroundColor: "transparent",
          backgroundImage: "none",
        };

      case "image":
        const imageUrl = stylePrefs.hero_background_image || "";
        const overlayColor = stylePrefs.hero_overlay_color || formData.primary_hex || "#3b82f6";
        const overlayOpacity = (stylePrefs.hero_overlay_opacity || 70) / 100;

        if (imageUrl) {
          // Convert hex to rgb for overlay
          const hex = overlayColor.replace("#", "");
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);

          return {
            backgroundColor: overlayColor,
            backgroundImage: `linear-gradient(rgba(${r}, ${g}, ${b}, ${overlayOpacity}), rgba(${r}, ${g}, ${b}, ${overlayOpacity})), url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          };
        } else {
          // Fallback to solid color if no image
          return {
            backgroundColor: overlayColor,
            backgroundImage: "none",
          };
        }

      default:
        return {
          backgroundColor: formData.primary_hex || "#3b82f6",
          backgroundImage: "none",
        };
    }
  }, [formData]);

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

    // Hero section styling - updated to use new background system
    const heroStyles = getHeroBackgroundStyle();
    if (heroStyles.backgroundImage && heroStyles.backgroundImage !== "none") {
      root.style.setProperty("--hero-background", heroStyles.backgroundImage);
    } else {
      root.style.setProperty(
        "--hero-background",
        heroStyles.backgroundColor || formData.primary_hex || "#fee394"
      );
    }

    // Border radius
    const borderRadius = stylePrefs.border_radius || "medium";
    const radiusValue = getRadiusValue(borderRadius);
    root.style.setProperty("--border-radius", radiusValue);

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
  }, [formData, mounted, getHeroBackgroundStyle]);

  if (!isVisible || !formData) {
    return null;
  }

  const stylePrefs = formData.style_preferences || {};

  // Get radius values using centralized constants
  const getRadiusValue = (radiusKey) => {
    return BORDER_RADIUS[radiusKey] || BORDER_RADIUS.medium;
  };

  // Visual indicators for applied styles
  const getStyleIndicators = () => {
    const indicators = [];

    const backgroundType = stylePrefs.hero_background_type || "gradient";
    if (backgroundType !== "gradient") {
      indicators.push(`${backgroundType.charAt(0).toUpperCase() + backgroundType.slice(1)} Hero`);
    } else {
      indicators.push("Gradient Hero");
    }

    if (stylePrefs.animations_enabled) {
      indicators.push("Animations");
    }

    // Show theme information instead of generic shadows toggle
    const theme = LAYOUT_STYLES[stylePrefs.style_theme] || LAYOUT_STYLES.modern;
    indicators.push(`${theme.name} Theme`);

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
      <div className={`preview-wrapper ${isMobilePreview ? "mobile-preview" : "desktop-preview"}`}>
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
            boxShadow: getThemeShadow("nav"),
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
            className="preview-hero"
            style={{
              ...getHeroBackgroundStyle(),
              borderRadius: getElementRadius("hero"),
              boxShadow: getThemeShadow("hero"),
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
                borderRadius: getElementRadius("button"),
                boxShadow: getThemeShadow("button"),
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
                    backgroundColor: getFeatureColor(item, "bg", formData.ui_hex || "#ffffff"),
                    borderColor: getComponentColor("card", "border_color", "#e5e7eb"),
                    borderRadius: getElementRadius("card"),
                    boxShadow: getThemeShadow("card"),
                    animation: stylePrefs.animations_enabled
                      ? `fadeInUp ${0.4 + index * 0.2}s ease-out`
                      : "none",
                  }}>
                  <div
                    className="card-icon"
                    style={{
                      backgroundColor: getFeatureColor(item, "accent", formData.secondary_hex || "#3b82f6"),
                      borderRadius: getElementRadius("card"),
                    }}></div>
                  <h3 style={{ color: getFeatureColor(item, "text", "#1f2937") }}>Feature {item}</h3>
                  <p style={{ color: getFeatureColor(item, "text", "#1f2937"), opacity: 0.7 }}>
                    Showcase your amazing features with this beautiful card design.
                  </p>
                  <button
                    style={{
                      backgroundColor: getFeatureColor(item, "accent", formData.primary_hex || "#3b82f6"),
                      color: "#ffffff",
                      borderRadius: getElementRadius("button"),
                      boxShadow: getThemeShadow("button"),
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
    </div>
  );
};
