import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HelpSupport.css";

const HelpSupport = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [remarks, setRemarks] = useState({}); // Store remarks entered by user

  const rowsPerPage = 5;
  const API_URL = "http://localhost:5000/api/help-support"; // Update with your actual API URL

  // Fetch Help Support Queries from API
  const fetchData = async (page) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${rowsPerPage}`);
      console.log("API Response:", response.data); // Debugging

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

  // Handle Next Page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle Previous Page
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle Input Change for Remarks
  const handleRemarkChange = (id, value) => {
    setRemarks({ ...remarks, [id]: value });
  };

  // Handle Save Remark
  const saveRemark = async (id) => {
    try {
      const updatedRemark = remarks[id] || "";
      await axios.put(`${API_URL}/${id}`, { remark: updatedRemark });

      // Refresh Data
      fetchData(currentPage);
      setRemarks({ ...remarks, [id]: "" }); // Clear input after saving
    } catch (error) {
      console.error("Error updating remark:", error);
    }
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
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td dangerouslySetInnerHTML={{ __html: item.query_message }} />
                    <td>{item.vendor_category}</td>
                    <td>{item.vendor_name}</td>
                    <td>{item.vendor_contact}</td>
                    <td>{item.remark || "No remarks"}</td>
                    <td>{item.remark_date ? new Date(item.remark_date).toLocaleString() : "N/A"}</td>
                    <td>
                      <textarea
                        className="enter-remark"
                        placeholder="Enter remark"
                        value={remarks[item.id] || ""}
                        onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                      />
                      <br />
                      <button className="btn-action" onClick={() => saveRemark(item.id)}>
                        Save
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
          <button onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
