export const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="error-dismiss">
          ✕
        </button>
      )}
    </div>
  );
};
