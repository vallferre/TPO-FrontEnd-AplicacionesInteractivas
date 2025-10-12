import React from "react";
import { Link } from "react-router-dom";
import "../components/UserProfile.css";

const UserProfile = () => {
  return (
    <div className="profile-page">
      <main className="main-content">
        <div className="header">
          <h1>My Products</h1>
          <Link to="/create">
            <button className="add-button">＋ Add Product</button>
          </Link>
        </div>

        <div className="products-list">
          {[
            {
              name: "Classic Cotton T-Shirt",
              price: "$25.00",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhcbZc5P8cxoI6ylGRQLKWJn3iNgBh_EjsFOxuwoUbrqc8Afc4iD6pmztElxKLzruCR4xBzd1M2qK_eR8Jf8AxbOgqfG6RSIruDDLZedl4FjPuX6LdsBJZNNWlJiRq0uTTPj8LfaZXEibQrxgp_eAPSYEaTmPVupCRkiBsTRLQULVBojmzcuo0-xDxnY6jwjHJQDufAgvI8t4e2Zu7vIRwK1d9aimEGZbP-mQjVP_X7BMjF6eOvdcsP2VUA0YjDfrHL7d3p1T209L",
              status: "Active",
              statusClass: "status-active",
            },
            {
              name: "Comfortable Running Shoes",
              price: "$45.00",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz_qeJTa5r203rd-gjLvLw2GW9Fx_WxNzHG-kDPbREl6yXE1h6nIyVLzwzp1nn-zBx6qYbnzJ4duHFPm6YaC_2U_mlpfJGcBxC6_V5GIzrUB8yb1WrzOTTSC2hFnFxpL0w-WforRXN1dqiXFUymSuZu7MDWtHiAIdyrs56erDSxky21YB5xf05i7HXXBLmy8EIWOKvBRTPU4jFEBRg0Y3IHIf1JWKb74_WN_XbWISOtg9L9eEDmAl_Kwa65EeQ9AlZBd5NGjN7iFYP",
              status: "Active",
              statusClass: "status-active",
            },
            {
              name: "Stylish Baseball Cap",
              price: "$15.00",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsHtGSC3u-p_b_PwZTNhflOtclrCVmY1NyCXZhii2q7KjeWzGpqVWuUYiZr5-tRTemhgGYfcSXKXlkAbMFrYkWIDNTW_cswwJTxuPacwbLY-j2SiaFhvVwpWrwaAs358_93rNLyOwPCi64XgBdjNIg6tUVepKgBGDcjUr4nFUl4fPOazv7eFrk_BH3iptm3eI7vVVvHq1OmRARd5FV69hNpZfzsxy9Fb8iz85i94UEKgdjq6cHqBZf4nn7HyJw8uWhdLvX_ktlYcxx",
              status: "Pending",
              statusClass: "status-pending",
            },
            {
              name: "Leather Wallet",
              price: "$35.00",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfxBzW11MXXkqOvQ1L8OuOOALYsKHFwbQxml2-rowcOj9Xomdwn8fJc3jtXM7hJzEx1E9bkZmCI8V89RTrZBKsqfI5EBca9J2mEalb62mYZxtiJ0-FDfXP8cCR-1wNInR2X-n6hTH09vnIHe_OzwMjbFTmSNJWQcsyUZ_W9QwSKynQigt7FmVj8HjcsjIe9r40HTQo_EK7o12GjWEy2vomFkSqroYp4ewrKHFUvMhEA57a_1TK3MuFw49bZ1ShzpBxX0jgWrPz9fxr",
              status: "Sold",
              statusClass: "status-sold",
            },
          ].map((item, i) => (
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
