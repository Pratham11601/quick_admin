import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../styles/HelpSupport.css";

const HelpSupport = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(500); // State for rows per page

  const API_URL = "https://quickcabpune.com/admin/api/help-support";

  // Fetch Help Support Queries from API
  const fetchData = async (page, limit) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
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
    fetchData(currentPage, rowsPerPage); // Pass the updated rowsPerPage
  }, [currentPage, rowsPerPage]); // Re-fetch when rowsPerPage changes

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
      fetchData(currentPage, rowsPerPage);
      closeRemarkForm();
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  // Format date or return empty string for invalid dates
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    if (
      isNaN(date.getTime()) ||
      dateString.includes("0000-00-00") ||
      dateString.includes("1899") ||
      date.getFullYear() === 1899
    ) {
      return "";
    }

    return date.toLocaleDateString();
  };

  // Handle page change in pagination
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1); // ReactPaginate starts from page 0
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10)); // Update rowsPerPage state
    setCurrentPage(1); // Reset to first page when rows per page change
  };

  return (
    <div className="help_support">
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <h2 className="page-main-head fs-5 fw-semibold">Manage Help & Support</h2>

        <div className="rows-per-page"> 
          <select className="requiredData-dropdown"
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
      </div>

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
        <div className="vendor-details-pagination">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={totalPages} // Use the total pages from API response
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
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
