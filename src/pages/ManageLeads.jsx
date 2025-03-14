import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../styles/ManageLeads.css";


const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);

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
  const offset = currentPage * leadsPerPage;
  const currentLeads = leads.slice(offset, offset + leadsPerPage);
  const pageCount = Math.ceil(leads.length / leadsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleLeadsPerPageChange = (e) => {
    setLeadsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <div className="categories-page-body h-screen h-screen-2 ">
      <div className="d-flex justify-between items-center mb-2 w-100">
        <div class="w-100"> 
          <h1 calss="text-muted " className="page-main-head">Manage Leads</h1>
        </div>

        {/* Leads per page selector */}
        <div className="leads-per-page-selector d-flex gap-3">
          <label class="text-nowrap mt-1 mb-0 fs-6">Show per page: </label>
          <select class="requiredData-dropdown" value={leadsPerPage} onChange={handleLeadsPerPageChange}>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="400">400</option>
            <option value="600">600</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-box">
          {error}
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}



      <div className="table-container">
        {loading ? (
          <div className="loader-container">
            <div className="loading-box"><i className="fa-solid fa-circle-notch"></i></div>
          </div>
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
                    <td>{offset + index + 1}</td>
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
                      <button
                        className="text-nowrap"
                        onClick={() => deleteLead(lead.id)}
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
                  <td colSpan="10" className="no-data">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName="vendor-details-pagination"
        activeClassName="active"
        previousClassName="pagination-btn"
        nextClassName="pagination-btn"
        pageClassName="pagination-btn"
        breakClassName="pagination-break"
      />
    </div>
  );
};

export default ManageLeads;
