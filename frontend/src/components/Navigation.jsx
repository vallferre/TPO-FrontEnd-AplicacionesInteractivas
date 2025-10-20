import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/Navigation.css";

const API_BASE = "http://localhost:8080";

const Navigation = () => {
  const { isLoggedIn, setIsLoggedIn, userUpdated } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userImage, setUserImage] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🧠 Cargar imagen del usuario usando el token JWT
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!isLoggedIn || !token) return;

    const fetchUserAndImage = async () => {
      try {
        // 1️⃣ Obtener el usuario actual a partir del token
        const userRes = await fetch(`${API_BASE}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("No se pudo obtener el usuario");

        const userData = await userRes.json();
        const userId = userData.id;

        if (!userId) throw new Error("El ID del usuario no está definido");

        // 2️⃣ Obtener la imagen de ese usuario
        const imageRes = await fetch(`${API_BASE}/users/${userId}/image`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!imageRes.ok) {
          console.warn("El usuario no tiene imagen cargada");
          setUserImage(null);
          return;
        }

        const blob = await imageRes.blob();
        setUserImage(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Error al obtener imagen de usuario:", err);
        setUserImage(null);
      }
    };

    fetchUserAndImage();
  }, [isLoggedIn, userUpdated]); // 👈 se actualiza cuando cambia la imagen o el login

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) navigate("/favorites");
    else navigate("/login");
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) navigate("/cart");
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

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/products?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/products");
    }
  };

  // 🔒 Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo-link">
          <h1 className="logo-text">Relicaria</h1>
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            className="logo-icon"
            viewBox="0 0 64 64"
          >
            <path
              d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28
              c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16
              c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z"
            />
          </svg>
        </Link>
      </div>

      <div className="header-actions">
        <input
          type="text"
          className="search-input"
          placeholder="Busca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
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

            <div className="profile-dropdown" ref={dropdownRef}>
              <button
                className="profile-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={
                    userImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User"
                  className="user-avatar"
                />
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
