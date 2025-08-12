export const ActionButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  ...props
}) => {
  const getClassName = () => {
    const base = "action-button";
    const variantClass = `action-button--${variant}`;
    const sizeClass = `action-button--${size}`;
    const disabledClass = disabled ? "action-button--disabled" : "";

    return [base, variantClass, sizeClass, disabledClass].filter(Boolean).join(" ");
  };

  return (
    <button type={type} className={getClassName()} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
