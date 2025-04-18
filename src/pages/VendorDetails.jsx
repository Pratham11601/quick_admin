import React, { useState, useEffect } from "react";
import "../styles/VendorDetails.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

const VendorDetails = ({ selectedCategory, onCategoryChange }) => {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]); // Store all vendors for client-side pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorsPerPage, setVendorsPerPage] = useState(500); // Default to 500 vendors per page
  const API_BASE_URL = "https://quickcabpune.com/app/vendordetails";
  const [currentPage, setCurrentPage] = useState(0);
  const [editingVendor, setEditingVendor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVendor, setViewingVendor] = useState(null);

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

  const handleEdit = async (vendorId) => {
    try {
      const vendorToEdit = allVendors.find(vendor => vendor.id === vendorId);
      if (vendorToEdit) {
        setEditingVendor(vendorToEdit);
        setShowEditModal(true);
      }
    } catch (err) {
      console.error("Error in edit process:", err);
      alert("Error loading vendor details: " + err.message);
    }
  };

  const handleView = (vendor) => {
    // Create a copy of the vendor with properly formatted image URLs
    const viewVendor = {
      ...vendor,
      profileImgUrl: vendor.profileImgUrl ? `https://quickcabpune.com/app/${vendor.profileImgUrl.replace(/^\/+/, '')}` : null,
      documentImgUrl: vendor.documentImgUrl ? `https://quickcabpune.com/app/${vendor.documentImgUrl.replace(/^\/+/, '')}` : null,
      licenseImgUrl: vendor.licenseImgUrl ? `https://quickcabpune.com/app/${vendor.licenseImgUrl.replace(/^\/+/, '')}` : null
    };
    
    // Add console logging to debug image URLs
    console.log('Original URLs:', {
      profile: vendor.profileImgUrl,
      document: vendor.documentImgUrl,
      license: vendor.licenseImgUrl
    });
    console.log('Formatted URLs:', {
      profile: viewVendor.profileImgUrl,
      document: viewVendor.documentImgUrl,
      license: viewVendor.licenseImgUrl
    });
    
    setViewingVendor(viewVendor);
    setShowViewModal(true);
  };

  const handleWhatsApp = (phone) => {
    if (phone && phone !== "N/A") {
      // Format phone number correctly (remove any non-digit characters)
      const formattedPhone = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    } else {
      alert("No valid phone number available for this vendor");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingVendor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      // Remove any undefined or null values
      const cleanedData = Object.fromEntries(
        Object.entries(editingVendor).filter(([_, value]) => value != null)
      );

      // Log the request data for debugging
      console.log('Sending update request:', cleanedData);

      // Update the API endpoint to match your backend
      const response = await axios.put(
        `https://quickcabpune.com/admin/api/vendor/${editingVendor.id}`, 
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data) {
        // Update the local state
        const updatedVendors = allVendors.map(vendor => 
          vendor.id === editingVendor.id ? { ...vendor, ...cleanedData } : vendor
        );
        setAllVendors(updatedVendors);
        setShowEditModal(false);
        setEditingVendor(null);
        alert("Vendor updated successfully!");
      } else {
        throw new Error('No response data received');
      }
    } catch (err) {
      console.error("Error saving vendor updates:", err);
      alert(`Failed to save updates: ${err.response?.data?.message || err.message}`);
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

  // Function to handle image download
  const handleAutoDownload = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

    // GET CATEGORY DATA
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get("https://quickcabpune.com/app/categories/all");
          // console.log("API Response:", response.data); // Debug log
          setCategoryList(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setCategoryList([]);
        }
      };
  
      fetchCategories();
    }, []);

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
                  <th>Actions</th>
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
                </tr>
              </thead>
              <tbody>
                {vendors.length > 0 ? (
                  vendors.map((vendor, index) => (
                    <tr key={vendor.id || index}>
                      <td className="d-flex align-items-center">
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

                        <button
                          className="text-nowrap btn btn-success me-2"
                          onClick={() => handleWhatsApp(vendor.phone)}
                          style={{ 
                            fontSize: '14px',
                            borderRadius: '4px',
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                        </button>

                        <button
                          className="text-nowrap btn btn-info me-2"
                          onClick={() => handleView(vendor)}
                          style={{ 
                            color: 'white',
                            fontSize: '14px',
                            borderRadius: '4px',
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fa-solid fa-eye"></i> View
                        </button>

                        <button
                          className="text-nowrap btn btn-warning me-2"
                          onClick={() => handleEdit(vendor.id)}
                          style={{ 
                            color: 'white',
                            fontSize: '14px',
                            borderRadius: '4px',
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className="fa-solid fa-edit"></i> Edit
                        </button>

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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center", fontWeight: "bold" }}>No vendors found</td>
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


{/* View Modal - Improved UI */}
{showViewModal && viewingVendor && (
  <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content shadow-lg border-0 rounded-3">
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title fw-bold">Vendor Documents</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowViewModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="row g-3">
            {[
              { label: "Profile Image", key: "profileImgUrl", defaultName: "profile" },
              { label: "Document Image", key: "documentImgUrl", defaultName: "document" },
              { label: "License Image", key: "licenseImgUrl", defaultName: "license" },
            ].map((image, index) => (
              viewingVendor[image.key] && (
                <div className="col-md-4" key={index}>
                  <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                    <div className="card-header bg-light text-center fw-bold">
                      {image.label}
                    </div>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                      {/* <div className="image-container position-relative" style={{ width: '100%', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                        <img
                          src={viewingVendor[image.key]}
                          alt={image.label}
                          className="img-fluid rounded"
                          style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            console.error(`Error loading ${image.label.toLowerCase()}:`, e);
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                          loading="eager"
                        />
                      </div> */}
                      {/* Buttons */}
                      <div className="d-flex gap-2 w-100 mt-3">
                        <button
                          onClick={() => window.open(viewingVendor[image.key], '_blank')}
                          className="btn btn-outline-info w-100"
                        >
                          <i className="fa-solid fa-eye"></i> View
                        </button>
                        <button
                          onClick={() => handleAutoDownload(viewingVendor[image.key], `${viewingVendor.fullname || 'vendor'}-${image.defaultName}.jpg`)}
                          className="btn btn-primary w-100"
                        >
                          <i className="fa-solid fa-download"></i> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}



{showEditModal && editingVendor && (
  <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Vendor Details</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowEditModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullname"
                value={editingVendor.fullname || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={editingVendor.phone || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={editingVendor.email || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Aadhaar Number</label>
              <input
                type="text"
                className="form-control"
                name="aadhaar_number"
                value={editingVendor.aadhaar_number || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-control"
                name="businessName"
                value={editingVendor.businessName || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                      className="form-select"
                      // name="category"
                      name="vendor_cat"

                      value={editingVendor.vendor_cat || ''}
                      onChange={handleInputChange}
                    >
                      <option value="]">Select Category</option>

                      {categoryList.map((category) => (
                        <option value={category.cat_name}>{category.cat_name}</option>
                      ))}
                    </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={editingVendor.city || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Pin Code</label>
              <input
                type="text"
                className="form-control"
                name="pin_code"
                value={editingVendor.pin_code || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Car Number</label>
              <input
                type="text"
                className="form-control"
                name="carnumber"
                value={editingVendor.carnumber || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="vendor_gender"
                value={editingVendor.vendor_gender || ''}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Current Address</label>
              <textarea
                className="form-control"
                name="currentAddress"
                value={editingVendor.currentAddress || ''}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>

            <div className="col-md-6">
              <label className="form-label">Subscription Plan</label>
              <input
                type="text"
                className="form-control"
                name="subscriptionPlan"
                value={editingVendor.subscriptionPlan || ''}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Subscription Date</label>
              <input
                type="date"
                className="form-control"
                name="subscription_date"
                value={editingVendor.subscription_date ? editingVendor.subscription_date.split('T')[0] : ''}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setShowEditModal(false)}
          >
            Close
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSaveEdit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default VendorDetails;