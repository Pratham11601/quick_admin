import React from "react";
import "../styles/Dashboard.css";
import SingleCard from "../components/reuseable/SingleCard";

// import MileChart from "../charts/MileCharts";
// import CarStatsChart from "../charts/CarStatsChart";

const carObj = {
  title: "Total Vendors",
  totalNumber: 1673,
  icon: "ri-truck-line",
};

const tripObj = {
  title: "Total Leads ",
  totalNumber: 1697,
  icon: "ri-group-line",
};

const clientObj = {
  title: "Active Leads",
  totalNumber: 0,
  icon: "ri-user-star-line",
};


const distanceObj = {
  title: "InActive Leads",
  totalNumber: 339,
  icon: "ri-user-unfollow-line",
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__wrapper">
        <div className="dashboard__cards">
          <SingleCard item={carObj} />
          <SingleCard item={tripObj} />
          <SingleCard item={clientObj} />
          <SingleCard item={distanceObj} />
        </div>

        

        
        </div>
      </div>
  );
};

export default Dashboard;
