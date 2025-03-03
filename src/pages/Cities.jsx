import React, { useState, useEffect } from "react";
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

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>City Name</th>
              <th>State Name</th>
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
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(cities.length / citiesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="footer">© 2024 Quick Cab Services. All rights reserved.</div>
    </div>
  );
};

export default ManageCities;
