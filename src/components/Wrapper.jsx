const Wrapper = ({ children, wide = false }) => {
  return (
    <div className={`wrapper ${wide ? "wrapper--wide" : ""}`}>
      <div className={wide ? "container-wide" : "container"}>{children}</div>
    </div>
  );
};
export default Wrapper;
