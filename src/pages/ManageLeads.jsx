import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageLeads.css"; // Keep existing styles

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []); // Fetch leads on component mount

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };

      const response = await axios.get("https://quickcabpune.com/app/leads", { headers });

      console.log("API Response:", response.data); // Log API response to verify structure

      if (response.data && Array.isArray(response.data.result)) {
        setLeads(response.data.result); // ✅ Corrected
      } else {
        console.warn("Unexpected API response format:", response.data);
        setLeads([]); // Fallback if response is not as expected
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

  return (
    <div className="categories-page-body h-screen">
      <h1>Manage Leads</h1>

      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "10px 15px",
          borderRadius: "4px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#721c24" }}>×</button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", fontStyle: "italic", color: "#666" }}>
            Loading leads...
          </div>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            <thead>
              <tr style={{ backgroundColor: "#0d6efd", color: "white" }}>
                <th>Sr. No.</th>
                <th>Date</th>
                <th>Vendor Name</th>
                <th>Location From</th>
                <th>Location To</th>
                <th>Car Model</th>
                <th>Fare</th>
                <th>Time</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((lead, index) => (
                  <tr key={lead.id || index}>
                    <td>{index + 1}</td>
                    <td>{lead.date || "-"}</td>
                    <td>{lead.vendor_name || "-"}</td>
                    <td>{lead.location_from || "-"}</td>
                    <td>{lead.to_location || "-"}</td>
                    <td>{lead.car_model || "-"}</td>
                    <td>₹{lead.fare || "-"}</td>
                    <td>{lead.time || "-"}</td>
                    <td>
                      {lead.vendor_contact ? (
                        <a href={`tel:${lead.vendor_contact}`} style={{ color: "#007bff", textDecoration: "none" }}>
                          {lead.vendor_contact}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px 0", color: "#666", fontStyle: "italic" }}>
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageLeads;
