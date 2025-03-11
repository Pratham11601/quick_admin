import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Sub-packages.css";

const ManageSubPackages = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    name: "",
    duration: "",
    pricePerDay: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of packages per page

  // Fetch sub-packages from API with pagination
  useEffect(() => {
    fetchPackages();
  }, [currentPage]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`https://quickcabpune.com/admin/api/sub-packages?page=${currentPage}&limit=${limit}`);
      setPackages(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching sub-packages:", error);
    }
  };

  const handleChange = (e) => {
    setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
  };

  // Add or update sub-package
  const addPackage = async () => {
    if (newPackage.name && newPackage.duration && newPackage.pricePerDay) {
      const packageData = {
        package_name: newPackage.name,
        duration_in_days: parseInt(newPackage.duration),
        price_per_day: parseInt(newPackage.pricePerDay),
        total_price: parseInt(newPackage.duration) * parseInt(newPackage.pricePerDay),
      };

      try {
        if (editingIndex !== null) {
          // Update existing package
          await axios.put(`https://quickcabpune.com/admin/api/sub-packages/${packages[editingIndex].id}`, packageData);
        } else {
          // Add new package
          await axios.post("https://quickcabpune.com/admin/api/sub-packages", packageData);
        }
        setEditingIndex(null);
        setNewPackage({ name: "", duration: "", pricePerDay: "" });
        fetchPackages(); // Refresh data
      } catch (error) {
        console.error("Error saving package:", error);
      }
    }
  };

  // Edit package
  const editPackage = (index) => {
    setNewPackage({
      name: packages[index].package_name,
      duration: packages[index].duration_in_days,
      pricePerDay: packages[index].price_per_day,
    });
    setEditingIndex(index);
  };

  // Delete package
  const deletePackage = async (id) => {
    try {
      await axios.delete(`https://quickcabpune.com/admin/api/sub-packages/${id}`);
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container">
      <h2 className="title">Manage Sub-Packages</h2>
      <div className="input-group">
        <input
          type="text"
          name="name"
          value={newPackage.name}
          onChange={handleChange}
          placeholder="Enter package name"
        />
        <input
          type="number"
          name="duration"
          value={newPackage.duration}
          onChange={handleChange}
          placeholder="Enter duration in days"
        />
        <input
          type="number"
          name="pricePerDay"
          value={newPackage.pricePerDay}
          onChange={handleChange}
          placeholder="Enter price per day"
        />
        <button className="add-btn" onClick={addPackage}>
          {editingIndex !== null ? "Update Package" : "Add Package"}
        </button>
      </div>

      <table className="package-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Package Name</th>
            <th>Duration (Days)</th>
            <th>Price Per Day</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.package_name}</td>
              <td>{pkg.duration_in_days}</td>
              <td>{pkg.price_per_day}</td>
              <td>{pkg.total_price}</td>
              <td>
                <button className="edit-btn" onClick={() => editPackage(index)}>✏️</button>
                <button className="delete-btn" onClick={() => deletePackage(pkg.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-info">Page {currentPage} of {totalPages}</span>
        <button className="page-btn" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageSubPackages;
