// src/views/UserLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../components/UserProfile.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/users/me", {
          credentials: "include", // Para que Spring Security maneje sesión/token
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUser({
          name: data.name || "Usuario",
          email: data.email || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
        handleLogout(); // Forzar logout si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="error">{error}</p>;

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
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p>
          <Link to="/editProfile" className="edit-link">
            Edit Profile
          </Link>

          <nav className="sidebar-nav">
            <Link to="/profile/orders" className="nav-link">
              🛍 Orders
            </Link>
            <Link to="/profile/products" className="nav-link">
              🏪 My Products
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
