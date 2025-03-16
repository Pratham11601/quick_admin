import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

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
import Advertisements from "../pages/Advertisements";


const Router = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/sell-car" element={
          <ProtectedRoute>
            <SellCar />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/cities" element={
          <ProtectedRoute>
            <Cities />
          </ProtectedRoute>
        } />
        <Route path="/category" element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } />
        <Route path="/sub-packages" element={
          <ProtectedRoute>
            <Subpackages />
          </ProtectedRoute>
        } />
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        } />
        <Route path="/leads" element={
          <ProtectedRoute>
            <ManageLeads />
          </ProtectedRoute>
        } />
        <Route path="/vendor-details" element={
          <ProtectedRoute>
            <VendorDetails />
          </ProtectedRoute>
        } />
        <Route path="/help-support" element={
          <ProtectedRoute>
            <HelpSupport />
          </ProtectedRoute>
        } />
        <Route path="/password-settings" element={
          <ProtectedRoute>
            <PasswordSettings />
          </ProtectedRoute>
        } />
        <Route path="/email-settings" element={
          <ProtectedRoute>
            <EmailSettings />
          </ProtectedRoute>
        } />
        <Route path="/advertisements" element={
          <ProtectedRoute>
            <Advertisements />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
};

export default Router;

//  <Route path="/" element={<Navigate to="/dashboard" />} />
   // <Route path="/admin/*" element={<AdminRoutes />} />
  // <Route path="/" element={<HomeNavigate />} />
    // <Route path="/" element={<Navigate to="/dashboard" />} />
        // <Route path="/admin-login" element={<AdminLogin />} />
