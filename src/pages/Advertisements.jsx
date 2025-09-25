import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../styles/ManageAdvertises.css"; // Import external CSS
import { Button, Table, Form, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

// import React, { useEffect, useState } from "react";
import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const ManageAdvertises = () => {

//   // Initialize with dummy data
//   const [advertises, setAdvertises] = useState([
//     {
//       id: 1,
//       name: "Advertise 1",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2023-10-01",
//       end_date: "2023-10-31",
//     },
//     {
//       id: 2,
//       name: "Advertise 2",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2023-11-01",
//       end_date: "2023-11-30",
//     },
//     {
//       id: 3,
//       name: "Advertise 3",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2023-12-01",
//       end_date: "2023-12-31",
//     },
//     {
//       id: 4,
//       name: "Advertise 4",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2023-11-01",
//       end_date: "2023-11-30",
//     },
//     {
//       id: 5,
//       name: "Advertise 5",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2023-12-01",
//       end_date: "2023-12-31",
//     },
//     {
//       id: 6,
//       name: "Advertise 6",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2024-01-01",
//       end_date: "2024-01-31",
//     },
//     {
//       id: 7,
//       name: "Advertise 7",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2024-02-01",
//       end_date: "2024-02-28",
//     },
//     {
//       id: 8,
//       name: "Advertise 8",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2024-03-01",
//       end_date: "2024-03-31",
//     },
//     {
//       id: 9,
//       name: "Advertise 9",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2024-04-01",
//       end_date: "2024-04-30",
//     },
//     {
//       id: 10,
//       name: "Advertise 10",
//       image: "https://via.placeholder.com/150",
//       url: "https://example.com",
//       start_date: "2024-05-01",
//       end_date: "2024-05-31",
//     },
//   ]);

//   const [newAdvertise, setNewAdvertise] = useState({
//     name: "",
//     image: "",
//     url: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [editingIndex, setEditingIndex] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 5; // Number of items per page

//   useEffect(() => {
//     // Calculate total pages based on the number of items
//     setTotalPages(Math.ceil(advertises.length / limit));
//   }, [advertises]);

//   // Function to get the data for the current page
//   const getPaginatedData = () => {
//     const startIndex = (currentPage - 1) * limit;
//     const endIndex = startIndex + limit;
//     return advertises.slice(startIndex, endIndex);
//   };

//   const handleChange = (e) => {
//     setNewAdvertise({ ...newAdvertise, [e.target.name]: e.target.value });
//   };

//   const saveAdvertise = async () => {
//     if (newAdvertise.name && newAdvertise.image && newAdvertise.url && newAdvertise.startDate && newAdvertise.endDate) {
//       const advertiseData = {
//         name: newAdvertise.name,
//         image: newAdvertise.image,
//         url: newAdvertise.url,
//         start_date: newAdvertise.startDate,
//         end_date: newAdvertise.endDate,
//       };

//       try {
//         if (editingIndex !== null) {
//           await axios.put(`https://your-api.com/advertises/${advertises[editingIndex].id}`, advertiseData);
//         } else {
//           await axios.post("https://your-api.com/advertises", advertiseData);
//         }
//         setEditingIndex(null);
//         setNewAdvertise({ name: "", image: "", url: "", startDate: "", endDate: "" });
//       } catch (error) {
//         console.error("Error saving advertisement:", error);
//       }
//     }
//   };

//   const editAdvertise = (index) => {
//     setNewAdvertise({
//       name: advertises[index].name,
//       image: advertises[index].image,
//       url: advertises[index].url,
//       startDate: advertises[index].start_date,
//       endDate: advertises[index].end_date,
//     });
//     setEditingIndex(index);
//   };

//   const deleteAdvertise = async (id) => {
//     try {
//       await axios.delete(`https://your-api.com/advertises/${id}`);

//     } catch (error) {
//       console.error("Error deleting advertisement:", error);
//     }
//   };

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="title">Manage Advertisements</h2>

//       <Card className="p-3 mb-3 form-container-top">
//         <div className="form-container">
//           <Form.Control type="text" name="name" value={newAdvertise.name} onChange={handleChange} placeholder="Enter advertise name" />
//           <Form.Control type="text" name="image" value={newAdvertise.image} onChange={handleChange} placeholder="Enter image URL" />
//           <Form.Control type="text" name="url" value={newAdvertise.url} onChange={handleChange} placeholder="Enter redirect URL" />
//           <Form.Control type="date" name="startDate" value={newAdvertise.startDate} onChange={handleChange} />
//           <Form.Control type="date" name="endDate" value={newAdvertise.endDate} onChange={handleChange} />
//           <Button variant="success" onClick={saveAdvertise}>
//             {editingIndex !== null ? "Update" : "Add"} Advertise
//           </Button>
//         </div>
//       </Card>

//       <Table bordered hover className="text-center">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Image</th>
//             <th>Name</th>
//             <th>URL</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {getPaginatedData().map((ad, index) => (
//             <tr key={ad.id}>
//               <td>{ad.id}</td>
//               <td><img src={ad.image} alt={ad.name} width="50" /></td>
//               <td>{ad.name}</td>
//               <td><a href={ad.url} target="_blank" rel="noopener noreferrer">{ad.url}</a></td>
//               <td>{ad.start_date}</td>
//               <td>{ad.end_date}</td>
//               <td>
//                 <Button variant="warning" className="me-2" onClick={() => editAdvertise(index)}>
//                   <FaEdit />
//                 </Button>
//                 <Button variant="danger" onClick={() => deleteAdvertise(ad.id)}>
//                   <FaTrash />
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <div className="pagination d-flex justify-content-center mt-3">
//         <Button variant="secondary" className="me-2" onClick={prevPage} disabled={currentPage === 1}>
//           Previous
//         </Button>
//         <span className="align-self-center">Page {currentPage} of {totalPages}</span>
//         <Button variant="secondary" className="ms-2" onClick={nextPage} disabled={currentPage === totalPages}>
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ManageAdvertises; import React, { useEffect, useState } from "react"; 

export default function QuickCabsAdvertise() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ name: "", image: null });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/advertise/get`);
      console.log("Fetched Ads:", response.data);
      setAds(response.data.formattedAdvertisements);
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
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/advertise/`, formData);
      fetchAds();
      setForm({ name: "", image: null });
      window.bootstrap.Modal.getInstance(document.getElementById('addAdModal')).hide();
    } catch (error) {
      console.error("Error posting ad:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-4">Quick Cabs Advertisements</h1>

        <button className="btn btn-primary mb-3 text-nowrap" data-bs-toggle="modal" data-bs-target="#addAdModal">
          Add Advertisement
        </button>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="addAdModal" tabIndex="-1" aria-labelledby="addAdModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="addAdModalLabel">Add Advertisement</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-start ">Name</label>
                  <input
                    type="text"
                    className="form-control border border-black"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-start">Image</label>
                  <input
                    type="file"
                    className="form-control border border-black"
                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  />
                </div>

                <div className="text-start">
                  <button type="submit" className="btn btn-dark mt-3 ms-0">
                    Add Advertisement
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
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads?.map((ad, index) => (
            <tr key={index}>
              <td>{ad.id || "N/A"}</td>
              <td>{ad.postedFrom || "No Name"}</td>
              <td>
                <a target="_blank" href={`${process.env.REACT_APP_BACKEND_URL}/${ad.image}`}>Advertisements {index + 1}</a>
                {/* {ad.image ? (
                  <img src={`https://quickcabpune.com/app/${ad.image}`} alt={ad.name} target="_blank" className="img-thumbnail" style={{ height: "50px" }} />
                ) : (
                  "No Image"
                )} */}

                
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(ad.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
