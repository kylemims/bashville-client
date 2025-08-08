import { BrowserRouter as Router } from "react-router-dom";
import Wrapper from "./components/Wrapper.jsx";
import "./root.css";

function App() {
  return (
    <Router>
      <Wrapper>
        <h1>BASH STASH</h1>
        <p>Let's Stash some Bash!</p>
        <div className="page-card">
          {/* Other components or routes can be added here */}
          <p>Welcome to the Bash Stash App!</p>
          <button className="button">Get Started</button>
        </div>
      </Wrapper>
    </Router>
  );
}

export default App;
