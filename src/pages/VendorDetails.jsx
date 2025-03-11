import React, { useState, useEffect } from "react";
import "../styles/VendorDetails.css";
import axios from "axios";

const VendorDetails = () => {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]); // Store all vendors for client-side pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const vendorsPerPage = 12;
  const API_BASE_URL = "https://quickcabpune.com/app/vendordetails";

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // Fetch all vendors from the API
        const response = await axios.get(API_BASE_URL);
        
        // Check if the response contains data
        if (response.data && Array.isArray(response.data)) {
          // API returns an array directly
          setAllVendors(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // API returns data in a nested 'data' property
          setAllVendors(response.data.data);
        } else if (typeof response.data === 'object') {
          // Try to extract vendor data from response object
          const possibleData = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleData) {
            setAllVendors(possibleData);
          } else {
            console.error("Unexpected API response format:", response.data);
            setAllVendors([]);
          }
        } else {
          console.error("Unexpected API response format:", response.data);
          setAllVendors([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to load vendors. Please try again later.");
        setAllVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Apply search filter and pagination whenever allVendors, searchTerm or currentPage changes
  useEffect(() => {
    // Filter vendors based on search term
    let filteredVendors = allVendors;
    
    if (searchTerm) {
      filteredVendors = allVendors.filter(vendor => 
        (vendor.fullname && vendor.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.city && vendor.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.phone && vendor.phone.includes(searchTerm)) ||
        (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Calculate total pages
    setTotalPages(Math.ceil(filteredVendors.length / vendorsPerPage));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * vendorsPerPage;
    const paginatedVendors = filteredVendors.slice(startIndex, startIndex + vendorsPerPage);
    
    setVendors(paginatedVendors);
  }, [allVendors, searchTerm, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        // Updated: Make the delete request to the correct endpoint
        await axios.delete(`https://quickcabpune.com/admin/api/vendor/${vendorId}`);
        
        // Update the local state to remove the deleted vendor
        const updatedAllVendors = allVendors.filter(vendor => vendor.id !== vendorId);
        setAllVendors(updatedAllVendors);
        
        alert("Vendor deleted successfully!");
      } catch (err) {
        console.error("Error deleting vendor:", err);
        alert("Failed to delete vendor. Please try again.");
      }
    }
  };

  const handleStatusToggle = async (vendorId, currentStatus) => {
    try {
      // Set specific status values: 1 for activate, 0 for deactivate
      const newStatus = currentStatus === 1 ? 0 : 1;
      
      // Updated: Make the API request to update the status using the correct endpoint
      await axios.put(`https://quickcabpune.com/admin/api/vendor/${vendorId}`, { 
        status: newStatus 
      });
      
      // Update the local state to reflect the change
      const updatedAllVendors = allVendors.map(vendor => {
        if (vendor.id === vendorId) {
          return { ...vendor, status: newStatus };
        }
        return vendor;
      });
      
      setAllVendors(updatedAllVendors);
      
      // Show appropriate message based on the new status
      if (newStatus === 1) {
        alert("Vendor activated successfully!");
      } else {
        alert("Vendor deactivated successfully!");
      }
    } catch (err) {
      console.error("Error updating vendor status:", err);
      alert("Failed to update vendor status. Please try again.");
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="vendor-details-page-body">
      <h1 className="vendor-details-h1">Vendor Details</h1>

      <div className="vendor-details-add-category">
        <input
          type="text"
          placeholder="Search by name, location, or contact"
          className="vendor-details-search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="vendor-details-table-container">
        {loading ? (
          <div className="loading-message">Loading vendors...</div>
        ) : (
          <table className="vendor-details-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Full Name</th>
                <th>Category</th>
                <th>Business Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>Address</th>
                <th>Pin Code</th>
                <th>Car Number</th>
                <th>Gender</th>
                <th>Aadhaar</th>
                <th>Subscription</th>
                <th>Sub. Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor, index) => (
                  <tr key={vendor.id || index}>
                    <td>{(currentPage - 1) * vendorsPerPage + index + 1}</td>
                    <td>{vendor.fullname || "N/A"}</td>
                    <td>{vendor.vendor_cat || "N/A"}</td>
                    <td>{vendor.businessName || "N/A"}</td>
                    <td>{vendor.phone || "N/A"}</td>
                    <td>{vendor.email || "N/A"}</td>
                    <td>{vendor.city || "N/A"}</td>
                    <td>{vendor.currentAddress || "N/A"}</td>
                    <td>{vendor.pin_code || "N/A"}</td>
                    <td>{vendor.carnumber || "N/A"}</td>
                    <td>{vendor.vendor_gender || "N/A"}</td>
                    <td>{vendor.aadhaar_number || "N/A"}</td>
                    <td>{vendor.subscriptionPlan || "N/A"}</td>
                    <td>{formatDate(vendor.subscription_date)}</td>
                    <td>
                      <span 
                        style={{
                          backgroundColor: vendor.status === 1 ? '#d4edda' : '#f8d7da',
                          color: vendor.status === 1 ? '#155724' : '#721c24',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}
                      >
                        {vendor.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteVendor(vendor.id)}
                        style={{
                          backgroundColor: '#f8d7da',
                          color: '#721c24',
                          border: '1px solid #f5c6cb',
                          borderRadius: '4px',
                          margin: '0 5px',
                          padding: '5px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(vendor.id, vendor.status)}
                        style={{
                          backgroundColor: vendor.status === 1 ? '#f8d7da' : '#d4edda',
                          color: vendor.status === 1 ? '#721c24' : '#155724',
                          border: vendor.status === 1 ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
                          borderRadius: '4px',
                          margin: '0 5px',
                          padding: '5px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        {vendor.status === 1 ? '🔴 Deactivate' : '🟢 Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" style={{ textAlign: "center", fontWeight: "bold" }}>No vendors found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="vendor-details-pagination">
        <button 
          onClick={() => paginate("prev")} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-info">Page {currentPage} of {totalPages || 1}</span>
        <button 
          onClick={() => paginate("next")} 
          disabled={currentPage === totalPages || totalPages === 0}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      <div className="vendor-details-footer">© 2025 Vendor Services. All rights reserved.</div>
    </div>
  );
};

export default VendorDetails;