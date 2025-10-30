import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./UserLayout.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    fullName: "",
    email: "",
    username: "",
    avatar: "",
  });
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("No hay token, inicia sesión");
      setLoading(false);
      return;
    }

    const fetchUserAndRole = async () => {
      try {
        // Obtener datos del usuario
        const userResponse = await fetch("http://localhost:8080/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error(`Error: ${userResponse.status}`);
        const userData = await userResponse.json();

        // Intentar obtener la imagen del usuario
        let avatarUrl = "";
        try {
          const imageResponse = await fetch(`http://localhost:8080/users/${userData.id}/image`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            avatarUrl = URL.createObjectURL(blob);
          }
        } catch (imgErr) {
          console.warn("No se pudo obtener la imagen de perfil:", imgErr);
        }

        setUser({
          id: userData.id,
          fullName: `${userData.name} ${userData.surname}`.trim() || "Usuario",
          email: userData.email || "",
          username: userData.username || "",
          avatar: avatarUrl,
        });

        // Obtener el rol del usuario
        const roleResponse = await fetch("http://localhost:8080/users/role", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!roleResponse.ok) throw new Error(`Error fetching role: ${roleResponse.status}`);
        const roleData = await roleResponse.json();
        setRole(roleData.role);

        // Redirigir automáticamente según el rol
        if (window.location.pathname === "/profile") {
          navigate(roleData.role === "ADMIN" ? "/profile/categories" : "/profile/products", { replace: true });
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRole();
  }, [navigate]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="error">{error}</p>;

  const isAdmin = role === "ADMIN";

  return (
    <div className="profile-page">
      <aside className="sidebar">
        <div className="profile-card">
          <div className="avatar-container">
            {user.avatar ? (
              <img src={user.avatar} alt="User avatar" className="avatar" />
            ) : (
              <div className="avatar placeholder">
                <span className="material-symbols-outlined">person</span>
              </div>
            )}
          </div>
          <h2>{user.fullName}</h2>
          <p className="username">{user.username}</p>
          <Link to="/editProfile" className="edit-link">
            Editar Perfil
          </Link>

          <nav className="sidebar-nav">
            {!isAdmin && (
              <>
                <Link to="/profile/orders" className="nav-link">
                  🛍 Mis Órdenes
                </Link>
                <Link to="/profile/products" className="nav-link">
                  🏪 Mis Productos
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/profile/categories" className="nav-link">
                🏷 Categorías
              </Link>
            )}
            <button onClick={handleLogout} className="nav-link logout">
              Cerrar sesión
            </button>
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
