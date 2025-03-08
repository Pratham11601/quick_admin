import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HelpSupport.css";

const HelpSupport = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [remarkText, setRemarkText] = useState("");

  const rowsPerPage = 5;
  const API_URL = "https://quickcabpune.com/admin/api/help-support";

  // Fetch Help Support Queries from API
  const fetchData = async (page) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${rowsPerPage}`);
      if (response.data.success) {
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching help support data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Open Remark Form
  const openRemarkForm = (id) => {
    setSelectedId(id);
    setRemarkText(""); // Clear input
    setShowRemarkModal(true);
  };

  // Close Remark Form
  const closeRemarkForm = () => {
    setShowRemarkModal(false);
    setSelectedId(null);
    setRemarkText("");
  };

  // Handle Save Remark
  const saveRemark = async () => {
    if (!selectedId || !remarkText.trim()) {
      alert("Please enter a remark.");
      return;
    }

    try {
      const requestData = {
        remark: remarkText,
        remark_date: new Date().toISOString(), // Auto-filled current date/time
      };

      await axios.post(`${API_URL}/${selectedId}/remark`, requestData);

      // Refresh Data after saving
      fetchData(currentPage);
      closeRemarkForm();
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  // Format date or return empty string for invalid dates
  const formatDate = (dateString) => {
    // Check for null, undefined or empty string
    if (!dateString) {
      return "";
    }
    
    // Convert to date object
    const date = new Date(dateString);
    
    // Check for invalid dates, "0000-00-00" pattern, or 11/30/1899 (which seems to be a default date in your DB)
    if (
      isNaN(date.getTime()) || 
      dateString.includes("0000-00-00") || 
      dateString.includes("1899") ||
      date.getFullYear() === 1899
    ) {
      return "";
    }
    
    // Only return valid dates
    return date.toLocaleDateString();
  };

  return (
    <div className="help_support">
      <h2 className="support">Manage Help & Support</h2>
      <hr />

      <div className="data-container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Received On</th>
                <th>Query Message</th>
                <th>Vendor Category</th>
                <th>Vendor Name</th>
                <th>Vendor Contact</th>
                <th>Remarks</th>
                <th>Remark Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td dangerouslySetInnerHTML={{ __html: item.query_message }} />
                    <td>{item.vendor_category}</td>
                    <td>{item.vendor_name}</td>
                    <td>{item.vendor_contact}</td>
                    <td>{item.remark || "No remarks"}</td>
                    <td>{formatDate(item.remark_date)}</td>
                    <td>
                      <button className="btn-action" onClick={() => openRemarkForm(item.id)}>
                        Remark
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      {/* Modal Popup for Adding Remark */}
      {showRemarkModal && (
        <div className="remark-modal">
          <div className="modal-content">
            <h3>Add Remark</h3>
            <textarea
              placeholder="Enter your remark..."
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <button className="btn-save" onClick={saveRemark}>Save Remark</button>
            <button className="btn-cancel" onClick={closeRemarkForm}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;