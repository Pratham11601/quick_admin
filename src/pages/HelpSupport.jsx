import React, { useState } from "react";
import "../styles/HelpSupport.css";

const HelpSupport = () => {
  const data = [
    { id: 115, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "pending", remarkDate: "0000-00-00" },
    { id: 114, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "pending", remarkDate: "0000-00-00" },
    { id: 113, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "pending", remarkDate: "0000-00-00" },
    { id: 112, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "pending", remarkDate: "0000-00-00" },
    { id: 111, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 110, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 109, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 108, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 107, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 106, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 105, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
    { id: 104, receivedOn: "25-02-16 14:43:30", queryMessage: "Pune To Mumbai help", vendorCategory: "cab", vendorName: "Rahul Randive", vendorContact: "9550506905", remarks: "", remarkDate: "0000-00-00" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get data for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Handle Next Page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle Previous Page
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="help_support">
      <div className="top-wlc"></div>
      <h2 className="support">Manage Help & Support</h2>
      <hr />

      <div className="data-container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Received <br />On</th>
                <th>Query Message</th>
                <th>Vendor <br />Category</th>
                <th>Vendor Name</th>
                <th>Vendor <br />Contact</th>
                <th>Remarks</th>
                <th>Remark <br />Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.receivedOn}</td>
                  <td>{item.queryMessage}</td>
                  <td>{item.vendorCategory}</td>
                  <td>{item.vendorName}</td>
                  <td>{item.vendorContact}</td>
                  <td>{item.remarks}</td>
                  <td>{item.remarkDate}</td>
                  <td>
                    <textarea className="enter-remark" placeholder="Enter remark"></textarea>
                    <br />
                    <button className="btn-action">Save</button>
                  </td>
                </tr>
              ))}
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
