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

        <div className="profile-picture-wrapper">
          <div className="profile-picture">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcZXkrW_PObC_E60iHLS4244Ax0OYSmc2oqIQzDgWKpPhWCs_Mv5gJ7aoYwvqyfBLxU3IGuzEeo1CSHoXcv4VManZ4nEm0reyaias-MKA4hgw3UfxLQnVaNsaoBNYEbc666udHSkgcZPLJyMfyEsB0E4t1k5rTEVernbpNysxE-Ms2bDQHwLfmBAOkeGVC9cl52YtT8lGsLxmjvPKaLgJSHl-wGmsnIk-tFlHS86ZnmjFkhHXBPYfeydPoyKeGKC7u8KmT5yq77u8s"
              alt="User"
            />
            <label htmlFor="profile-picture-upload" className="edit-picture-btn">
              <span className="material-symbols-outlined">edit</span>
              <input
                type="file"
                id="profile-picture-upload"
                name="profile-picture-upload"
                className="sr-only"
              />
            </label>
          </div>
        </div>

        <form className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea id="address" name="address" rows="3" placeholder="123 Main St, Anytown, USA 12345"></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" />
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
