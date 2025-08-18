// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Navbar.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--color-primary)" : "var(--text)",
    fontWeight: isActive ? 800 : 600,
  });

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-box">
          <Link to="/">
            <img src="/assets/images/box-logo.svg" alt="Bash Stash Logo" className="navbar-logo" />
          </Link>
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            BASH STASH
          </Link>
        </div>
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`navbar-nav ${isMenuOpen ? "navbar-nav--open" : ""}`}>
          {/* <NavLink to="/" style={linkStyle} onClick={closeMenu}>
            Home
          </NavLink> */}

          {isAuthenticated ? (
            // Authenticated user menu
            <>
              <NavLink to="/dashboard" style={linkStyle} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/projects/new" style={linkStyle} onClick={closeMenu}>
                New Project
              </NavLink>
              {/* <NavLink to="/template" style={linkStyle} onClick={closeMenu}>
                Template
              </NavLink> */}

              <div className="navbar-user-section">
                <span className="navbar-user-greeting">Hey, {user?.username || "User"}!</span>
                <button onClick={handleLogout} className="navbar-logout-btn" aria-label="Logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Guest user menu - only show when NOT authenticated
            <>
              <NavLink to="/register" style={linkStyle} onClick={closeMenu}>
                Register
              </NavLink>
              <NavLink to="/login" style={linkStyle} onClick={closeMenu}>
                Login
              </NavLink>
              {/* <NavLink to="/template" style={linkStyle} onClick={closeMenu}>
                Template
              </NavLink> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
