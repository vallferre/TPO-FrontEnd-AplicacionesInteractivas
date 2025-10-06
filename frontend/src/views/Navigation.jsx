import { Link } from "react-router-dom";
import "../components/Navigation.css";


const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ColecXion</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/create">Publicar</Link></li>
      </ul>

      <div className="header-actions">
            <div className="search-wrapper">
              <button className="search-btn">
                <span className="material-symbols-outlined">search</span>
                <input type="text" placeholder="Search..." />
              </button>
            </div>

            <button className="icon-btn">
                <Link to="/favorites">
              <span className="material-symbols-outlined">favorite</span>
                </Link>
            </button>
            <button className="icon-btn">
              <Link to="/cart">
              <span className="material-symbols-outlined">shopping_bag</span>
              </Link>
            </button>
            <button className="profile-btn">
                <Link to="/profile">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBaTsKRVIvCahzr9M3KsusOGKT2BvLMbZee-jkK1P7OPWNfWFM9b2nS2yMMsX-alJGES8YLdV3ijzIsE7GEYZKb2W0GK0ydmXrKqXcVmJkcGaaJqGd_zHxXQv5GxbvnQQH4TCiQiAHDokR-pZQ9h1EojFL5p8blcGn4V1Fptp5RZWBEA-78HFsEBaPeuae3tzKDrKMttWZA7QxGGM9LLDNrF_gzrc436KakDSecADDhqSoWd5HedyuGQQ4EoJ_ewShuw-kavWztcQ"
                alt="User"
              />
              </Link>
            </button>
        </div>
    </nav>
  );
};

export default Navigation;
