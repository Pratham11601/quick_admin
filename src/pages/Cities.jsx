import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import "../styles/cities.css"; // Import the CSS file

const ManageCities = () => {
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [cities, setCities] = useState([
    { id: 1, city: "Mumbai", state: "Maharashtra" },
    { id: 2, city: "Delhi", state: "Delhi" },
    { id: 3, city: "Bengaluru", state: "Karnataka" },
    { id: 4, city: "Ahmedabad", state: "Gujarat" },
    { id: 5, city: "Hyderabad", state: "Telangana" },
    { id: 6, city: "Chennai", state: "Tamil Nadu" },
    { id: 7, city: "Kolkata", state: "West Bengal" },
    { id: 8, city: "Pune", state: "Maharashtra" },
    { id: 9, city: "Jaipur", state: "Rajasthan" },
    { id: 10, city: "Lucknow", state: "Uttar Pradesh" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 5;

  useEffect(() => {
    document.body.classList.add("cities-page-body");
    return () => {
      document.body.classList.remove("cities-page-body");
    };
  }, []);

  const addCity = () => {
    if (newCity.trim() && newState.trim()) {
      const newEntry = {
        id: cities.length + 1,
        city: newCity,
        state: newState,
      };
      setCities([...cities, newEntry]);
      setNewCity("");
      setNewState("");
    }
  };

  const removeCity = (id) => {
    const updatedCities = cities.filter((city) => city.id !== id);
    setCities(updatedCities);
  };

  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Manage Cities</h1>

=======
import axios from "axios";
import "../styles/cities.css";

const API_URL = "http://localhost:5000/api/cities";

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [editCity, setEditCity] = useState(null);
  const [editCityName, setEditCityName] = useState("");
  const [editStateName, setEditStateName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const citiesPerPage = 5;

  // Fetch cities from API
  useEffect(() => {
    fetchCities();
  }, [currentPage]);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${currentPage}&limit=${citiesPerPage}`);
      if (response.data.success) {
        setCities(response.data.data);
        setTotalPages(Math.ceil(response.data.total / citiesPerPage));
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
      await axios.post(API_URL, {
        city_name: newCity,
        state_name: newState,
      });
      setNewCity("");
      setNewState("");
      fetchCities();
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  // Delete city
  const removeCity = async (city_id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    try {
      await axios.delete(`${API_URL}/${city_id}`);
      fetchCities();
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
      fetchCities();
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="container">
<h1 style={{ marginTop: "35px" }}>Manage Cities</h1>

      {/* Add City Form */}
>>>>>>> 98af867 (Added new updates to NevDev branch)
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

<<<<<<< HEAD
=======
      {/* Cities Table */}
>>>>>>> 98af867 (Added new updates to NevDev branch)
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>City Name</th>
              <th>State Name</th>
<<<<<<< HEAD
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCities.map((city, index) => (
              <tr key={city.id}>
                <td>{indexOfFirstCity + index + 1}</td>
                <td>{city.city}</td>
                <td>{city.state}</td>
                <td>
                  <button className="delete-btn" onClick={() => removeCity(city.id)}>
                  🗑️ 
                  </button>
                </td>
              </tr>
            ))}
=======
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.length > 0 ? (
              cities.map((city, index) => (
                <tr key={city.city_id}>
                  <td>{(currentPage - 1) * citiesPerPage + index + 1}</td>
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
                      <button className="update-btn" onClick={updateCity}>Save</button>
                    ) : (
                      <button className="edit-btn" onClick={() => startEdit(city)}>✏️</button>
                    )}
                    <button className="delete-btn" onClick={() => removeCity(city.city_id)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No cities available.</td>
              </tr>
            )}
>>>>>>> 98af867 (Added new updates to NevDev branch)
          </tbody>
        </table>
      </div>

<<<<<<< HEAD
      <div className="pagination">
        {Array.from({ length: Math.ceil(cities.length / citiesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
=======
      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>⬅️ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage >= totalPages}>Next ➡️</button>
>>>>>>> 98af867 (Added new updates to NevDev branch)
      </div>

      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default ManageCities;
