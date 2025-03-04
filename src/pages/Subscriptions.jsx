import React, { useState } from "react";
import "../styles/Subscriptions.css";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, duration: 30, price: 500 },
    { id: 2, duration: 90, price: 1200 },
    { id: 3, duration: 180, price: 1800 },
  ]);

  const [newSubscription, setNewSubscription] = useState({
    duration: "",
    price: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setNewSubscription({ ...newSubscription, [e.target.name]: e.target.value });
  };

  const addSubscription = () => {
    if (newSubscription.duration && newSubscription.price) {
      const newEntry = {
        id: subscriptions.length + 1,
        duration: parseInt(newSubscription.duration),
        price: parseInt(newSubscription.price),
      };

      if (editingIndex !== null) {
        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[editingIndex] = { ...newEntry, id: subscriptions[editingIndex].id };
        setSubscriptions(updatedSubscriptions);
        setEditingIndex(null);
      } else {
        setSubscriptions([...subscriptions, newEntry]);
      }

      setNewSubscription({ duration: "", price: "" });
    }
  };

  const editSubscription = (index) => {
    setNewSubscription({
      duration: subscriptions[index].duration,
      price: subscriptions[index].price,
    });
    setEditingIndex(index);
  };

  const deleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div className="container">
      <h2 className="title">Manage Subscriptions</h2>
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
        <button className="add-btn" onClick={addSubscription}>
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
          {subscriptions.map((sub, index) => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.duration}</td>
              <td>{sub.price}</td>
              <td>
                <button className="edit-btn" onClick={() => editSubscription(index)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteSubscription(sub.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subscriptions;
