import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import SellCar from "../pages/SellCar";
import Settings from "../pages/Settings";
import Cities from "../pages/Cities";
import Category from "../pages/Category"; 
import Subpackages from "../pages/Sub-packages"; 
import Subscriptions from "../pages/Subscriptions"; 
import ManageLeads from "../pages/ManageLeads"; 
import VendorDetails from "../pages/VendorDetails"; 
import HelpSupport from "../pages/HelpSupport";  
import PasswordSettings from "../pages/PasswordSettings"; 
import EmailSettings from "../pages/EmailSettings";

const Router = () => {
 return (
     <Routes>
        {/* Redirect /admin to dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

        {/* Login Page */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Panel Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/sell-car" element={<SellCar />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/cities" element={<Cities />} />
        <Route path="/admin/category" element={<Category />} /> 
        <Route path="/admin/sub-packages" element={<Subpackages />} /> 
        <Route path="/admin/subscriptions" element={<Subscriptions />} /> 
        <Route path="/admin/leads" element={<ManageLeads />} /> 
        <Route path="/admin/vendor-details" element={<VendorDetails />} /> 
        <Route path="/admin/help-support" element={<HelpSupport />} />
        <Route path="/admin/password-settings" element={<PasswordSettings />} />
        <Route path="/admin/email-settings" element={<EmailSettings />} />
    </Routes>
  );
};

export default Router;

//  <Route path="/" element={<Navigate to="/dashboard" />} />
   // <Route path="/admin/*" element={<AdminRoutes />} />
  // <Route path="/" element={<HomeNavigate />} />
    // <Route path="/" element={<Navigate to="/dashboard" />} />
        // <Route path="/admin-login" element={<AdminLogin />} />
