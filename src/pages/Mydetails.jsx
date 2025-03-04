import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

const MyDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    liveIn: "Sylhet, Bangladesh",
    street: "SYL 3108",
    email: "example@gmail.com",
    phone: "+880 17*******",
    dob: "",
    gender: "Male",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Details:", formData);
    alert("Details updated successfully!");
  };

  const handleDelete = () => {
    setFormData({
      liveIn: "",
      street: "",
      email: "",
      phone: "",
      dob: "",
      gender: "Male",
      profileImage: null,
    });
    alert("Details data cleared!");
  };

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Settings</h2>

        <div className="settings__top">
          <button className="setting__btn active__btn" onClick={() => navigate("/myprofile")}>
            My Details
          </button>
          <button className="setting__btn" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button className="setting__btn" onClick={() => navigate("/password")}>Password</button>
          <button className="setting__btn" onClick={() => navigate("/email")}>Email</button>
          <button className="setting__btn" onClick={() => navigate("/notifications")}>Notification</button>
        </div>

        <div className="details__form">
          <h2 className="profile__title">My Details</h2>
          <p className="profile__desc">Update your personal details here</p>

          <form onSubmit={handleSubmit}>
            <div className="form__group">
              <div>
                <label>Live in</label>
                <input type="text" name="liveIn" value={formData.liveIn} onChange={handleChange} />
              </div>
              <div>
                <label>Street</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
              <div>
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Your Photo</label>
                <p className="profile-img__desc">This will be displayed in your profile</p>
                <input type="file" onChange={handleFileChange} />
              </div>
            </div>

            <div className="profile__img-btns">
              <button type="button" className="dlt__btn" onClick={handleDelete}>
                Delete
              </button>
              <button type="submit" className="update__btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDetails;