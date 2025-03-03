import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PasswordSettings.css";

const PasswordSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Password Updated:", formData);
    alert("Password updated successfully!");
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Settings</h2>

        <div className="settings__top">
          <button className="setting__btn" onClick={() => navigate("/myprofile")}>My Details</button>
          <button className="setting__btn" onClick={() => navigate("/settings")}>Profile</button>
          <button className="setting__btn active__btn" onClick={() => navigate("/password-settings")}>Password</button>
          <button className="setting__btn" onClick={() => navigate("/email")}>Email</button>
          <button className="setting__btn" onClick={() => navigate("/notifications")}>Notification</button>
        </div>

        <div className="details__form">
          <h2 className="profile__title">Change Password</h2>
          <p className="profile__desc">Update your password for security</p>

          <form onSubmit={handleSubmit}>
            <div className="form__group">
              <div>
                <label>Current Password</label>
                <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
              </div>
              <div>
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="profile__img-btns">
              <button type="submit" className="update__btn">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettings;
