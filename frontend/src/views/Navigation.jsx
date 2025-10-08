import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../components/Navigation.css";

const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>Relicaria</h1>
        </Link>
      </div>

      <div className="header-actions">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
        />
        
        <Link to="/products" className="icon-btn">
          <button className="search-btn">
            <span className="material-symbols-outlined">search</span>
          </button>
        </Link>

        <Link to="/favorites" className="icon-btn">
          <span className="material-symbols-outlined">favorite</span>
        </Link>
        <Link to="/cart" className="icon-btn">
          <span className="material-symbols-outlined">shopping_bag</span>
        </Link>

        <div className="profile-dropdown" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBaTsKRVIvCahzr9M3KsusOGKT2BvLMbZee-jkK1P7OPWNfWFM9b2nS2yMMsX-alJGES8YLdV3ijzIsE7GEYZKb2W0GK0ydmXrKqXcVmJkcGaaJqGd_zHxXQv5GxbvnQQH4TCiQiAHDokR-pZQ9h1EojFL5p8blcGn4V1Fptp5RZWBEA-78HFsEBaPeuae3tzKDrKMttWZA7QxGGM9LLDNrF_gzrc436KakDSecADDhqSoWd5HedyuGQQ4EoJ_ewShuw-kavWztcQ"
              alt="User"
            />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/register" className="dropdown-item">Register</Link>
              <Link to="/login" className="dropdown-item">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
