import React, { useState } from "react";
import "../styles/Category.css"; // Importing the CSS file

const Categories = () => {
  const [categories, setCategories] = useState([
    "Cab", "Towing", "Repairing", "Puncture", "Drivers",
    "Fuel", "Restaurant", "Hospital", "Mechanic", "Electric Charging"
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  // Function to add or update a category
  const handleCategory = () => {
    if (newCategory.trim()) {
      if (editIndex !== null) {
        const updatedCategories = [...categories];
        updatedCategories[editIndex] = newCategory;
        setCategories(updatedCategories);
        setEditIndex(null);
      } else {
        setCategories([...categories, newCategory]);
      }
      setNewCategory("");
    }
  };

  // Function to delete a category
  const deleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // Function to set category for editing
  const editCategory = (index) => {
    setNewCategory(categories[index]);
    setEditIndex(index);
  };

  // Pagination Logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="categories-page-body h-screen">
      <h1>Manage Categories</h1>
      <div className="add-category">
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCategory}>{editIndex !== null ? "Save" : "Add"}</button>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <tr key={index}>
                <td>{indexOfFirstCategory + index + 1}</td>
                <td>{category}</td>
                <td>
                  <button className="edit-btn" onClick={() => editCategory(indexOfFirstCategory + index)}>
                    ✏️
                  </button>
                  <button className="delete-btn" onClick={() => deleteCategory(indexOfFirstCategory + index)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default Categories;