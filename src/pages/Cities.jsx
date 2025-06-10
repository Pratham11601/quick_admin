import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import "../styles/cities.css";

 //const API_URL = "https://quickcabpune.com/admin/api/cities";
const API_URL = "https://quickcabpune.com/app/cities/all?page=1&limit=500";
const ADD_CITY_URL = "https://quickcabpune.com/app/cities/add";

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [editCity, setEditCity] = useState(null);
  const [editCityName, setEditCityName] = useState("");
  const [editStateName, setEditStateName] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Page starts from 0 in ReactPaginate
  const [citiesPerPage, setCitiesPerPage] = useState(500); // State for number of cities per page
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all cities from API
  useEffect(() => {
    fetchAllCities();
  }, []);

  // Update filtered cities when cities or pagination changes
  useEffect(() => {
    const startIndex = currentPage * citiesPerPage;
    const endIndex = startIndex + citiesPerPage;
    setFilteredCities(cities.slice(startIndex, endIndex));
  }, [cities, currentPage, citiesPerPage]);

  const fetchAllCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      if (response.data.success) {
        setCities(response.data.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Add new city
  const addCity = async () => {
  if (!newCity.trim() || !newState.trim()) {
    alert("Please enter both city name and state name.");
    return;
  }

  try {
    await axios.post(
      ADD_CITY_URL,
      {
        city_name: newCity,
        state_name: newState,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // If client gives token: Authorization: "Bearer YOUR_TOKEN_HERE"
        }
      }
    );

    setNewCity("");
    setNewState("");
    fetchAllCities(); // Refresh the list after adding
  } catch (error) {
    console.error("Error adding city:", error);
    alert("Failed to add city.");
  }
};


  // Delete city
  const removeCity = async (city_id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    try {
      await axios.delete(`${API_URL}/${city_id}`);
      fetchAllCities();
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  // Set city for editing
  const startEdit = (city) => {
    setEditCity(city.city_id);
    setEditCityName(city.city_name);
    setEditStateName(city.state_name);
  };

  // Update city details
  const updateCity = async () => {
    if (!editCityName.trim() || !editStateName.trim()) {
      alert("City name and State name cannot be empty.");
      return;
    }

    try {
      await axios.put(`${API_URL}/${editCity}`, {
        city_name: editCityName,
        state_name: editStateName,
      });
      setEditCity(null);
      fetchAllCities();
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  // SEARCH  
  useEffect(() => {
    const filtered = cities.filter(city =>
      city.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
    setCurrentPage(0); // Reset to first page when search changes
  }, [searchTerm, cities]);

  // Handle page change in ReactPaginate
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // ReactPaginate gives 0-based page number
  };

  // Handle the change in the number of cities per page
  const handleCitiesPerPageChange = (e) => {
    setCitiesPerPage(parseInt(e.target.value)); // Update citiesPerPage based on user selection
    setCurrentPage(0); // Reset to the first page whenever cities per page change
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center ">
        <h1 style={{ marginTop: "35px" }}>Manage Cities</h1>


        <div className="d-flex align-items-center gap-4" >
          {/* Cities per page dropdown */}
          <div className="cities-per-page"> 
            <select className="requiredData-dropdown"
              id="citiesPerPage"
              value={citiesPerPage}
              onChange={handleCitiesPerPageChange}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>

            </select>
          </div>

          {/* Search Filter */}
          <div className="search-container vendor-details-search-bar">
            <input
              type="text"
              placeholder="Search by city or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* <button className="btn btn-primary mb-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#cityModel">
        Add Advertisement
      </button> */}

      {/* Bootstrap Modal */}
      {/* <div className="modal fade" id="cityModel" tabIndex="-1" aria-labelledby="addAdModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="addAdModalLabel">Add Advertisement</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="form-label text-start ">Name</label>
                  <input
                    type="text"
                    className="form-control border border-black"
                    placeholder="Enter city name"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)} required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-start">Image</label>


                  <input
                    type="text"
                    placeholder="Enter state name" className="form-control border border-black"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                  />
                </div>

                <div className="text-start">
                   
                  <button onClick={addCity}>Add</button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div> */}

      {/* Add City Form */}
      <div className="add-city">
        <input
          type="text"
          placeholder="Enter city name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter state name"
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
        />
        <button onClick={addCity}>Add</button>
      </div>



      {/* Cities Table */}
      <div className="table-container table-responsive  ">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>City Name</th>
              <th>State Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <tr key={city.city_id}>
                  <td>{currentPage * citiesPerPage + index + 1}</td>
                  <td>
                    {editCity === city.city_id ? (
                      <input
                        type="text"
                        value={editCityName}
                        onChange={(e) => setEditCityName(e.target.value)}
                      />
                    ) : (
                      city.city_name
                    )}
                  </td>
                  <td>
                    {editCity === city.city_id ? (
                      <input
                        type="text"
                        value={editStateName}
                        onChange={(e) => setEditStateName(e.target.value)}
                      />
                    ) : (
                      city.state_name
                    )}
                  </td>
                  <td>
                    {editCity === city.city_id ? (
                      <button className="update-btn py-1" onClick={updateCity}>Save</button>
                    ) : (
                      <button className="editBtn btn btn-warning py-1" onClick={() => startEdit(city)}><i class="fa-solid fa-pen me-1"></i> Edit</button>
                    )}
                    <button
                      className="text-nowrap"
                      onClick={() => removeCity(city.city_id)}
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
              ))
            ) : (
              <tr>
                <td colSpan="4">No cities available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls using ReactPaginate */}
      <div className="vendor-details-pagination">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={Math.ceil(cities.length / citiesPerPage)} // Total pages
          marginPagesDisplayed={2} // Number of pages to display on the edges
          pageRangeDisplayed={3} // Number of pages to display in the middle
          onPageChange={handlePageChange} // Page change handler
          containerClassName={"pagination"} // Class for the pagination container
          activeClassName={"active"} // Class for active page
        />
      </div>

      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default ManageCities;