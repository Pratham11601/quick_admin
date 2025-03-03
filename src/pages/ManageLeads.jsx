import React, { useState } from "react";
import "../styles/ManageLeads.css";

const ManageLeads = () => {
  const [leads, setLeads] = useState([
    { id: 418, receivedOn: "2025-01-23", vendor: "Quick Cab Services", from: "Pune", to: "Mahabaleshwar", tripDate: "2025-01-23", tripTime: "11:41 AM", contact: "9307043155" },
    { id: 417, receivedOn: "2025-01-23", vendor: "Quick Cab Services", from: "Pune", to: "Mumbai", tripDate: "2025-01-23", tripTime: "01:00 PM", contact: "9307043155" },
    { id: 416, receivedOn: "2025-01-23", vendor: "Quick Cab Services", from: "Kolhapur", to: "Pune", tripDate: "2025-01-23", tripTime: "10:33 AM", contact: "9307043155" },
    { id: 415, receivedOn: "2025-01-22", vendor: "Girish Singh", from: "Kalyan-Dombivali", to: "Mumbai", tripDate: "2025-01-23", tripTime: "10:22 AM", contact: "9967341438" },
    { id: 414, receivedOn: "2025-01-22", vendor: "Girish Singh", from: "Kalyan-Dombivali", to: "Mumbai", tripDate: "2025-01-23", tripTime: "12:26 AM", contact: "9967341438" },
    { id: 413, receivedOn: "2025-01-22", vendor: "Girish Singh", from: "Kalyan-Dombivali", to: "Mumbai", tripDate: "2025-01-23", tripTime: "12:26 AM", contact: "9967341438" },
    { id: 412, receivedOn: "2025-01-22", vendor: "Jyotirling Travels", from: "Latur", to: "Shirdi", tripDate: "2025-01-23", tripTime: "09:00 AM", contact: "8830444416" },
    { id: 411, receivedOn: "2025-01-22", vendor: "Quick Cab Services", from: "Kolhapur", to: "Pune", tripDate: "2025-01-23", tripTime: "10:00 AM", contact: "9307043155" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  return (
    <div className="categories-page-body h-screen">
      <h1>Manage Leads</h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input type="text" placeholder="Search by anything" className="search-bar" />
        <button className="search-btn">Search</button>
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <label>Received On:</label>
        <input type="date" className="date-input" />
        <button className="filter-btn">Filter</button>
        <label>Trip Date:</label>
        <input type="date" className="date-input" />
        <button className="filter-btn">Filter</button>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Received On</th>
              <th>Vendor Name</th>
              <th>Location From</th>
              <th>Location To</th>
              <th>Trip Date</th>
              <th>Trip Time</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead, index) => (
              <tr key={lead.id}>
                <td>{indexOfFirstLead + index + 1}</td>
                <td>{lead.receivedOn}</td>
                <td>{lead.vendor}</td>
                <td>{lead.from}</td>
                <td>{lead.to}</td>
                <td>{lead.tripDate}</td>
                <td>{lead.tripTime}</td>
                <td>{lead.contact}</td>
                <td className="actions">
                  <button className="update-btn">✏️ </button>
                  <button className="delete-btn" onClick={() => handleDelete(lead.id)}>🗑️ </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(leads.length / leadsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default ManageLeads;
