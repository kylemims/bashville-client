// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css"; // Assuming you have a CSS file for styling

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--color-primary)" : "var(--text)",
    fontWeight: isActive ? 800 : 600,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          BASH STASH
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`navbar-nav ${isMenuOpen ? "navbar-nav--open" : ""}`}>
          <NavLink to="/" style={linkStyle} onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/dashboard" style={linkStyle} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/template" style={linkStyle} onClick={() => setIsMenuOpen(false)}>
            Template
          </NavLink>
          {/* cooking: <NavLink to="/projects" style={linkStyle}>Projects</NavLink> */}
        </nav>
      </div>
    </header>
  );
};
