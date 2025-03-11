import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageAdvertises.css"; // Import external CSS
import { Button, Table, Form, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageAdvertises = () => {
  const [advertises, setAdvertises] = useState([]);
  const [newAdvertise, setNewAdvertise] = useState({
    name: "",
    image: "",
    url: "",
    startDate: "",
    endDate: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchAdvertises();
  }, [currentPage]);

  const fetchAdvertises = async () => {
    try {
      const response = await axios.get(`https://your-api.com/advertises?page=${currentPage}&limit=${limit}`);
      setAdvertises(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    }
  };

  const handleChange = (e) => {
    setNewAdvertise({ ...newAdvertise, [e.target.name]: e.target.value });
  };

  const saveAdvertise = async () => {
    if (newAdvertise.name && newAdvertise.image && newAdvertise.url && newAdvertise.startDate && newAdvertise.endDate) {
      const advertiseData = {
        name: newAdvertise.name,
        image: newAdvertise.image,
        url: newAdvertise.url,
        start_date: newAdvertise.startDate,
        end_date: newAdvertise.endDate,
      };

      try {
        if (editingIndex !== null) {
          await axios.put(`https://your-api.com/advertises/${advertises[editingIndex].id}`, advertiseData);
        } else {
          await axios.post("https://your-api.com/advertises", advertiseData);
        }
        setEditingIndex(null);
        setNewAdvertise({ name: "", image: "", url: "", startDate: "", endDate: "" });
        fetchAdvertises();
      } catch (error) {
        console.error("Error saving advertisement:", error);
      }
    }
  };

  const editAdvertise = (index) => {
    setNewAdvertise({
      name: advertises[index].name,
      image: advertises[index].image,
      url: advertises[index].url,
      startDate: advertises[index].start_date,
      endDate: advertises[index].end_date,
    });
    setEditingIndex(index);
  };

  const deleteAdvertise = async (id) => {
    try {
      await axios.delete(`https://your-api.com/advertises/${id}`);
      fetchAdvertises();
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mt-4">
      <h2 className="title">Manage Advertisements</h2>

      <Card className="p-3 mb-3">
        <div className="form-container">
          <Form.Control type="text" name="name" value={newAdvertise.name} onChange={handleChange} placeholder="Enter advertise name" />
          <Form.Control type="text" name="image" value={newAdvertise.image} onChange={handleChange} placeholder="Enter image URL" />
          <Form.Control type="text" name="url" value={newAdvertise.url} onChange={handleChange} placeholder="Enter redirect URL" />
          <Form.Control type="date" name="startDate" value={newAdvertise.startDate} onChange={handleChange} />
          <Form.Control type="date" name="endDate" value={newAdvertise.endDate} onChange={handleChange} />
          <Button variant="success" onClick={saveAdvertise}>
            {editingIndex !== null ? "Update" : "Add"} Advertise
          </Button>
        </div>
      </Card>

      <Table bordered hover className="text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>URL</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {advertises.map((ad, index) => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td><img src={ad.image} alt={ad.name} width="50" /></td>
              <td>{ad.name}</td>
              <td><a href={ad.url} target="_blank" rel="noopener noreferrer">{ad.url}</a></td>
              <td>{ad.start_date}</td>
              <td>{ad.end_date}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => editAdvertise(index)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => deleteAdvertise(ad.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination d-flex justify-content-center mt-3">
        <Button variant="secondary" className="me-2" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="align-self-center">Page {currentPage} of {totalPages}</span>
        <Button variant="secondary" className="ms-2" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ManageAdvertises;
