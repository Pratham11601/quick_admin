import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../styles/ManageAdvertises.css"; // Import external CSS
import { Button, Table, Form, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

// import React, { useEffect, useState } from "react";
import axios from "axios";
export default function Announcement() {
  const [ads, setAds] = useState(null);
  const [form, setForm] = useState({ announcement: "" });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/announcements/all`);
      console.log("Fetched Ads:", response.data);
      setAds(response.data?.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/advertise/delete/${id}`);
      fetchAds();
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/announcements/update/${ads?.id || 1}`, {
        announcement: form?.announcement
      },
        {
          headers: {
            "Content-Type": "application/json"
          }
        });

      const json = response.data;
      if (json.success) {
        alert("Announcement updated successfully");
        fetchAds();
        window.bootstrap.Modal.getInstance(document.getElementById('addAdModal')).hide();
      } else {
        alert("Failed to update announcement");
      }

    } catch (error) {
      console.error("Error posting ad:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-4">Quick Cabs Advertisements</h1>

      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="addAdModal" tabIndex="-1" aria-labelledby="addAdModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="addAdModalLabel">Update Accouncement</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  {/* <label className="form-label text-start ">Name</label> */}
                  <input
                    type="text"
                    className="form-control border border-black"
                    value={form.announcement || ads?.announcement}
                    onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                    required
                  />
                </div>

                <div className="text-start">
                  <button type="submit" className="btn btn-dark mt-3 ms-0">
                    Update
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-bordered table-responsive">
        <thead className="table-light">
          <tr>
            <th>Announcement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ads?.announcement || "N/A"}</td>
            <td>
              <button className="btn btn-primary mb-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#addAdModal" onClick={() => handleDelete(ads?.id)}>
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
