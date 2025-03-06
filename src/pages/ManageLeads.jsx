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
  const API_BASE_URL = "https://quickcabpune.com/app/leads";

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
        // Process the dates properly before setting state
        const processedLeads = response.data.data.map(lead => ({
          ...lead,
          // Store original date string to debug
          originalDate: lead.date,
          // Ensure date format is correctly processed
          formattedReceivedDate: formatDateForDisplay(lead.receivedOn || lead.date),
          formattedTripDate: formatDateForDisplay(lead.tripDate || lead.date)
        }));
        
        setLeads(processedLeads);
        // Calculate total pages based on total count from API
        const totalItems = response.data.totalCount || response.data.data.length * 5; // Use API count or estimate
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

  // Improved date formatting function with several fallback methods
  function formatDateForDisplay(dateString) {
    if (!dateString) return "N/A";
    
    // Log the input for debugging
    console.log("Formatting date:", dateString, "Type:", typeof dateString);
    
    try {
      // First attempt: direct conversion
      let date = new Date(dateString);
      
      // Check if valid
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      
      // Second attempt: try parsing different formats
      // Try MM/DD/YYYY format
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
          }
        }
      }
      
      // Third attempt: try Unix timestamp (if it's a number or string number)
      if (!isNaN(Number(dateString))) {
        date = new Date(Number(dateString));
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        }
      }
      
      // Fourth attempt: try ISO date format
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
          }
        }
      }
      
      // If all attempts fail
      console.warn("Could not format date string:", dateString);
      return "Invalid date";
    } catch (err) {
      console.error("Date formatting error:", err, "for date:", dateString);
      return "Invalid date";
    }
  }

  // Navigation functions for pagination
  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div className="categories-page-body h-screen">
      <h1>Manage Leads</h1>

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
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <div>
          <label>Received On:</label>
          <input 
            type="date" 
            value={receivedOnFilter}
            onChange={(e) => setReceivedOnFilter(e.target.value)}
            placeholder="mm/dd/yyyy"
          />
          <button className="filter-btn" onClick={handleReceivedOnFilter}>Filter</button>
        </div>
        
        <div>
          <label>Trip Date:</label>
          <input 
            type="date" 
            value={tripDateFilter}
            onChange={(e) => setTripDateFilter(e.target.value)}
            placeholder="mm/dd/yyyy"
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
      </div>

      {/* Leads Table */}
      <div className="table-container">
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
                    <td>{lead.formattedReceivedDate}</td>
                    <td>{lead.vendor_name}</td>
                    <td>{lead.location_from}</td>
                    <td>{lead.to_location}</td>
                    <td>{lead.formattedTripDate}</td>
                    <td>{lead.time}</td>
                    <td>
                      <a href={`tel:${lead.vendor_contact}`} style={{ color: "#007bff", textDecoration: "none" }}>
                        {lead.vendor_contact}
                      </a>
                    </td>
                    <td>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(lead.id)}
                        title="Delete Lead"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'white'
                        }}
                      >
                        <div style={{
                          backgroundColor: '#dc3545',
                          borderRadius: '4px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          🗑️
                        </div>
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

      {/* Updated Pagination to match the image */}
      {totalPages > 0 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          margin: "20px 0",
          maxWidth: "100%"
        }}>
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            style={{ 
              padding: "8px 16px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: currentPage === 1 ? "not-allowed" : "pointer", 
              opacity: currentPage === 1 ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            ← Previous
          </button>
          
          <div style={{
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            style={{ 
              padding: "8px 16px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: currentPage === totalPages ? "not-allowed" : "pointer", 
              opacity: currentPage === totalPages ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            Next →
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
    </div>
  );
};

export default ManageLeads;