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
        console.log("Vendor Data:", vendorData);

        if (vendorData && Array.isArray(vendorData.data)) {
          setVendorCount(vendorData.data.length);
        } else if (Array.isArray(vendorData)) {
          setVendorCount(vendorData.length);
        } else {
          setVendorCount(0);
        }

        // Fetch leads
        const leadsResponse = await fetch("https://quickcabpune.com/app/leads");
        const leadsData = await leadsResponse.json();
        console.log("Leads Data:", leadsData);

        let leadsArray = [];
        if (leadsData && Array.isArray(leadsData)) {
          leadsArray = leadsData;
        } else if (leadsData && leadsData.data && Array.isArray(leadsData.data)) {
          leadsArray = leadsData.data;
        }

        if (leadsArray.length > 0) {
          setTotalLeads(leadsArray.length);

          const active = leadsArray.filter(
            (lead) => lead.status && lead.status.toLowerCase() === "active"
          ).length;
          setActiveLeads(active);
          setInactiveLeads(leadsArray.length - active);
        } else {
          setTotalLeads(0);
          setActiveLeads(0);
          setInactiveLeads(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setVendorCount(0);
        setTotalLeads(0);
        setActiveLeads(0);
        setInactiveLeads(0);
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
