import { BrowserRouter as Router } from "react-router-dom";
import Wrapper from "./components/Wrapper.jsx";
import "./root.css";
import { Dashboard } from "./views/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Wrapper>
        <h1>BASH STASH</h1>
        <p>Let's Stash some Bash!</p>
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
