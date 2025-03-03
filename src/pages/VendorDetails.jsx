import React, { useState } from "react";
import "../styles/VendorDetails.css";
import { createRoot } from "react-dom/client";


const VendorDetails = () => {
  const initialVendors = [
    { id: 101, receivedOn: "2025-02-15", name: "Alpha Cabs", location: "Delhi", contact: "9876543210" },
    { id: 102, receivedOn: "2025-02-14", name: "Beta Travels", location: "Mumbai", contact: "9123456789" },
    { id: 103, receivedOn: "2025-02-13", name: "Gamma Rides", location: "Chennai", contact: "9988776655" },
    { id: 104, receivedOn: "2025-02-12", name: "Delta Taxis", location: "Hyderabad", contact: "9556677880" },
    { id: 105, receivedOn: "2025-02-11", name: "Epsilon Movers", location: "Kolkata", contact: "9443322110" },
    { id: 106, receivedOn: "2025-02-10", name: "Zeta Transport", location: "Jaipur", contact: "9332211009" },
    { id: 107, receivedOn: "2025-02-09", name: "Eta Cab Service", location: "Ahmedabad", contact: "9221100998" },
    { id: 108, receivedOn: "2025-02-08", name: "Theta Express", location: "Bhopal", contact: "9110099887" },
  ];

  const [vendors, setVendors] = useState(initialVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 5;

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.includes(searchTerm)
  );

  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id));
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="vendor-details-table-container">
        <table className="vendor-details-table">
          <thead>
            <tr>
              <th className="vendor-details-th">Sr. No.</th>
              <th className="vendor-details-th">Received On</th>
              <th className="vendor-details-th">Vendor Name</th>
              <th className="vendor-details-th">Location</th>
              <th className="vendor-details-th">Contact</th>
              <th className="vendor-details-th">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVendors.length > 0 ? (
              currentVendors.map((vendor, index) => (
                <tr className="vendor-details-tr" key={vendor.id}>
                  <td className="vendor-details-td">{indexOfFirstVendor + index + 1}</td>
                  <td className="vendor-details-td">{vendor.receivedOn}</td>
                  <td className="vendor-details-td">{vendor.name}</td>
                  <td className="vendor-details-td">{vendor.location}</td>
                  <td className="vendor-details-td">{vendor.contact}</td>
                  <td className="vendor-actions">
                    <button className="update-btn">✏️ Update</button>
                    <button className="vendor-details-delete-btn" onClick={() => handleDelete(vendor.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="vendor-details-td" style={{ textAlign: "center", fontWeight: "bold" }}>No vendors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="vendor-details-pagination">
        {Array.from({ length: Math.ceil(filteredVendors.length / vendorsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="vendor-details-footer">© 2025 Vendor Services. All rights reserved.</div>
    </div>
  );
};

export default VendorDetails;
