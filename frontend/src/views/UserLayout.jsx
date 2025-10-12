// src/views/UserLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../components/UserProfile.css";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="profile-page">
      {/* === Sidebar del usuario === */}
      <aside className="sidebar">
        <div className="profile-card">
          <div className="avatar-container">
            <div
              className="avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfxBzW11MXXkqOvQ1L8OuOOALYsKHFwbQxml2-rowcOj9Xomdwn8fJc3jtXM7hJzEx1E9bkZmCI8V89RTrZBKsqfI5EBca9J2mEalb62mYZxtiJ0-FDfXP8cCR-1wNInR2X-n6hTH09vnIHe_OzwMjbFTmSNJWQcsyUZ_W9QwSKynQigt7FmVj8HjcsjIe9r40HTQo_EK7o12GjWEy2vomFkSqroYp4ewrKHFUvMhEA57a_1TK3MuFw49bZ1ShzpBxX0jgWrPz9fxr")',
              }}
            ></div>
          </div>
          <h2>Alex Morgan</h2>
          <p className="email">alex.morgan@example.com</p>
          {/*<button className="edit-button">Edit Profile</button> */}
          <Link to="/editProfile" className="edit-link">Edit Profile</Link>

          <nav className="sidebar-nav">
            <Link to="/profile/orders" className="nav-link">
              🛍 Orders
            </Link>
            <Link to="/profile/products" className="nav-link">
              🏪 My Products
            </Link>
            <Link to="/profile/settings" className="nav-link">
              ⚙️ Settings
            </Link>
            <button onClick={handleLogout} className="nav-link logout">
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* === Zona donde cambia el contenido === */}
      <main className="main-content">
        <Outlet /> {/* Acá se renderiza cada subvista */}
      </main>
    </div>
  );
};

export default UserLayout;
