import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./MentorNavbar.css";

const MentorNavbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "mentor";
  const role = "Mentor";

  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoutClick = () => setShowModal(true);

  const confirmLogout = () => {
    setShowModal(false);
    localStorage.clear()
    navigate("/login");
  };

  const cancelLogout = () => setShowModal(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => {
    setMenuOpen(false);
    setShowDropdown(false);
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleDropdownItemClick = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark msn-navbar">
        <div className="container-fluid msn-container">
          <div className="msn-brand" onClick={() => navigate("/mentor/home")}>
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
            <ul className="navbar-nav mx-auto msn-nav-list">
              <li className="nav-item">
                <NavLink to="/mentor/home" className="nav-link msn-navlink" onClick={closeMenu}>
                  Home
                </NavLink>
              </li>

              <li
                className="nav-item msn-dropdown"
                onMouseEnter={() => window.innerWidth > 767 && setShowDropdown(true)}
                onMouseLeave={() => window.innerWidth > 767 && setShowDropdown(false)}
              >
                <div className="dropdown-wrapper">
                  <span
                    className="nav-link msn-navlink dropdown-toggle"
                    onClick={toggleDropdown}
                    role="button"
                  >
                    Startup Profiles
                  </span>
                  {showDropdown && (
                    <ul className="dropdown-menu show msn-dropdown-menu">
                      <li>
                        <span
                          className="dropdown-item msn-dropdown-item"
                          onClick={() => handleDropdownItemClick("/mentor/add-startup-profile")}
                        >
                          Add Profile
                        </span>
                      </li>
                      <li>
                        <span
                          className="dropdown-item msn-dropdown-item"
                          onClick={() => handleDropdownItemClick("/mentor/view-profiles")}
                        >
                          View Profiles
                        </span>
                      </li>
                    </ul>
                  )}
                </div>
              </li>

              <li className="nav-item">
                <NavLink to="/mentor/submissions" className="nav-link msn-navlink" onClick={closeMenu}>
                  Startup Submissions
                </NavLink>
              </li>
            </ul>

            <div className="msn-actions">
              <span className="msn-user-badge">
                {userName} / {role}
              </span>
              <button className="msn-logout" onClick={handleLogoutClick}>
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

export default MentorNavbar;