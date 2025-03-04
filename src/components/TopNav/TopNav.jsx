import React from "react";
import { Link, useLocation } from "react-router-dom";
import profileImg from "../../assets/images/profile-02.png";
import "./TopNav.css";

const TopNav = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/AdminLogin"; // Ensure this matches the correct route

  if (isLoginPage) return null; // Hide TopNav on AdminLogin.jsx

  return (
    <div className="top__nav">
      <div className="top__nav-wrapper">
        <div className="search__box">
          <input type="text" placeholder="search or type" />
          <span>
            <i className="ri-search-line"></i>
          </span>
        </div>
        <div className="top__nav-right">
          <span className="notification">
            <i className="ri-notification-3-line"></i>
            <span className="badge">1</span>
          </span>
          <div className="profile">
            <Link to="/settings">
              <img src={profileImg} alt="Profile" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
