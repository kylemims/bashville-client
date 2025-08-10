// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--color-primary)" : "var(--text)",
    fontWeight: isActive ? 800 : 600,
  });

  return (
    <header className="container mb-6">
      <div className="flex items-center justify-between">
        <Link to="/" style={{ color: "var(--color-primary)", fontWeight: 800 }}>
          BASH STASH
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/template" style={linkStyle}>
            Template
          </NavLink>
          {/* cooking: <NavLink to="/projects" style={linkStyle}>Projects</NavLink> */}
        </nav>
      </div>
    </header>
  );
};
