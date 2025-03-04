<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Category.css"; // Importing the CSS file

const API_BASE_URL = "http://localhost:5000/api/category";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const existingCategory = categories.find(
        (cat) => cat.cat_name.toLowerCase() === newCategory.toLowerCase()
      );
      
      if (existingCategory) {
        alert("Category already exists!");
        return;
      }

      if (editId) {
        await axios.put(
          `${API_BASE_URL}/${editId}`,
          { cat_name: newCategory },
          { headers: { "Content-Type": "application/json" } }
        );
        setEditId(null);
      } else {
        await axios.post(
          API_BASE_URL,
          { cat_name: newCategory },
          { headers: { "Content-Type": "application/json" } }
        );
      }

      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding/updating category:", error.response?.data || error.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const editCategory = (category) => {
    setNewCategory(category.cat_name);
    setEditId(category.id);
  };

>>>>>>> 98af867 (Added new updates to NevDev branch)
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

<<<<<<< HEAD
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

=======
>>>>>>> 98af867 (Added new updates to NevDev branch)
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
<<<<<<< HEAD
        <button onClick={handleCategory}>{editIndex !== null ? "Save" : "Add"}</button>
      </div>
      
=======
        <button onClick={handleCategory}>{editId ? "Save" : "Add"}</button>
      </div>

>>>>>>> 98af867 (Added new updates to NevDev branch)
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
<<<<<<< HEAD
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
=======
              <tr key={category.id}>
                <td>{indexOfFirstCategory + index + 1}</td>
                <td>{category.cat_name}</td>
                <td>
                  {/* <button className="edit-btn" onClick={() => editCategory(category)}>✏️</button> */}
                  <button className="delete-btn" onClick={() => deleteCategory(category.id)}>🗑️</button>
>>>>>>> 98af867 (Added new updates to NevDev branch)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<<<<<<< HEAD
      
      <div className="pagination">
        {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

=======

      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ⬅️ Previous
        </button>
        <span> Page {currentPage} of {Math.ceil(categories.length / categoriesPerPage)} </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage >= Math.ceil(categories.length / categoriesPerPage)}>
          Next ➡️
        </button>
      </div>
>>>>>>> 98af867 (Added new updates to NevDev branch)
      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

<<<<<<< HEAD
export default Categories;
=======
export default Categories;
>>>>>>> 98af867 (Added new updates to NevDev branch)
