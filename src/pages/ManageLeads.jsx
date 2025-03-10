import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageLeads.css";

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5; // Static pagination

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://quickcabpune.com/app/leads", {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && Array.isArray(response.data.result)) {
        setLeads(response.data.result);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setLeads([]);
      }
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      setError(`Failed to load leads: ${err.response?.data?.message || err.message}`);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await axios.delete(`https://quickcabpune.com/admin/api/leads/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      setError(`Failed to delete lead: ${err.response?.data?.message || err.message}`);
    }
  };

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  return (
    <div className="categories-page-body h-screen">
      <h1>Manage Leads</h1>

      {error && (
        <div className="error-box">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading-box">Loading leads...</div>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Date</th>
                <th>Vendor Name</th>
                <th>Location From</th>
                <th>Location To</th>
                <th>Car Model</th>
                <th>Fare</th>
                <th>Time</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length > 0 ? (
                currentLeads.map((lead, index) => (
                  <tr key={lead.id || index}>
                    <td>{indexOfFirstLead + index + 1}</td>
                    <td>{lead.date || "-"}</td>
                    <td>{lead.vendor_name || "-"}</td>
                    <td>{lead.location_from || "-"}</td>
                    <td>{lead.to_location || "-"}</td>
                    <td>{lead.car_model || "-"}</td>
                    <td>₹{lead.fare || "-"}</td>
                    <td>{lead.time || "-"}</td>
                    <td>
                      {lead.vendor_contact ? (
                        <a href={`tel:${lead.vendor_contact}`} className="contact-link">
                          {lead.vendor_contact}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteLead(lead.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageLeads;
