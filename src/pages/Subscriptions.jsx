import React, { useState, useEffect } from "react";
import "../styles/Subscriptions.css";

const API_URL = "http://localhost:5000/api/subscriptions";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({
    duration: "",
    price: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscriptions from API
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      if (Array.isArray(data)) {
        setSubscriptions(data);
      } else {
        setSubscriptions([]); // Ensure subscriptions is always an array
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError("Failed to load subscriptions.");
      setSubscriptions([]); // Prevents .map() crash
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewSubscription({ ...newSubscription, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!newSubscription.duration || !newSubscription.price) return;

    const subscriptionData = {
      duration: parseInt(newSubscription.duration),
      price: parseInt(newSubscription.price),
    };

    try {
      let response;
      if (editingId !== null) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionData),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionData),
        });
      }

      if (response.ok) {
        fetchSubscriptions();
        setNewSubscription({ duration: "", price: "" });
        setEditingId(null);
        setEditingIndex(null);
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  const editSubscription = (index) => {
    setNewSubscription({
      duration: subscriptions[index].duration,
      price: subscriptions[index].price,
    });
    setEditingIndex(index);
    setEditingId(subscriptions[index].id);
  };

  const deleteSubscription = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Manage Subscriptions</h2>

      {loading && <p>Loading subscriptions...</p>}
      {error && <p className="error">{error}</p>}

      <div className="input-group">
        <input
          type="number"
          name="duration"
          value={newSubscription.duration}
          onChange={handleChange}
          placeholder="Enter duration in days"
        />
        <input
          type="number"
          name="price"
          value={newSubscription.price}
          onChange={handleChange}
          placeholder="Enter price"
        />
        <button className="add-btn" onClick={handleSubmit}>
          {editingIndex !== null ? "Update Subscription" : "Add Subscription"}
        </button>
      </div>

      <table className="subscription-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Duration (Days)</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length > 0 ? (
            subscriptions.map((sub, index) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.duration}</td>
                <td>{sub.price}</td>
                <td>
                  <button className="edit-btn" onClick={() => editSubscription(index)}>✏️</button>
                  <button className="delete-btn" onClick={() => deleteSubscription(sub.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No subscriptions available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Subscriptions;
