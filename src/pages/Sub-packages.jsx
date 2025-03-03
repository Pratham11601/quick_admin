import React, { useState } from "react";
import "../styles/Sub-packages.css";

const ManageSubPackages = () => {
  const [packages, setPackages] = useState([
    { id: 1, name: "Basic Package", duration: 30, pricePerDay: 100, totalPrice: 3000 },
  ]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    duration: "",
    pricePerDay: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
  };

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
    });
    setEditingIndex(index);
  };

  const deletePackage = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
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
              <td>{pkg.name}</td>
              <td>{pkg.duration}</td>
              <td>{pkg.pricePerDay}</td>
              <td>{pkg.totalPrice}</td>
              <td>
                <button className="edit-btn" onClick={() => editPackage(index)}>✏️</button>
                <button className="delete-btn" onClick={() => deletePackage(pkg.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="page-btn">1</button>
      </div>
    </div>
  );
};

export default ManageSubPackages;
