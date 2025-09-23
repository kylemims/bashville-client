import "./InlineCode.css";

export const InlineCode = ({ 
  children, 
  className = "",
  copyable = false 
}) => {
  const handleCopy = async (e) => {
    if (!copyable) return;
    
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(children);
    } catch (err) {
      console.error('Failed to copy inline code:', err);
    }
  };

  return (
    <code 
      className={`inline-code ${className} ${copyable ? 'copyable' : ''}`}
      onClick={copyable ? handleCopy : undefined}
      title={copyable ? 'Click to copy' : undefined}
    >
      {children}
    </code>
  );
};