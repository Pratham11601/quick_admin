<<<<<<< HEAD
import React, { useState } from "react";
import "../styles/Sub-packages.css";

const ManageSubPackages = () => {
  const [packages, setPackages] = useState([
    { id: 1, name: "Basic Package", duration: 30, pricePerDay: 100, totalPrice: 3000 },
  ]);

=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Sub-packages.css";

const ManageSubPackages = () => {
  const [packages, setPackages] = useState([]);
>>>>>>> 98af867 (Added new updates to NevDev branch)
  const [newPackage, setNewPackage] = useState({
    name: "",
    duration: "",
    pricePerDay: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
<<<<<<< HEAD
=======
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Number of packages per page

  // Fetch sub-packages from API with pagination
  useEffect(() => {
    fetchPackages();
  }, [currentPage]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sub-packages?page=${currentPage}&limit=${limit}`);
      setPackages(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching sub-packages:", error);
    }
  };
>>>>>>> 98af867 (Added new updates to NevDev branch)

  const handleChange = (e) => {
    setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const addPackage = () => {
    if (newPackage.name && newPackage.duration && newPackage.pricePerDay) {
      const newEntry = {
        id: packages.length + 1,
        name: newPackage.name,
        duration: parseInt(newPackage.duration),
        pricePerDay: parseInt(newPackage.pricePerDay),
        totalPrice: parseInt(newPackage.duration) * parseInt(newPackage.pricePerDay),
      };

      if (editingIndex !== null) {
        // Update existing package
        const updatedPackages = [...packages];
        updatedPackages[editingIndex] = { ...newEntry, id: packages[editingIndex].id };
        setPackages(updatedPackages);
        setEditingIndex(null);
      } else {
        // Add new package
        setPackages([...packages, newEntry]);
      }

      setNewPackage({ name: "", duration: "", pricePerDay: "" });
    }
  };

  const editPackage = (index) => {
    setNewPackage({
      name: packages[index].name,
      duration: packages[index].duration,
      pricePerDay: packages[index].pricePerDay,
=======
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
          await axios.put(`http://localhost:5000/api/sub-packages/${packages[editingIndex].id}`, packageData);
        } else {
          // Add new package
          await axios.post("http://localhost:5000/api/sub-packages", packageData);
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
>>>>>>> 98af867 (Added new updates to NevDev branch)
    });
    setEditingIndex(index);
  };

<<<<<<< HEAD
  const deletePackage = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
=======
  // Delete package
  const deletePackage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sub-packages/${id}`);
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
>>>>>>> 98af867 (Added new updates to NevDev branch)
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
<<<<<<< HEAD
              <td>{pkg.name}</td>
              <td>{pkg.duration}</td>
              <td>{pkg.pricePerDay}</td>
              <td>{pkg.totalPrice}</td>
=======
              <td>{pkg.package_name}</td>
              <td>{pkg.duration_in_days}</td>
              <td>{pkg.price_per_day}</td>
              <td>{pkg.total_price}</td>
>>>>>>> 98af867 (Added new updates to NevDev branch)
              <td>
                <button className="edit-btn" onClick={() => editPackage(index)}>✏️</button>
                <button className="delete-btn" onClick={() => deletePackage(pkg.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

<<<<<<< HEAD
      <div className="pagination">
        <button className="page-btn">1</button>
=======
      {/* Pagination Controls */}
      <div className="pagination">
        <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-info">Page {currentPage} of {totalPages}</span>
        <button className="page-btn" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
>>>>>>> 98af867 (Added new updates to NevDev branch)
      </div>
    </div>
  );
};

export default ManageSubPackages;
