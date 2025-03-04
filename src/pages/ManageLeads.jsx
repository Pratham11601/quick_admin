<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
// Import your existing CSS file
import "../styles/ManageLeads.css";

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [receivedOnFilter, setReceivedOnFilter] = useState("");
  const [tripDateFilter, setTripDateFilter] = useState("");

  // Set base URL for all API requests
  const API_BASE_URL = "http://localhost:5000/api/leads";

  // Fetch leads when component mounts or filters change
  useEffect(() => {
    fetchLeads();
  }, [currentPage, leadsPerPage]); // Only refresh automatically when page changes

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: leadsPerPage
      });
      
      if (search) params.append("search", search);
      if (receivedOnFilter) params.append("receivedOn", receivedOnFilter);
      if (tripDateFilter) params.append("tripDate", tripDateFilter);
      
      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      
      // Extract leads from API response
      if (response.data && response.data.success && response.data.data) {
        setLeads(response.data.data);
        // If API doesn't provide totalPages, estimate it
        const totalItems = response.data.data.length * 3; // Estimate total for pagination
        setTotalPages(Math.max(1, Math.ceil(totalItems / leadsPerPage)));
      } else {
        console.error("Unexpected API response format:", response.data);
        setLeads([]);
        setTotalPages(1);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(`Failed to load leads: ${err.response?.data?.message || err.message}`);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }
    
    try {
      // Ensure we're passing a numeric ID
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Invalid lead ID");
      }
      
      const response = await axios.delete(`${API_BASE_URL}/${numericId}`);
      
      // Check if delete was successful (both ways API might respond)
      if ((response.data && response.data.success) || response.status === 200) {
        // Show success message
        alert("Lead deleted successfully");
        // After successful deletion, refresh the leads list
        fetchLeads();
      } else {
        setError(`Failed to delete lead: ${response.data?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
      setError(`Failed to delete lead: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchLeads();
  };

  const handleReceivedOnFilter = () => {
    setCurrentPage(1);
    fetchLeads();
  };

  const handleTripDateFilter = () => {
    setCurrentPage(1);
    fetchLeads();
  };

  const clearFilters = () => {
    setSearch("");
    setReceivedOnFilter("");
    setTripDateFilter("");
    setCurrentPage(1);
    fetchLeads();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Improved date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString();
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
>>>>>>> 98af867 (Added new updates to NevDev branch)
  };

  return (
    <div className="categories-page-body h-screen">
      <h1>Manage Leads</h1>

<<<<<<< HEAD
      {/* Search Bar */}
      <div className="search-bar-container">
        <input type="text" placeholder="Search by anything" className="search-bar" />
        <button className="search-btn">Search</button>
=======
      {/* Display error if any */}
      {error && (
        <div style={{ 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          padding: "10px 15px", 
          borderRadius: "4px", 
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          {error}
          <button 
            onClick={() => setError(null)} 
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              fontSize: "20px",
              color: "#721c24"
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="Search by vendor, location, etc." 
          className="search-bar" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
>>>>>>> 98af867 (Added new updates to NevDev branch)
      </div>

      {/* Filter Section */}
      <div className="filter-container">
<<<<<<< HEAD
        <label>Received On:</label>
        <input type="date" className="date-input" />
        <button className="filter-btn">Filter</button>
        <label>Trip Date:</label>
        <input type="date" className="date-input" />
        <button className="filter-btn">Filter</button>
=======
        <div>
          <label>Received On:</label>
          <input 
            type="date" 
            value={receivedOnFilter}
            onChange={(e) => setReceivedOnFilter(e.target.value)}
          />
          <button className="filter-btn" onClick={handleReceivedOnFilter}>Filter</button>
        </div>
        
        <div>
          <label>Trip Date:</label>
          <input 
            type="date" 
            value={tripDateFilter}
            onChange={(e) => setTripDateFilter(e.target.value)}
          />
          <button className="filter-btn" onClick={handleTripDateFilter}>Filter</button>
        </div>
        
        <button 
          className="filter-btn" 
          onClick={clearFilters}
          style={{ backgroundColor: "#6c757d" }}
        >
          Clear Filters
        </button>
>>>>>>> 98af867 (Added new updates to NevDev branch)
      </div>

      {/* Leads Table */}
      <div className="table-container">
<<<<<<< HEAD
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
=======
        {loading ? (
          <div style={{ 
            padding: "40px", 
            textAlign: "center", 
            fontStyle: "italic", 
            color: "#666" 
          }}>
            Loading leads...
          </div>
        ) : (
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
              {leads.length > 0 ? (
                leads.map((lead, index) => (
                  <tr key={lead.id || index}>
                    <td>{(currentPage - 1) * leadsPerPage + index + 1}</td>
                    <td>{formatDate(lead.date)}</td>
                    <td>{lead.vendor_name}</td>
                    <td>{lead.location_from}</td>
                    <td>{lead.to_location}</td>
                    <td>{formatDate(lead.date)}</td>
                    <td>{lead.time}</td>
                    <td>
                      <a href={`tel:${lead.vendor_contact}`} style={{ color: "#007bff", textDecoration: "none" }}>
                        {lead.vendor_contact}
                      </a>
                    </td>
                    <td>
                      <button className="update-btn" title="Edit Lead">✏️</button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(lead.id)}
                        title="Delete Lead"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ 
                    textAlign: "center", 
                    padding: "40px 0", 
                    color: "#666", 
                    fontStyle: "italic" 
                  }}>
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination with Next/Previous Buttons */}
      {totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "5px", 
          margin: "20px 0" 
        }}>
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            style={{ 
              padding: "8px 12px", 
              backgroundColor: currentPage === 1 ? "#e9ecef" : "#007bff", 
              color: currentPage === 1 ? "#6c757d" : "white", 
              border: "1px solid #ddd", 
              borderRadius: "4px", 
              cursor: currentPage === 1 ? "not-allowed" : "pointer", 
              margin: "0 2px" 
            }}
          >
            Previous
          </button>
          
          {/* Display page numbers */}
          {Array.from({ length: totalPages }, (_, i) => {
            // Only show 5 page numbers at a time
            if (i + 1 > currentPage - 3 && i + 1 < currentPage + 3) {
              return (
                <button 
                  key={i} 
                  onClick={() => paginate(i + 1)} 
                  style={{ 
                    padding: "8px 12px", 
                    backgroundColor: currentPage === i + 1 ? "#007bff" : "white", 
                    color: currentPage === i + 1 ? "white" : "black", 
                    border: "1px solid #ddd", 
                    borderRadius: "4px", 
                    cursor: "pointer", 
                    margin: "0 2px" 
                  }}
                >
                  {i + 1}
                </button>
              );
            }
            return null;
          })}
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            style={{ 
              padding: "8px 12px", 
              backgroundColor: currentPage === totalPages ? "#e9ecef" : "#007bff", 
              color: currentPage === totalPages ? "#6c757d" : "white", 
              border: "1px solid #ddd", 
              borderRadius: "4px", 
              cursor: currentPage === totalPages ? "not-allowed" : "pointer", 
              margin: "0 2px" 
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: "20px", 
        textAlign: "center", 
        padding: "15px", 
        backgroundColor: "#f2f2f2", 
        color: "#666", 
        borderRadius: "5px" 
      }}>
        © 2025 Quick Cab Services. All rights reserved.
      </div>
>>>>>>> 98af867 (Added new updates to NevDev branch)
    </div>
  );
};

<<<<<<< HEAD
export default ManageLeads;
=======
export default ManageLeads;
>>>>>>> 98af867 (Added new updates to NevDev branch)
