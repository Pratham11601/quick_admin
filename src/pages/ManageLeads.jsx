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
  const API_BASE_URL = "https://quickcabpune.com/admin/api/leads";

  // Fetch leads when component mounts or filters change
  useEffect(() => {
    fetchLeads();
  }, [currentPage, leadsPerPage]); // Only refresh automatically when page changes

  // Function to format date for API requests - DD/MM/YYYY format (Changed from MM/DD/YYYY)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    try {
      // Parse the input date (which will be in yyyy-MM-dd format from the input field)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      // Format as DD/MM/YYYY for API - updated from MM/DD/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (err) {
      console.error("Error formatting date for API:", err);
      return "";
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", leadsPerPage);
      
      if (search) params.append("search", search);
      
      // Format dates properly for API and ensure they match exactly what's shown in Swagger
      if (receivedOnFilter) {
        const formattedDate = formatDateForAPI(receivedOnFilter);
        if (formattedDate) params.append("receivedOn", formattedDate);
      }
      
      if (tripDateFilter) {
        const formattedDate = formatDateForAPI(tripDateFilter);
        if (formattedDate) params.append("tripDate", formattedDate);
      }
      
      console.log("API Request URL:", `${API_BASE_URL}?${params.toString()}`); // Debug log
      
      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      
      // Extract leads from API response
      if (response.data && response.data.success && response.data.data) {
        // Process the dates properly before setting state
        const processedLeads = response.data.data.map(lead => ({
          ...lead,
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
    // Call fetchLeads immediately after clearing filters
    setTimeout(() => fetchLeads(), 0);
  };

  // Improved date formatting function with several fallback methods - Updated to DD/MM/YYYY
  function formatDateForDisplay(dateString) {
    if (!dateString) return "N/A";
    
    try {
      // First attempt: direct conversion
      let date = new Date(dateString);
      
      // Check if valid
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB', {  // Changed from 'en-US' to 'en-GB' for DD/MM/YYYY format
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      
      // Second attempt: try parsing different formats
      // Try DD/MM/YYYY format (updated from MM/DD/YYYY)
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          // Changed order to accommodate DD/MM/YYYY format
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-GB', {
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
          return date.toLocaleDateString('en-GB', {
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
            return date.toLocaleDateString('en-GB', {
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

  // Function to handle date input changes with proper formatting
  const handleDateInputChange = (setter, value) => {
    setter(value);
  };

  // Format date from yyyy-MM-dd to MM/dd/yyyy for display in input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toISOString().split('T')[0]; // Keep as yyyy-MM-dd for HTML date input
    } catch (err) {
      return dateString;
    }
  };

  // Debug function to check date formats
  const debugDate = (label, dateString) => {
    console.log(`${label}: ${dateString}`);
    if (dateString) {
      console.log(`Formatted for API: ${formatDateForAPI(dateString)}`);
    }
  };

  // Call debug function to help troubleshoot
  useEffect(() => {
    debugDate('Received On Filter', receivedOnFilter);
    debugDate('Trip Date Filter', tripDateFilter);
  }, [receivedOnFilter, tripDateFilter]);

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

      {/* Filter Section - Updated with modern UI and updated placeholder */}
      <div className="filter-container" style={{ 
        display: "flex", 
        gap: "10px", 
        margin: "20px 0",
        flexWrap: "wrap",
        alignItems: "center" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Received On:</label>
          <input 
            type="date" 
            value={formatDateForInput(receivedOnFilter)}
            onChange={(e) => handleDateInputChange(setReceivedOnFilter, e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd"
            }}
            placeholder="dd/mm/yyyy"  // Updated placeholder
          />
          <button 
            onClick={handleReceivedOnFilter}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Filter
          </button>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Trip Date:</label>
          <input 
            type="date" 
            value={formatDateForInput(tripDateFilter)}
            onChange={(e) => handleDateInputChange(setTripDateFilter, e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd"
            }}
            placeholder="dd/mm/yyyy"  // Updated placeholder
          />
          <button 
            onClick={handleTripDateFilter}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Filter
          </button>
        </div>
        
        <button 
          onClick={clearFilters}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Leads Table - Updated with modern styling */}
      <div className="table-container" style={{ overflowX: "auto" }}>
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
          <table style={{ 
            width: "100%", 
            borderCollapse: "separate", 
            borderSpacing: "0",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#0d6efd", color: "white" }}>
                <th style={{ padding: "12px", textAlign: "center" }}>Sr. No.</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Received On</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Vendor Name</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Location From</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Location To</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Trip Date</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Trip Time</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Contact</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((lead, index) => (
                  <tr key={lead.id || index} style={{ 
                    borderBottom: "1px solid #dee2e6",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white"
                  }}>
                    <td style={{ padding: "12px", textAlign: "center" }}>{(currentPage - 1) * leadsPerPage + index + 1}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{lead.formattedReceivedDate}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{lead.vendor_name}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{lead.location_from}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{lead.to_location}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{lead.formattedTripDate}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{lead.time}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <a href={`tel:${lead.vendor_contact}`} style={{ color: "#007bff", textDecoration: "none" }}>
                        {lead.vendor_contact}
                      </a>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        title="Delete Lead"
                        style={{
                          background: '#dc3545',
                          borderRadius: '4px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer'
                        }}
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

      {/* Pagination - Updated with modern styling to match the image */}
      {totalPages > 0 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
          gap: "10px"
        }}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.6 : 1
            }}
          >
            ← Previous
          </button>
          
          <div style={{
            padding: "8px 16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            border: "1px solid #dee2e6"
          }}>
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.6 : 1
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