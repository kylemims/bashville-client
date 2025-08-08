const Wrapper = ({ children }) => {
  return (
    <div className="wrapper">
      <div className="container flex flex-col items-center">{children}</div>
    </div>
  );
};
export default Wrapper;
