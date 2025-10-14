import React from "react";
import "../components/EditProfile.css";

const EditProfile = () => {
  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <h1>Edit Profile</h1>
          <p>Update your profile information.</p>
        </div>

        <form className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              pattern="[A-Za-zÀ-ÿ\s]{2,40}"
              title="Solo letras y espacios (2 a 40 caracteres)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              title="Ingresá un email válido"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="+1 (555) 123-4567"
              required
              pattern="^[0-9+\s()-]{7,20}$"
              title="Solo números, +, -, () y espacios (7–20 caracteres)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              rows="3"
              placeholder="123 Main St, Anytown, USA 12345"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}"
              title="Al menos 6 caracteres, una letra y un número"
            />
            <p className="form-note">Leave blank to keep your current password.</p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="submit" className="update-btn">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
