import React from "react";
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
      <Route path="/" element={<Navigate to="/dashboard" />} />
       <Route path="/admin/*" element={<AdminLogin />} />
       // <Route path="/admin-login" element={<AdminLogin />} />
       <Route path="/dashboard/*" element={<Dashboard />} />
       <Route path="/sell-car" element={<SellCar />} />
       <Route path="/settings" element={<Settings />} />
       <Route path="/cities" element={<Cities />} />
      <Route path="/category" element={<Category />} /> 
      <Route path="/sub-packages" element={<Subpackages />} /> 
      <Route path="/subscriptions" element={<Subscriptions />} /> 
      <Route path="/leads" element={<ManageLeads />} /> 
      <Route path="/vendor-details" element={<VendorDetails />} /> 
      <Route path="/help-support" element={<HelpSupport />} />
      <Route path="/password-settings" element={<PasswordSettings />} />
      <Route path="/email-settings" element={<EmailSettings />} />
    </Routes>
  );
};

export default Router;
