import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Category.css"; // Importing the CSS file

const GET_ALL_CATEGORIES_URL = "https://quickcabpune.com/app/categories/all"; // Endpoint for fetching all categories
const ADD_CATEGORY_URL = "https://quickcabpune.com/admin/api/category"; // Updated endpoint for adding categories
const DELETE_CATEGORY_URL = "https://quickcabpune.com/admin/api/category"; // Base URL for deleting categories

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(GET_ALL_CATEGORIES_URL);
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
          `${DELETE_CATEGORY_URL}/${editId}`,
          { cat_name: newCategory },
          { headers: { "Content-Type": "application/json" } }
        );
        setEditId(null);
      } else {
        await axios.post(
          ADD_CATEGORY_URL,
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
      await axios.delete(`${DELETE_CATEGORY_URL}/${categoryId}`);
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
    <div className="categories-page-body">
      <div className="d-flex justify-content-between items-center  flex-wrap">
        <h2 className="fs-5 page-main-head">Manage Categories</h2>

        <button className="btn btn-primary mb-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#categoryModal">
          Add Category
        </button>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="categoryModal" tabIndex="-1" aria-labelledby="addAdModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="addAdModalLabel">Add Advertisement</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-start ">Name</label>

                {/* <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                /> */}

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>


              <div className="text-start">
                {/* <button type="submit" className="btn btn-dark mt-3 ms-0">
                    Add Advertisement
                  </button> */}

                <button className="btn btn-dark mt-3 ms-0" onClick={handleCategory}>{editId ? "Save" : "Add"}</button>

              </div>
            </div>
          </div>
        </div>
      </div>


      {/* <div className="add-category">
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCategory}>{editId ? "Save" : "Add"}</button>
      </div> */}

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
                  {/* <button className="delete-btn" onClick={() => deleteCategory(category.id)}>🗑️</button> */}

                  <button
                    className="text-nowrap"
                    onClick={() => deleteCategory(category.id)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ⬅️ Previous
        </button>
        <span> Page {currentPage} of {Math.ceil(categories.length / categoriesPerPage)} </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage >= Math.ceil(categories.length / categoriesPerPage)}>
          Next ➡️
        </button>
      </div> */}
      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default Categories;