import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
logoutUser,
fetchCurrentUser,
fetchUserAvatar,
} from "../../redux/slices/AuthSlice"; 
import "./Navigation.css";
import { selectUserAvatar } from "../../redux/slices/AuthSelectors";
import placeholder from "../../assets/placeholder.png";
import { selectUserRole } from "../../redux/slices/AuthSelectors.js";
import { toast } from "react-toastify";

const Navigation = () => {
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const dropdownRef = useRef(null);
const navigate = useNavigate();
const dispatch = useDispatch();

// Estado global del usuario
const { isLoggedIn, user, userUpdated } = useSelector((state) => state.auth);

const avatar = useSelector(selectUserAvatar);

const role = useSelector(selectUserRole);
const isAdmin = role === "ADMIN";

// Cargar datos del usuario cuando hay token
useEffect(() => {
  if (isLoggedIn) {
    dispatch(fetchCurrentUser()).then(() => {
      dispatch(fetchUserAvatar());
    });
  } else {
    // Si no está logueado, reseteo
    dispatch({ type: "auth/resetAvatar" });
  }
}, [isLoggedIn, userUpdated, dispatch]);



// Navegaciones
const handleFavoritesClick = (e) => {
  e.preventDefault();
  if (isAdmin) {
    toast.error("No puedes tener productos favoritos como 'Admin'")
    return; // El admin NO puede usar favoritos
  }
  navigate(isLoggedIn ? "/favorites" : "/login");
};

const handleCartClick = (e) => {
  e.preventDefault();
  if (isAdmin) {
    toast.error("No puedes tener carrito como 'Admin'")
    return;
  }
  navigate(isLoggedIn ? "/cart" : "/login");
};

const handleLogout = () => {
  dispatch(logoutUser());
  navigate("/");
};

const handleProfile = () => {
  navigate("/profile");
  setIsDropdownOpen(false);
};

const handleSearch = () => {
  const trimmed = searchTerm.trim();
  if (trimmed) {
    navigate(`/products?keyword=${encodeURIComponent(trimmed)}`);
  } else {
    navigate("/products");
  }
};

// Cerrar el menú al hacer click afuera
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


return ( <nav className="navbar">
{/* LOGO */} <div className="navbar-brand"> <Link to="/" className="logo-link"> <h1 className="logo-text">Relicaria</h1> <svg
         version="1.0"
         xmlns="http://www.w3.org/2000/svg"
         className="logo-icon"
         viewBox="0 0 64 64"
       > <path
           d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28
             c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16
             c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z"
         /> </svg> </Link> </div>


  {/* BÚSQUEDA + BOTONES */}
  <div className="header-actions">
    <input
      type="text"
      className="search-input"
      placeholder="Busca..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
    />
    <button className="search-btn" onClick={handleSearch}>
      <span className="material-symbols-outlined">search</span>
    </button>

    {isLoggedIn ? (
      <>
        <button onClick={handleFavoritesClick} className="icon-btn">
          <span className="material-symbols-outlined">favorite</span>
        </button>

        <button onClick={handleCartClick} className="icon-btn">
          <span className="material-symbols-outlined">shopping_bag</span>
        </button>

        {/* PERFIL DROPDOWN */}
        <div className="profile-dropdown" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
            {avatar || placeholder ? (
              <img
                src={avatar || placeholder}
                alt="User"
                className="profile-avatar"
              />
            ) : null}

          </button>


          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleProfile} className="dropdown-item">
                Perfil
              </button>
              <button onClick={handleLogout} className="dropdown-item">
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </>
    ) : (
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn login-btn">
          Iniciar sesión
        </Link>
        <Link to="/register" className="auth-btn register-btn">
          Registrarse
        </Link>
      </div>
    )}
  </div>
</nav>


);
};

export default Navigation;