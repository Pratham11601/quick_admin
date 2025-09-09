import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import navLinks from "../../../assets/dummy-data/navLinks";
import "./Sidebar.css";
import logo from "../../../assets/images/quickcab.png";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/AdminLogin";

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login');
    }
  };

  // Close sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && !e.target.closest(".sidebar") && !e.target.closest(".sidebar__toggle")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  if (isLoginPage) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        className="sidebar__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar__top">
          <h2>
            <span>
              <img src={logo} alt="QuickCabs Logo" className="sidebar__logo" />
            </span>{" "}
            QuickCabs
          </h2>
        </div>

        <div className="sidebar__content">
          <div className="menu">
            <ul className="nav__list ps-0">
              {navLinks.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "nav__active nav__link" : "nav__link"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <i className={item.icon}></i>
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="sidebar__bottom"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <span>
              <i className="ri-logout-circle-r-line"></i> Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
