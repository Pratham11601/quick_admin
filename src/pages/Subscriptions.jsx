import React, { useState, useEffect } from "react";
import "../styles/Subscriptions.css";

const API_URL = "https://quickcabpune.com/admin/api/subscriptions";

const Subscriptions = () => {
  const [allSubscriptions, setAllSubscriptions] = useState([]); // Store all data
  const [subscriptions, setSubscriptions] = useState([]); // Store paginated data
  const [newSubscription, setNewSubscription] = useState({ duration: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    paginateData();
  }, [page, limit, allSubscriptions]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.status && data.data && Array.isArray(data.data)) {
        setAllSubscriptions(data.data);
        setTotalPages(Math.ceil(data.data.length / limit));
        setPage(1); // Reset to first page when fetching new data
      } else {
        setAllSubscriptions([]);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError("Failed to load subscriptions.");
      setAllSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const paginateData = () => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setSubscriptions(allSubscriptions.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(allSubscriptions.length / limit));
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
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (response.ok) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to first page when changing limit
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

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="limit-selector">
          <label htmlFor="limit-select">Items per page:</label>
          <select id="limit-select" value={limit} onChange={handleLimitChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <div className="page-navigator">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
