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

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

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
        <button onClick={handleCategory}>{editId ? "Save" : "Add"}</button>
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
              <tr key={category.id}>
                <td>{indexOfFirstCategory + index + 1}</td>
                <td>{category.cat_name}</td>
                <td>
                  {/* <button className="edit-btn" onClick={() => editCategory(category)}>✏️</button> */}
                  <button className="delete-btn" onClick={() => deleteCategory(category.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ⬅️ Previous
        </button>
        <span> Page {currentPage} of {Math.ceil(categories.length / categoriesPerPage)} </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage >= Math.ceil(categories.length / categoriesPerPage)}>
          Next ➡️
        </button>
      </div>
      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default Categories;
