export const LoadingSpinner = ({ size = "md", text }) => {
  return (
    <div className={`loading loading--${size}`}>
      <div className="spinner" />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};
