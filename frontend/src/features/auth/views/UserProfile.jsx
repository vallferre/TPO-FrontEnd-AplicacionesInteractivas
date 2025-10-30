import React from "react";
import { Link } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  return (
    <div className="profile-page">
      <main className="main-content">
        <div className="header">
          <h1>Mis Products</h1>
          <Link to="/create">
            <button className="add-button">＋ Agregar Producto</button>
          </Link>
        </div>

        <div className="products-list">
          {[].map((item, i) => (
            <div key={i} className="product-card">
              <div
                className="product-image"
                style={{ backgroundImage: `url(${item.img})` }}
              ></div>
              <div className="product-info">
                <p className="product-name">{item.name}</p>
                <p className="product-price">{item.price}</p>
              </div>
              <div className="product-actions">
                <span className={`status ${item.statusClass}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
