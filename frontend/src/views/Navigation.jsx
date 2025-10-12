import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../components/Navigation.css";

const Navigation = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) navigate("/favorites");
    else navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>Relicaria</h1>
        </Link>
      </div>

      <div className="header-actions">
        <input type="text" className="search-input" placeholder="Search..." />
        <Link to="/products" className="icon-btn">
          <button className="search-btn">
            <span className="material-symbols-outlined">search</span>
          </button>
        </Link>

        {isLoggedIn ? (
          <>
            <button onClick={handleFavoritesClick} className="icon-btn">
              <span className="material-symbols-outlined">favorite</span>
            </button>

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
                  <button onClick={handleProfile} className="dropdown-item">
                    Profile
                  </button>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn login-btn">
              Login
            </Link>
            <Link to="/register" className="auth-btn register-btn">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
