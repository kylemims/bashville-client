import { BrowserRouter as Router } from "react-router-dom";
import Wrapper from "./components/Wrapper.jsx";
import "./root.css";
import { Dashboard } from "./views/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Wrapper>
        <h1>PALETTES</h1>
        {/* <p style={{ color: "var(--color-primary)" }}>BASH STASH</p> */}
        <div className="page-card">
          <Dashboard />
          <input className="input" placeholder="Enter your email" />
          <button className="button">Get Started</button>
          <button className="button secondary">Get Started</button>
        </div>
      </Wrapper>
    </Router>
  );
}

export default App;
