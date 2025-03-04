import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EmailSettings.css";

const EmailSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentEmail: "",
    newEmail: "",
    confirmEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newEmail !== formData.confirmEmail) {
      alert("New email and confirm email do not match!");
      return;
    }
    console.log("Email Updated:", formData);
    alert("Email updated successfully!");
    setFormData({ currentEmail: "", newEmail: "", confirmEmail: "" });
  };

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Settings</h2>

        <div className="settings__top">
          <button className="setting__btn" onClick={() => navigate("/myprofile")}>
            My Details
          </button>
          <button className="setting__btn" onClick={() => navigate("/settings")}>
            Profile
          </button>
          <button className="setting__btn" onClick={() => navigate("/password-settings")}>
            Password
          </button>
          <button className="setting__btn active__btn" onClick={() => navigate("/email")}>Email</button>
          <button className="setting__btn" onClick={() => navigate("/notifications")}>
            Notification
          </button>
        </div>

        <div className="details__form">
          <h2 className="profile__title">Change Email</h2>
          <p className="profile__desc">Update your email for security</p>

          <form onSubmit={handleSubmit}>
            <div className="form__group">
              <div>
                <label>Current Email</label>
                <input type="email" name="currentEmail" value={formData.currentEmail} onChange={handleChange} required />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>New Email</label>
                <input type="email" name="newEmail" value={formData.newEmail} onChange={handleChange} required />
              </div>
              <div>
                <label>Confirm Email</label>
                <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
              </div>
            </div>

            <div className="profile__img-btns">
              <button type="submit" className="update__btn">Update Email</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;