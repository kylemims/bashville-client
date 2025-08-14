import "./ColorPreview.css";

export const ColorPreview = ({ palette, size = "sm", showTooltip = false }) => {
  if (!palette) return null;

  const colors = [
    { name: "Primary", hex: palette.primary_hex },
    { name: "Secondary", hex: palette.secondary_hex },
    { name: "Accent", hex: palette.accent_hex },
    { name: "Background", hex: palette.background_hex },
  ];

  return (
    <div className={`color-preview color-preview--${size}`}>
      {colors.map((color, index) => (
        <div
          key={color.name}
          className="color-swatch"
          style={{ backgroundColor: color.hex }}
          title={showTooltip ? `${color.name}: ${color.hex}` : undefined}
          aria-label={`${color.name} color: ${color.hex}`}
        />
      ))}
    </div>
  );
};
