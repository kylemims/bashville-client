/**
 * Centralized Style Configuration System
 * Works across all 4 project types:
 * 1. React + CSS
 * 2. React + Tailwind
 * 3. Django + React + CSS
 * 4. Django + React + Tailwind
 */

// Layout Style Definitions with clear visual differences
export const LAYOUT_STYLES = {
  modern: {
    name: "Modern",
    description: "Clean, minimal design with subtle shadows",
    cardStyle: "elevated",
    buttonStyle: "filled",
    heroStyle: "gradient",
    spacing: "comfortable",
    typography: "clean",
    // CSS values
    css: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      cardShadow: "0 4px 12px rgba(0,0,0,0.08)",
      buttonShadow: "0 2px 8px rgba(0,0,0,0.1)",
      spacing: "1.5rem",
      lineHeight: "1.6",
    },
    // Tailwind classes
    tailwind: {
      fontFamily: "font-sans",
      cardShadow: "shadow-lg",
      buttonShadow: "shadow-md",
      spacing: "space-y-6",
      lineHeight: "leading-relaxed",
    },
  },
  classic: {
    name: "Classic",
    description: "Traditional layout with defined borders",
    cardStyle: "bordered",
    buttonStyle: "outlined",
    heroStyle: "solid",
    spacing: "compact",
    typography: "traditional",
    css: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      cardShadow: "0 1px 3px rgba(0,0,0,0.12)",
      buttonShadow: "none",
      spacing: "1rem",
      lineHeight: "1.4",
    },
    tailwind: {
      fontFamily: "font-serif",
      cardShadow: "shadow-sm",
      buttonShadow: "shadow-none",
      spacing: "space-y-4",
      lineHeight: "leading-normal",
    },
  },
  minimal: {
    name: "Minimal",
    description: "Ultra-clean design with maximum whitespace",
    cardStyle: "flat",
    buttonStyle: "text",
    heroStyle: "transparent",
    spacing: "airy",
    typography: "minimal",
    css: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      cardShadow: "none",
      buttonShadow: "none",
      spacing: "2rem",
      lineHeight: "1.8",
    },
    tailwind: {
      fontFamily: "font-sans",
      cardShadow: "shadow-none",
      buttonShadow: "shadow-none",
      spacing: "space-y-8",
      lineHeight: "leading-loose",
    },
  },
};

// Border Radius Values
export const BORDER_RADIUS = {
  none: {
    css: "0px",
    tailwind: "rounded-none",
  },
  small: {
    css: "4px",
    tailwind: "rounded-sm",
  },
  medium: {
    css: "8px",
    tailwind: "rounded-md",
  },
  large: {
    css: "12px",
    tailwind: "rounded-lg",
  },
  xl: {
    css: "16px",
    tailwind: "rounded-xl",
  },
  full: {
    css: "9999px",
    tailwind: "rounded-full",
  },
};

// Hero Background Types
export const HERO_BACKGROUND_TYPES = {
  gradient: {
    name: "Gradient",
    description: "Primary to Secondary gradient background",
    css: (primary, secondary, direction = "135deg") =>
      `linear-gradient(${direction}, ${primary}, ${secondary})`,
    tailwind: (primary, secondary) => `bg-gradient-to-br from-[${primary}] to-[${secondary}]`,
  },
  solid: {
    name: "Solid Color",
    description: "Single solid color background",
    css: (color) => color,
    tailwind: (color) => `bg-[${color}]`,
  },
  transparent: {
    name: "Transparent",
    description: "Transparent background with subtle overlay",
    css: () => "transparent",
    tailwind: () => "bg-transparent",
  },
  image: {
    name: "Background Image",
    description: "Custom background image with color overlay",
    css: (color, imageUrl) => `linear-gradient(rgba(${color}, 0.7), rgba(${color}, 0.7)), url(${imageUrl})`,
    tailwind: (color, imageUrl) =>
      `bg-[linear-gradient(rgba(${color},0.7),rgba(${color},0.7)),url(${imageUrl})]`,
  },
};

// Feature Card Styles
export const FEATURE_CARD_STYLES = {
  default: {
    name: "Default",
    css: {
      background: "var(--ui-color)",
      border: "1px solid #e5e7eb",
      shadow: "0 1px 3px rgba(0,0,0,0.12)",
    },
    tailwind: "bg-white border border-gray-200 shadow-sm",
  },
  elevated: {
    name: "Elevated",
    css: {
      background: "var(--ui-color)",
      border: "none",
      shadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    tailwind: "bg-white shadow-lg border-0",
  },
  outlined: {
    name: "Outlined",
    css: {
      background: "transparent",
      border: "2px solid var(--primary-color)",
      shadow: "none",
    },
    tailwind: "bg-transparent border-2 border-primary shadow-none",
  },
  glass: {
    name: "Glass",
    css: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
    },
    tailwind: "bg-white/10 border border-white/20 shadow-xl backdrop-blur-sm",
  },
  minimal: {
    name: "Minimal",
    css: {
      background: "transparent",
      border: "none",
      shadow: "none",
    },
    tailwind: "bg-transparent border-0 shadow-none",
  },
};

// Default Style Preferences
export const DEFAULT_STYLE_PREFERENCES = {
  // Layout
  layout_style: "modern",

  // Border Radius
  card_radius: "medium",
  button_radius: "medium",
  hero_radius: "none",

  // Effects
  shadows_enabled: true,
  animations_enabled: true,

  // Hero Section
  hero_background_type: "gradient",
  hero_background_color: null,
  hero_gradient_direction: "135deg",

  // Individual Feature Cards
  feature_1_bg: null,
  feature_1_text: null,
  feature_1_accent: null,
  feature_1_style: "default",

  feature_2_bg: null,
  feature_2_text: null,
  feature_2_accent: null,
  feature_2_style: "default",

  feature_3_bg: null,
  feature_3_text: null,
  feature_3_accent: null,
  feature_3_style: "default",

  // Component Overrides
  component_overrides: {},
};

// Helper function to get smart defaults based on layout style
export const getSmartDefaults = (layoutStyle) => {
  const baseDefaults = { ...DEFAULT_STYLE_PREFERENCES };

  switch (layoutStyle) {
    case "classic":
      return {
        ...baseDefaults,
        layout_style: "classic",
        card_radius: "small",
        button_radius: "small",
        shadows_enabled: false,
        animations_enabled: false,
        hero_background_type: "solid",
      };

    case "minimal":
      return {
        ...baseDefaults,
        layout_style: "minimal",
        card_radius: "none",
        button_radius: "none",
        shadows_enabled: false,
        animations_enabled: false,
        hero_background_type: "transparent",
      };

    default: // modern
      return baseDefaults;
  }
};

// CSS Generator for all project types
export const generateStyleCSS = (formData, projectType = "react-css") => {
  const { style_preferences = {} } = formData;
  const layoutStyle = LAYOUT_STYLES[style_preferences.layout_style || "modern"];

  if (projectType.includes("tailwind")) {
    return generateTailwindConfig(formData, style_preferences);
  } else {
    return generateCSSVariables(formData, style_preferences, layoutStyle);
  }
};

// Generate CSS Variables for CSS-based projects
const generateCSSVariables = (formData, stylePrefs, layoutStyle) => {
  const cardRadius = BORDER_RADIUS[stylePrefs.card_radius || "medium"].css;
  const buttonRadius = BORDER_RADIUS[stylePrefs.button_radius || "medium"].css;
  const heroRadius = BORDER_RADIUS[stylePrefs.hero_radius || "none"].css;

  return `
/* Generated styles for ${formData.name || "Project"} */
:root {
  /* Color Palette */
  --primary-color: ${formData.primary_hex};
  --secondary-color: ${formData.secondary_hex};
  --accent-color: ${formData.accent_hex};
  --background-color: ${formData.background_hex};
  --ui-color: ${formData.ui_hex};
  
  /* Layout Styles */
  --layout-style: ${stylePrefs.layout_style || "modern"};
  --font-family: ${layoutStyle.css.fontFamily};
  --spacing: ${layoutStyle.css.spacing};
  --line-height: ${layoutStyle.css.lineHeight};
  
  /* Border Radius */
  --card-radius: ${cardRadius};
  --button-radius: ${buttonRadius};
  --hero-radius: ${heroRadius};
  
  /* Effects */
  --card-shadow: ${stylePrefs.shadows_enabled ? layoutStyle.css.cardShadow : "none"};
  --button-shadow: ${stylePrefs.shadows_enabled ? layoutStyle.css.buttonShadow : "none"};
  
  /* Hero Background */
  --hero-background: ${generateHeroBackground(formData, stylePrefs)};
}

/* Feature Card Styles */
${generateFeatureCardCSS(formData, stylePrefs)}

/* Component Overrides */
${generateComponentOverrideCSS(stylePrefs.component_overrides || {})}
  `;
};

// Generate Tailwind Configuration
const generateTailwindConfig = (formData, stylePrefs) => {
  const layoutStyle = LAYOUT_STYLES[stylePrefs.layout_style || "modern"];

  return {
    theme: {
      extend: {
        colors: {
          primary: formData.primary_hex,
          secondary: formData.secondary_hex,
          accent: formData.accent_hex,
          background: formData.background_hex,
          ui: formData.ui_hex,
        },
        fontFamily: {
          sans:
            layoutStyle.tailwind.fontFamily === "font-sans"
              ? ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
              : ["Georgia", "Times New Roman", "serif"],
        },
        borderRadius: {
          card: BORDER_RADIUS[stylePrefs.card_radius || "medium"].css,
          button: BORDER_RADIUS[stylePrefs.button_radius || "medium"].css,
          hero: BORDER_RADIUS[stylePrefs.hero_radius || "none"].css,
        },
      },
    },
  };
};

// Generate Hero Background
const generateHeroBackground = (formData, stylePrefs) => {
  const backgroundType = stylePrefs.hero_background_type || "gradient";
  const heroBackground = HERO_BACKGROUND_TYPES[backgroundType];

  switch (backgroundType) {
    case "gradient":
      return heroBackground.css(
        formData.primary_hex,
        formData.secondary_hex,
        stylePrefs.hero_gradient_direction || "135deg"
      );
    case "solid":
      return heroBackground.css(stylePrefs.hero_background_color || formData.primary_hex);
    case "transparent":
      return heroBackground.css();
    default:
      return heroBackground.css(formData.primary_hex, formData.secondary_hex);
  }
};

// Generate Feature Card CSS
const generateFeatureCardCSS = (formData, stylePrefs) => {
  let css = "";

  for (let i = 1; i <= 3; i++) {
    const bgColor = stylePrefs[`feature_${i}_bg`] || formData.ui_hex;
    const textColor = stylePrefs[`feature_${i}_text`] || "#1f2937";
    const accentColor = stylePrefs[`feature_${i}_accent`] || formData.accent_hex;
    const cardStyle = FEATURE_CARD_STYLES[stylePrefs[`feature_${i}_style`] || "default"];

    css += `
.feature-card-${i} {
  background-color: ${bgColor};
  color: ${textColor};
  border: ${cardStyle.css.border};
  box-shadow: ${cardStyle.css.shadow};
}

.feature-card-${i} .accent-element {
  background-color: ${accentColor};
}
    `;
  }

  return css;
};

// Generate Component Override CSS
const generateComponentOverrideCSS = (overrides) => {
  let css = "";

  Object.entries(overrides).forEach(([component, styles]) => {
    Object.entries(styles).forEach(([property, value]) => {
      if (value) {
        css += `
.${component} {
  ${property.replace("_", "-")}: ${value};
}
        `;
      }
    });
  });

  return css;
};

// Smart Icon Library for Developers
export const DEVELOPER_ICON_LIBRARY = {
  // Feature Cards (current)
  features: {
    1: "rocket_launch", // Performance/Speed
    2: "security", // Security/Protection
    3: "analytics", // Analytics/Data (future)
  },

  // CRUD Operations - Essential for most web apps
  crud: {
    edit: "edit",
    delete: "delete",
    add: "add",
    save: "save",
    cancel: "close",
    view: "visibility",
    copy: "content_copy",
  },

  // Utility Functions - Navigation & UI essentials
  utility: {
    menu: "menu",
    search: "search",
    close: "close",
    filter: "filter_list",
    back: "arrow_back",
    forward: "arrow_forward",
    more: "more_vert",
    settings: "settings",
    home: "home",
    refresh: "refresh",
  },

  // Communication - Contact & connectivity
  communication: {
    mail: "mail",
    phone: "phone",
    sms: "sms",
    notification: "notifications",
    wifi: "wifi",
    network: "network_check",
    chat: "chat",
    video_call: "video_call",
  },

  // Business - Commerce & transactions
  business: {
    cart: "shopping_cart",
    sell: "sell",
    payment: "payment",
    inventory: "inventory",
    analytics: "analytics",
    trending: "trending_up",
    money: "attach_money",
    receipt: "receipt",
  },

  // User & Account
  user: {
    profile: "person",
    login: "login",
    logout: "logout",
    account: "account_circle",
    group: "group",
    admin: "admin_panel_settings",
  },

  // Status & Feedback
  status: {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
    loading: "hourglass_empty",
    star: "star",
    favorite: "favorite",
  },
};

// Icon Component Generator for Bash Scripts
export const generateIconComponent = () => {
  return `// Smart Icon Library - Auto-generated by Bash Stash
import { MaterialIcon } from './MaterialIcon';

export const AppIcons = {
  // CRUD Operations
  edit: (props) => <MaterialIcon icon="edit" {...props} />,
  delete: (props) => <MaterialIcon icon="delete" {...props} />,
  add: (props) => <MaterialIcon icon="add" {...props} />,
  save: (props) => <MaterialIcon icon="save" {...props} />,
  cancel: (props) => <MaterialIcon icon="close" {...props} />,
  view: (props) => <MaterialIcon icon="visibility" {...props} />,
  copy: (props) => <MaterialIcon icon="content_copy" {...props} />,

  // Navigation & Utility
  menu: (props) => <MaterialIcon icon="menu" {...props} />,
  search: (props) => <MaterialIcon icon="search" {...props} />,
  close: (props) => <MaterialIcon icon="close" {...props} />,
  filter: (props) => <MaterialIcon icon="filter_list" {...props} />,
  back: (props) => <MaterialIcon icon="arrow_back" {...props} />,
  forward: (props) => <MaterialIcon icon="arrow_forward" {...props} />,
  more: (props) => <MaterialIcon icon="more_vert" {...props} />,
  settings: (props) => <MaterialIcon icon="settings" {...props} />,
  home: (props) => <MaterialIcon icon="home" {...props} />,
  refresh: (props) => <MaterialIcon icon="refresh" {...props} />,

  // Communication
  mail: (props) => <MaterialIcon icon="mail" {...props} />,
  phone: (props) => <MaterialIcon icon="phone" {...props} />,
  sms: (props) => <MaterialIcon icon="sms" {...props} />,
  notification: (props) => <MaterialIcon icon="notifications" {...props} />,
  wifi: (props) => <MaterialIcon icon="wifi" {...props} />,
  network: (props) => <MaterialIcon icon="network_check" {...props} />,
  chat: (props) => <MaterialIcon icon="chat" {...props} />,
  videoCall: (props) => <MaterialIcon icon="video_call" {...props} />,

  // Business & Commerce
  cart: (props) => <MaterialIcon icon="shopping_cart" {...props} />,
  sell: (props) => <MaterialIcon icon="sell" {...props} />,
  payment: (props) => <MaterialIcon icon="payment" {...props} />,
  inventory: (props) => <MaterialIcon icon="inventory" {...props} />,
  analytics: (props) => <MaterialIcon icon="analytics" {...props} />,
  trending: (props) => <MaterialIcon icon="trending_up" {...props} />,
  money: (props) => <MaterialIcon icon="attach_money" {...props} />,
  receipt: (props) => <MaterialIcon icon="receipt" {...props} />,

  // User & Account
  profile: (props) => <MaterialIcon icon="person" {...props} />,
  login: (props) => <MaterialIcon icon="login" {...props} />,
  logout: (props) => <MaterialIcon icon="logout" {...props} />,
  account: (props) => <MaterialIcon icon="account_circle" {...props} />,
  group: (props) => <MaterialIcon icon="group" {...props} />,
  admin: (props) => <MaterialIcon icon="admin_panel_settings" {...props} />,

  // Status & Feedback
  success: (props) => <MaterialIcon icon="check_circle" {...props} />,
  error: (props) => <MaterialIcon icon="error" {...props} />,
  warning: (props) => <MaterialIcon icon="warning" {...props} />,
  info: (props) => <MaterialIcon icon="info" {...props} />,
  loading: (props) => <MaterialIcon icon="hourglass_empty" {...props} />,
  star: (props) => <MaterialIcon icon="star" {...props} />,
  favorite: (props) => <MaterialIcon icon="favorite" {...props} />,
};

// Usage Examples:
// <button><AppIcons.edit /> Edit Profile</button>
// <nav><AppIcons.menu size={24} /></nav>
// <AppIcons.cart color="primary" />
`;
};
