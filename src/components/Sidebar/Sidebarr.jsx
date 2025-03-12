import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import navLinks from "../../assets/dummy-data/navLinks";
import "./Sidebar.css";
import logo from "../../assets/images/quickcab.png"; // Replace with your actual logo path

const Sidebar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/AdminLogin"; // Ensure this matches your Router.jsx

  const [isOpen, setIsOpen] = useState(false); // Keep hooks at the top

  if (isLoginPage) return null; // Now return null here

  return (
    <>
      {/* Toggle Button */}
      <button className="sidebar__toggle" onClick={() => setIsOpen(!isOpen)}>
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
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__link" : "nav__link"
                    }
                    onClick={() => setIsOpen(false)} // Close sidebar on link click
                  >
                    <i className={item.icon}></i>
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar__bottom">
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
