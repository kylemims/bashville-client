// src/App.jsx
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Wrapper from "./components/Wrapper";
import { Navbar } from "./components/Navbar";
import { ApplicationViews } from "./ApplicationViews";
import "./root.css";

// Helper component to access location inside Router
const AppShell = () => {
  const location = useLocation();
  const wideRoutes = ["/", "/template"]; // HomePage.jsx is the only current wide route
  const isWide = wideRoutes.includes(location.pathname);

  return (
    <Wrapper wide={isWide}>
      <Navbar />
      <ApplicationViews />
    </Wrapper>
  );
};

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
