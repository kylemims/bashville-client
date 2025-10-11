import { useEffect, useState, useCallback } from "react";
import { LAYOUT_STYLES, FEATURE_CARD_STYLES } from "../../utils/styleConstants.js";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { useColorSystem } from "../../hooks/useColorSystem.js";
import "./LiveColorPreview.css";

export const LiveColorPreview = ({
  formData,
  isVisible = true,
  isMobilePreview = false,
  onTogglePreview,
}) => {
  const [mounted, setMounted] = useState(false);

  // Debug: Check what data we're receiving
  console.log("🎨 LiveColorPreview received formData:", formData);
  console.log("🎨 LiveColorPreview isVisible:", isVisible);
  console.log("🎨 LiveColorPreview formData.style_preferences:", formData?.style_preferences);

  // Use our new color system hook
  const { semanticColors, getColor, getHeroButton, getFeatureColor, getThemeShadow, getElementRadius } =
    useColorSystem(formData, formData?.style_preferences);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to get feature card styles (keep this as it's specific to this component)
  const getFeatureCardStyle = (featureId) => {
    const stylePrefs = formData.style_preferences || {};
    const styleKey = `feature_${featureId}_style`;
    const styleName = stylePrefs[styleKey] || "default";
    const cardStyle = FEATURE_CARD_STYLES[styleName] || FEATURE_CARD_STYLES.default;

    const style = {
      border: cardStyle.css.border,
      boxShadow: cardStyle.css.shadow,
    };

    // Handle special properties for glass effect
    if (cardStyle.css.backdropFilter) {
      style.backdropFilter = cardStyle.css.backdropFilter;
      style.WebkitBackdropFilter = cardStyle.css.backdropFilter; // Safari support
    }

    // Override background for glass effect
    if (styleName === "glass") {
      style.backgroundColor = cardStyle.css.background;
    }

    return style;
  };

  // Default feature icons configuration
  const DEFAULT_FEATURE_ICONS = {
    1: "rocket_launch", // Performance/Speed
    2: "security", // Security/Protection
    3: "analytics", // Analytics/Data (for if we ever go back to 3 cards)
  };

  // Helper function to get feature icon
  const getFeatureIcon = (featureId) => {
    const stylePrefs = formData.style_preferences || {};
    const iconKey = `feature_${featureId}_icon`;
    return stylePrefs[iconKey] || DEFAULT_FEATURE_ICONS[featureId] || "star";
  };

  // Helper function to get hero background styles
  const getHeroBackgroundStyle = useCallback(() => {
    const stylePrefs = formData.style_preferences || {};
    const backgroundType = stylePrefs.hero_background_type || "gradient";

    console.log("🎨 Hero background type:", backgroundType, "Style prefs:", stylePrefs);

    switch (backgroundType) {
      case "gradient":
        const direction = stylePrefs.hero_gradient_direction || "135deg";
        const startColor = stylePrefs.hero_gradient_start || semanticColors.hero_background || "#3b82f6";
        const endColor = stylePrefs.hero_gradient_end || formData.secondary_hex || "#1e40af";
        return {
          backgroundColor: "transparent",
          backgroundImage: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
        };

      case "solid":
        const solidColor = stylePrefs.hero_background_color || semanticColors.hero_background || "#3b82f6";
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
        const overlayColor = stylePrefs.hero_overlay_color || semanticColors.hero_background || "#3b82f6";
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
          };
        }
        // Fallback to solid color if no image
        return {
          backgroundColor: overlayColor,
          backgroundImage: "none",
        };

      default:
        return {
          backgroundColor: semanticColors.hero_background || "#3b82f6",
          backgroundImage: "none",
        };
    }
  }, [formData, semanticColors]);

  // Update CSS custom properties whenever formData changes
  useEffect(() => {
    if (!mounted || !formData) return;

    const root = document.documentElement;

    // Use semantic colors instead of direct form data mapping
    root.style.setProperty("--primary-color", semanticColors.primary_button || "#fee394");
    root.style.setProperty("--secondary-color", semanticColors.secondary_button || "#d46a6a");
    root.style.setProperty("--accent-color", semanticColors.accent_button || "#46cba7");
    root.style.setProperty("--background-color", semanticColors.page_background || "#ffffff");
    root.style.setProperty("--ui-color", semanticColors.navigation_background || "#1f2937");
    root.style.setProperty("--text-color", semanticColors.content_text || "#1f2937");
    root.style.setProperty("--border-color", semanticColors.border_color || "#e5e7eb");

    // Hero section styling - updated to use new background system
    const heroStyles = getHeroBackgroundStyle();
    if (heroStyles.backgroundImage && heroStyles.backgroundImage !== "none") {
      root.style.setProperty("--hero-background", heroStyles.backgroundImage);
    } else {
      root.style.setProperty(
        "--hero-background",
        heroStyles.backgroundColor || semanticColors.hero_background || "#3b82f6"
      );
    }

    // Border radius using our hook
    const borderRadius = getElementRadius("default");
    root.style.setProperty("--border-radius", borderRadius);

    // Component overrides
    const stylePrefs = formData.style_preferences || {};
    const overrides = stylePrefs.component_overrides || {};
    Object.entries(overrides).forEach(([component, styles]) => {
      Object.entries(styles).forEach(([property, value]) => {
        if (value) {
          const cssVar = `--${component}-${property.replace("_", "-")}`;
          root.style.setProperty(cssVar, value);
        }
      });
    });
  }, [formData, mounted, semanticColors, getHeroBackgroundStyle, getElementRadius]);

  if (!isVisible) {
    console.log("🎨 LiveColorPreview: Not visible, returning null");
    return null;
  }

  if (!formData) {
    console.log("🎨 LiveColorPreview: No formData, returning null");
    return null;
  }

  // Check if we have the minimum required color data
  if (!formData.primary_hex && !formData.secondary_hex && !formData.accent_hex) {
    console.log("🎨 LiveColorPreview: No color data found, returning null");
    return null;
  }

  const stylePrefs = formData.style_preferences || {};
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

  // Check if dark mode preview is enabled
  const previewStylePrefs = formData.style_preferences || {};
  const isDarkModePreview = previewStylePrefs.preview_dark_mode || false;

  return (
    <div
      className={`live-preview-container ${isDarkModePreview ? "dark-mode-preview" : ""}`}
      style={{
        backgroundColor: isDarkModePreview
          ? semanticColors.page_background || "#1f2937"
          : semanticColors.page_background || "#ffffff",
      }}>
      <div className="indicator-row">
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
      </div>
      <div className={`preview-wrapper ${isMobilePreview ? "mobile-preview" : "desktop-preview"}`}>
        {/* Navigation */}
        <nav
          className="preview-nav"
          style={{
            backgroundColor: getColor("navigation", "background_color", semanticColors.navigation_background),
            borderColor: getColor("navigation", "border_color", semanticColors.border_color),
            boxShadow: getThemeShadow("nav"),
          }}>
          {isMobilePreview ? (
            // Mobile Navigation with Hamburger Menu Preview
            <div className="mobile-nav-preview">
              <div
                className="nav-brand"
                style={{ color: getColor("navigation", "text_color", semanticColors.navigation_text) }}>
                Brand
              </div>
              <div
                className="hamburger-menu-preview"
                style={{ color: getColor("navigation", "text_color", semanticColors.navigation_text) }}>
                <MaterialIcon icon="menu" size={24} />
                <span className="menu-text">Menu</span>
              </div>
            </div>
          ) : (
            // Desktop Navigation
            <>
              <div
                className="nav-brand"
                style={{ color: getColor("navigation", "text_color", semanticColors.navigation_text) }}>
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
                      color: getColor("navigation", "text_color", semanticColors.navigation_text),
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
            </>
          )}
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
                color: getColor("hero", "text_color", semanticColors.hero_text),
                animation: stylePrefs.animations_enabled ? "fadeInUp 0.6s ease-out" : "none",
              }}>
              Welcome to Your Site
            </h1>
            <p
              style={{
                color: getColor("hero", "text_color", semanticColors.hero_text),
                opacity: 0.9,
                animation: stylePrefs.animations_enabled ? "fadeInUp 0.8s ease-out" : "none",
              }}>
              Beautiful design meets powerful functionality
            </p>
            <div
              className="hero-buttons"
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}>
              <button
                className="preview-button primary"
                style={{
                  backgroundColor: getHeroButton("primary", "background_color"),
                  color: getHeroButton("primary", "text_color"),
                  borderRadius: getElementRadius("button"),
                  boxShadow: getThemeShadow("button"),
                  animation: stylePrefs.animations_enabled ? "fadeInUp 1s ease-out" : "none",
                }}>
                Get Started
              </button>
              <button
                className="preview-button accent"
                style={{
                  backgroundColor: getHeroButton("accent", "background_color"),
                  color: getHeroButton("accent", "text_color"),
                  borderRadius: getElementRadius("button"),
                  boxShadow: getThemeShadow("button"),
                  animation: stylePrefs.animations_enabled ? "fadeInUp 1.2s ease-out" : "none",
                  border: `2px solid ${getHeroButton("accent", "background_color")}`,
                }}>
                Learn More
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div
            className="preview-content-section"
            style={{
              backgroundColor: getColor("content", "background_color", semanticColors.content_background),
              color: getColor("content", "text_color", semanticColors.content_text),
            }}>
            <div className="content-grid">
              {[1, 2].map((item, index) => {
                const cardStyle = getFeatureCardStyle(item);
                const stylePrefs = formData.style_preferences || {};
                const styleName = stylePrefs[`feature_${item}_style`] || "default";

                // For glass effect, use glassmorphism background; otherwise use semantic colors
                const backgroundColor =
                  styleName === "glass"
                    ? cardStyle.backgroundColor
                    : getFeatureColor(item, "bg", semanticColors.card_background);

                return (
                  <div
                    key={item}
                    className="content-card"
                    style={{
                      backgroundColor,
                      color: getFeatureColor(item, "text", semanticColors.card_text),
                      borderRadius: getElementRadius("card"),
                      ...cardStyle,
                      animation: stylePrefs.animations_enabled
                        ? `fadeInUp ${0.4 + index * 0.2}s ease-out`
                        : "none",
                    }}>
                    <div
                      className="card-icon"
                      style={{
                        backgroundColor: getFeatureColor(item, "accent", semanticColors.accent_button),
                        borderRadius: getElementRadius("card"),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <MaterialIcon icon={getFeatureIcon(item)} size={28} color="#ffffff" filled={true} />
                    </div>
                    <h3 style={{ color: getFeatureColor(item, "text", "#1f2937") }}>Feature {item}</h3>
                    <p style={{ color: getFeatureColor(item, "text", "#1f2937"), opacity: 0.7 }}>
                      Showcase your amazing features with this beautiful card design.
                    </p>
                    <button
                      style={{
                        backgroundColor: getFeatureColor(
                          item,
                          "accent",
                          semanticColors.accent_button || formData.accent_hex || "#10b981"
                        ),
                        color: "#ffffff",
                        borderRadius: getElementRadius("button"),
                        boxShadow: getThemeShadow("button"),
                      }}>
                      Learn More
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <footer
            className="preview-footer"
            style={{
              backgroundColor: getColor("footer", "background_color", semanticColors.navigation_background),
              color: getColor("footer", "text_color", semanticColors.navigation_text),
              borderTopColor: getColor("footer", "border_color", semanticColors.border_color),
            }}>
            <p>&copy; 2024 Your Website. Built with Bashville.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
