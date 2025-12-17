import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./EntrepreneurNavbar.css";

const EntrepreneurNavbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Entrepreneur";
  const role = "Entrepreneur";

  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoutClick = () => setShowModal(true);

  const confirmLogout = () => {
    setShowModal(false);
    localStorage.clear()
    navigate("/login");
  };

  const cancelLogout = () => setShowModal(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark esn-navbar">
        <div className="container-fluid esn-container">
          <div className="esn-brand" onClick={() => navigate("/entrepreneur/home")}>
            STARTUPNEST
          </div>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto esn-nav-list">
              <li className="nav-item">
                <NavLink to="/entrepreneur/home" className="nav-link esn-navlink" onClick={closeMenu}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/entrepreneur/mentor-opportunities"
                  className="nav-link esn-navlink"
                  onClick={closeMenu}
                >
                  Mentor Opportunities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/entrepreneur/my-submissions" className="nav-link esn-navlink" onClick={closeMenu}>
                  My Submissions
                </NavLink>
              </li>
            </ul>

            <div className="esn-actions">
              <span className="esn-user-badge">
                {userName} / {role}
              </span>
              <button className="esn-logout" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <p className="logout-text">Are you sure you want to logout?</p>
            <div className="logout-buttons">
              <button className="btn-yes" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EntrepreneurNavbar;