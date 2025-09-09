import "./App.css";
// import Layout from "./components/Layout/Layout";
import { AuthProvider, useAuth } from './context/AuthContext';
import { SessionTimeout } from './components/SessionTimeout';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import AdminLogin from "./pages/AdminLogin";
// import Dashboard from "../pages/Dashboard";
// import SellCar from "../pages/SellCar";
// import Settings from "../pages/Settings";
// import Cities from "../pages/Cities";
// import Category from "../pages/Category";
// import Subpackages from "../pages/Sub-packages";
// import Subscriptions from "../pages/Subscriptions";
// import ManageLeads from "../pages/ManageLeads";
// import VendorDetails from "../pages/VendorDetails";
// import HelpSupport from "../pages/HelpSupport";
// import PasswordSettings from "../pages/PasswordSettings";
// import EmailSettings from "../pages/EmailSettings";
// import Advertisements from "../pages/Advertisements";
import LoginPage from './pages/LoginPage';
import PrivateRoute from './context/PrivateRoute';


//import Dashboard from './pages/Dashboard';
import SellCar from './pages/SellCar';
import Settings from './pages/Settings';
import Cities from './pages/Cities';
import Category from './pages/Category';
import Subpackages from './pages/Sub-packages';
import Subscriptions from './pages/Subscriptions';
import ManageLeads from './pages/ManageLeads';
import VendorDetails from './pages/VendorDetails';
import HelpSupport from './pages/HelpSupport';
import PasswordSettings from './pages/PasswordSettings';
import EmailSettings from './pages/EmailSettings';
import Advertisements from './pages/Advertisements';
import Layout from './components/Layout/Layout';
import SubLayout from './components/subadmin/Layout/Layout';
import ProtectedRoute from "./components/ProtectedRouteSub";
import VendorDetailsSub from "./pages/VendorDetailsSub";

// import Sidebar from "./components/Sidebar/Sidebarr";


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute allowedRoles={["sub-admin"]} />}>
        <Route element={<SubLayout />}>
          <Route path="/sub-admin/vendor-details" element={<VendorDetailsSub />} />
        </Route>
      </Route>
      {isAuthenticated ? (
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/dashboard" element={<VendorDetails />} />
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
            <Route path="/advertisements" element={<Advertisements />} />
            {/* <Route path="/dashboard" element={<Dashboard />} />  */}
          </Route>


        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />

      )}
    </Routes>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
