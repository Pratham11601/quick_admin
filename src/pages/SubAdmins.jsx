import React, { useState, useEffect } from "react";
import "../styles/VendorDetails.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

const SubAdmins = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorsPerPage, setVendorsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingVendor, setEditingVendor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {


    fetchSubAdmins(currentPage, vendorsPerPage, searchTerm);
  }, [currentPage, vendorsPerPage, searchTerm]);

  const fetchSubAdmins = async (currentPage, vendorsPerPage, searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get("https://quickcabpune.com/dev/api/sub-admin/get-all", {
        params: {
          page: currentPage + 1,
          size: vendorsPerPage,
          search: searchTerm,
        },
      });

      console.log("Raw API response:", response.data);

      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setVendors(data);

      // Set total counts for pagination
      setTotalVendors(response.data?.totalItems || data.length);
      setTotalPages(response.data?.totalPages || Math.ceil(data.length / vendorsPerPage));
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors.");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };


  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // ReactPaginate is 0-based
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
    if (window.confirm("Are you sure you want to delete this Sub Admin?")) {
      try {
        await axios.delete(`https://quickcabpune.com/dev/api/sub-admin/delete/${vendorId}`);
        setVendors(prev => prev.filter(v => v.id !== vendorId));
        alert("Sub Admin deleted successfully!");
      } catch (err) {
        console.error("Error deleting Sub Admin:", err);
        alert("Failed to delete Sub Admin. Please try again.");
      }
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
      const cleanedData = Object.fromEntries(
        Object.entries(editingVendor).filter(([_, value]) => value != null)
      );

      console.log('Sending update request:', cleanedData);

      // Use your localhost API here:
      const response = await axios.put(
        `https://quickcabpune.com/app/vendorDetails/edit/${editingVendor?.id}`,
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        // Update local vendor list state
        const updatedVendors = vendors.map(vendor =>
          vendor.id === editingVendor.id ? { ...vendor, ...cleanedData } : vendor
        );
        setVendors(updatedVendors);
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
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('')

  const addSubAdmin = async () => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post(
        'https://quickcabpune.com/dev/api/sub-admin/register',
        {
          name,
          phone,
          password
        },
        {
          headers: {
            "Content-Type": "application/json",
            // If client gives token: Authorization: "Bearer YOUR_TOKEN_HERE"
          }
        }
      );

      setName("");
      setPhone("");
      setPassword("");
      fetchSubAdmins(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding sub admin:", error);
      alert("Failed to add sub admin.");
    }
  };

  return (
    <div className="vendor-details-page-body">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h1 className="vendor-details-h1 page-main-head text-muted">Sub Admins</h1>

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
        <div className="add-city">
          <input
            type="text"
            placeholder="Enter sub admin name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={addSubAdmin}>Add</button>
        </div>

      {error && <div className="error-message">{error}</div>}

      <div className="vendor-details-table-container" style={{marginTop:'20px'}}>
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
                  <th>Phone</th>
                  <th>Vendors</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length > 0 ? (
                  vendors.map((vendor, index) => (
                    <tr key={vendor.id || index}>
                      <td className="d-flex align-items-center">


                        {/* <button
                          className="text-nowrap btn btn-warning me-2"
                          onClick={() => handleEdit(vendor.id, vendor.carnumber)}
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
                        </button> */}

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

                      <td>{vendor.name || "N/A"}</td>
                      <td>{vendor.phone || "N/A"}</td>
                      <td>{vendor.vendorCount || 0}</td>

                      <td>{formatDate(vendor.createdAt || vendor.created_date)}</td>
                      <td>{formatDate(vendor.updatedAt || vendor.updated_date)}</td>
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
          pageCount={totalPages}
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
                  {/* Image Cards */}
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

export default SubAdmins;