const Wrapper = ({ children, wide = false }) => {
  return (
    <div className="app-wrapper">
      <div className={wide ? "container-wide" : "container"}>{children}</div>
    </div>
  );
};
export default Wrapper;
