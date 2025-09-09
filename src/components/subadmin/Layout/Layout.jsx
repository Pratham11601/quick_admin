import React from "react";
import { useLocation,Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebarr";
import TopNav from "../TopNav/TopNav";

const Layout = () => {
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin-login"; // Check if current page is AdminLogin

  return (
    <div className="layout">
      {!isAdminLogin && <Sidebar />} {/* Hide Sidebar on AdminLogin */}
      <div className="main__layout">
        {!isAdminLogin && <TopNav />} {/* Hide TopNav on AdminLogin */}
        <div className="content">
          {/* <Router /> */}
          <Outlet />
        </div>   
      </div>
    </div>
  );
};

export default Layout;
