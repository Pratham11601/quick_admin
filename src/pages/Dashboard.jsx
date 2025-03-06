import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import SingleCard from "../components/reuseable/SingleCard";

const Dashboard = () => {
  const [vendorCount, setVendorCount] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [activeLeads, setActiveLeads] = useState(0);
  const [inactiveLeads, setInactiveLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch vendors
        const vendorResponse = await fetch("https://quickcabpune.com/admin/api/vendor");
        const vendorData = await vendorResponse.json();
        
        if (Array.isArray(vendorData)) {
          setVendorCount(vendorData.length);
        } else if (vendorData.data && Array.isArray(vendorData.data)) {
          setVendorCount(vendorData.data.length);
        }

        // Fetch leads
        const leadsResponse = await fetch("https://quickcabpune.com/admin/api/leads");
        const leadsData = await leadsResponse.json();
        
        if (leadsData && leadsData.data) {
          const leads = Array.isArray(leadsData) ? leadsData : leadsData.data;
          
          // Calculate total leads
          setTotalLeads(leads.length);
          
          // Calculate active leads (assuming 'status' field exists and can be 'active' or 'inactive')
          const active = leads.filter(lead => lead.status === 'active').length;
          setActiveLeads(active);
          
          // Calculate inactive leads
          setInactiveLeads(leads.length - active);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Card data objects
  const vendorCardData = {
    title: "Total Vendors",
    totalNumber: loading ? "Loading..." : vendorCount,
    icon: "ri-truck-line",
  };

  const totalLeadsCardData = {
    title: "Total Leads",
    totalNumber: loading ? "Loading..." : totalLeads,
    icon: "ri-group-line",
  };

  const activeLeadsCardData = {
    title: "Active Leads",
    totalNumber: loading ? "Loading..." : activeLeads,
    icon: "ri-user-star-line",
  };

  const inactiveLeadsCardData = {
    title: "Inactive Leads",
    totalNumber: loading ? "Loading..." : inactiveLeads,
    icon: "ri-user-unfollow-line",
  };

  return (
    <div className="dashboard">
      <div className="dashboard__wrapper">
        <div className="dashboard__cards">
          <SingleCard item={vendorCardData} />
          <SingleCard item={totalLeadsCardData} />
          <SingleCard item={activeLeadsCardData} />
          <SingleCard item={inactiveLeadsCardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;