import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import SingleCard from "../components/reuseable/SingleCard";

const Dashboard = () => {
  const [leadsData, setLeadsData] = useState(null);
  const [vendorCount, setVendorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch vendors
        const vendorResponse = await fetch("https://quickcabpune.com/admin/api/vendor");
        const vendorData = await vendorResponse.json();
        console.log("Vendor Data:", vendorData);

        if (vendorData && Array.isArray(vendorData.data)) {
          setVendorCount(vendorData.data.length);
        } else if (Array.isArray(vendorData)) {
          setVendorCount(vendorData.length);
        } else {
          setVendorCount(0);
        }

        // Fetch leads
        const leadsResponse = await fetch("https://quickcabpune.com/app/leads/stats");
        const leadsStats = await leadsResponse.json();
        console.log("Leads Stats:", leadsStats);

        setLeadsData(leadsStats);
      } catch (error) {
        console.error("Error fetching data:", error);
        setVendorCount(0);
        setLeadsData({ totalLeads: 0, activeLeads: 0, inactiveLeads: 0, currentMonthLeads: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Card data objects
  const vendorCardData = {
    title: "Total Vendors",
    totalNumber: vendorCount,
    icon: "ri-truck-line",
  };

  const totalLeadsCardData = {
    title: "Total Leads",
    totalNumber: leadsData?.totalLeads || 0,
    icon: "ri-group-line",
  };

  const activeLeadsCardData = {
    title: "Active Leads",
    totalNumber: leadsData?.activeLeads || 0,
    icon: "ri-user-star-line",
  };

  const inactiveLeadsCardData = {
    title: "Inactive Leads",
    totalNumber: leadsData?.inactiveLeads || 0,
    icon: "ri-user-unfollow-line",
  };

  const currentMonthLeadsCardData = {
    title: "Current Month Leads",
    totalNumber: leadsData?.currentMonthLeads || 0,
    icon: "ri-calendar-event-line",
  };

  return (
    <div className="dashboard common-main-content-wrapper">
      <div className="dashboard__wrapper">
        <div className="dashboard__cards">
          <SingleCard item={vendorCardData} />
          <SingleCard item={totalLeadsCardData} />
          <SingleCard item={activeLeadsCardData} />
          <SingleCard item={inactiveLeadsCardData} />
          <SingleCard item={currentMonthLeadsCardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
