import React, { useState, useEffect, useCallback } from "react";
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

  // Use useCallback to memoize the fetchLeads function to avoid ESLint warnings
  const fetchLeads = useCallback(async () => {
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
      
      // Make API request
      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      
      // Extract leads from API response with proper error handling
      if (response.data && Array.isArray(response.data)) {
        // Handle if API returns array directly
        setLeads(response.data);
        setTotalPages(Math.max(1, Math.ceil(response.data.length / leadsPerPage)));
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Handle if API returns {success: true, data: [...]}
        setLeads(response.data.data);
        setTotalPages(Math.max(1, Math.ceil(response.data.data.length / leadsPerPage)));
      } else if (response.data && response.data.data && Array.isArray(response.data.data.leads)) {
        // Handle if API returns {data: {leads: [...]}}
        setLeads(response.data.data.leads);
        
        // Set total pages from API response if available
        if (response.data.data.totalPages) {
          setTotalPages(response.data.data.totalPages);
        } else if (response.data.data.totalItems) {
          setTotalPages(Math.ceil(response.data.data.totalItems / leadsPerPage));
        } else {
          setTotalPages(Math.max(1, Math.ceil(response.data.data.leads.length / leadsPerPage)));
        }
      } else {
        console.error("Unexpected API response format:", response.data);
        setLeads([]);
        setTotalPages(1);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(`Failed to load leads: ${err.message}`);
      setLeads([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, leadsPerPage, search, receivedOnFilter, tripDateFilter]); // Include all dependencies

  // Fetch leads when component mounts or dependencies change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]); // fetchLeads is now a dependency but is memoized with useCallback

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }
    
    try {
      // Ensure we're passing a valid ID
      if (!id) {
        throw new Error("Invalid lead ID");
      }
      
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      
      // Check if delete was successful
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
      setError(`Failed to delete lead: ${err.message}`);
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

  // Improved date formatting function with more robust error handling
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString();
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

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
              {leads && leads.length > 0 ? (
                leads.map((lead, index) => (
                  <tr key={lead.id || lead._id || index}>
                    <td>{(currentPage - 1) * leadsPerPage + index + 1}</td>
                    <td>{formatDate(lead.date || lead.received_date || lead.created_at)}</td>
                    <td>{lead.vendor_name || lead.vendorName || "N/A"}</td>
                    <td>{lead.location_from || lead.locationFrom || lead.from || "N/A"}</td>
                    <td>{lead.to_location || lead.location_to || lead.locationTo || lead.to || "N/A"}</td>
                    <td>{formatDate(lead.trip_date || lead.tripDate || lead.date)}</td>
                    <td>{lead.time || lead.trip_time || lead.tripTime || "N/A"}</td>
                    <td>
                      {lead.vendor_contact || lead.vendorContact || lead.contact ? (
                        <a href={`tel:${lead.vendor_contact || lead.vendorContact || lead.contact}`} style={{ color: "#007bff", textDecoration: "none" }}>
                          {lead.vendor_contact || lead.vendorContact || lead.contact}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <button 
                        className="update-btn" 
                        title="Edit Lead"
                        onClick={() => window.location.href = `/admin/leads/edit/${lead.id || lead._id}`}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(lead.id || lead._id)}
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
            // Only show 5 page numbers at a time centered around current page
            if (
              (totalPages <= 5) ||
              (i + 1 === 1) || 
              (i + 1 === totalPages) ||
              (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
            ) {
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
            } else if (
              (i + 1 === currentPage - 2 && currentPage > 3) || 
              (i + 1 === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return <span key={i} style={{ margin: "0 5px" }}>...</span>;
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

      {/* Records per page selector */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        margin: "15px 0" 
      }}>
        <label style={{ marginRight: "10px" }}>Leads per page:</label>
        <select 
          value={leadsPerPage} 
          onChange={(e) => {
            setLeadsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing limit
          }}
          style={{ 
            padding: "6px 10px", 
            borderRadius: "4px", 
            border: "1px solid #ddd" 
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

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