import React, { useState, useEffect } from "react";
import "../styles/VendorDetails.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

const VendorDetails = () => {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]); // Store all vendors for client-side pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorsPerPage, setVendorsPerPage] = useState(500); // Default to 500 vendors per page
  const API_BASE_URL = "https://quickcabpune.com/app/vendordetails";
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // Fetch all vendors from the API
        const response = await axios.get(API_BASE_URL);

        // Check if the response contains data
        if (response.data && Array.isArray(response.data)) {
          setAllVendors(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setAllVendors(response.data.data);
        } else if (typeof response.data === 'object') {
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

  useEffect(() => {
    let filteredVendors = allVendors;

    if (searchTerm) {
      filteredVendors = allVendors.filter(vendor =>
        (vendor.fullname && vendor.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.city && vendor.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.phone && vendor.phone.includes(searchTerm)) ||
        (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Paginate vendors: Slice data according to current page and vendorsPerPage
    const offset = currentPage * vendorsPerPage;
    const currentVendors = filteredVendors.slice(offset, offset + vendorsPerPage);
    setVendors(currentVendors);

  }, [allVendors, searchTerm, currentPage, vendorsPerPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to the first page when search term changes
  };

  const handleVendorsPerPageChange = (e) => {
    setVendorsPerPage(Number(e.target.value)); // Update vendors per page
    setCurrentPage(0); // Reset to the first page when vendors per page is changed
  };

  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`https://quickcabpune.com/admin/api/vendor/${vendorId}`);
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
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.put(`https://quickcabpune.com/admin/api/vendor/${vendorId}`, { status: newStatus });
      const updatedAllVendors = allVendors.map(vendor =>
        vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
      );
      setAllVendors(updatedAllVendors);
      alert(newStatus === 1 ? "Vendor activated successfully!" : "Vendor deactivated successfully!");
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
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h1 className="vendor-details-h1 page-main-head text-muted">Vendor Details</h1>

        <div className="d-flex align-items-center gap-4 mb-4" >
         

          <div className="vendor-details-add-category">
            <input
              type="text"
              placeholder="Search by name, location, or contact"
              className="vendor-details-search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="vendor-details-per-page">
            <select className="requiredData-dropdown"
              id="vendorsPerPage"
              value={vendorsPerPage}
              onChange={handleVendorsPerPageChange}
            >
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>

            </select>
          </div>
        </div>
      </div>



      {error && <div className="error-message">{error}</div>}

      <div className="vendor-details-table-container">
        <div className="table-responsive">
          {loading ? (
            <div className="loader-container">
              <div className="loading-box"><i className="fa-solid fa-circle-notch"></i></div>
            </div>
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
                      {/* <td>{(currentPage * vendorsPerPage) +   index + 1}</td> */}
                      <td>{'QCKSRV000' + vendor.id || index + 1}</td>
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
                        <button
                          onClick={() => handleStatusToggle(vendor.id, vendor.status)}
                          style={{
                            backgroundColor: vendor.status === 1 ? '#f8d7da' : '#d4edda',
                            color: vendor.status === 1 ? '#721c24' : '#155724',
                            border: vendor.status === 1 ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
                            borderRadius: '4px',
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {vendor.status === 1 ? '🔴 Deactivate' : '🟢 Activate'}
                        </button>
                      </td>
                      <td>


                        <button
                          className="text-nowrap"
                          onClick={() => handleDeleteVendor(vendor.id)}
                          style={{
                            backgroundColor: '#b80000cc',
                            color: 'white',
                            border: '1px solid #f5c6cb',
                            borderRadius: '4px',
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fa-solid fa-trash"></i> Delete
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
      </div>

      <div className="vendor-details-pagination">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={Math.ceil(allVendors.length / vendorsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>

      <div className="vendor-details-footer">© 2025 Vendor Services. All rights reserved.</div>
    </div>
  );
};

export default VendorDetails;
