import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../assets/UserProfile.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    username: "",
    avatar: "",
  });
  const [role, setRole] = useState(""); // rol del usuario: "USER" o "ADMIN"
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
        const userResponse = await fetch("http://localhost:8080/users/", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error(`Error: ${userResponse.status}`);
        const userData = await userResponse.json();
        setUser({
          fullName: `${userData.name} ${userData.surname}`.trim() || "Usuario",
          email: userData.email || "",
          username: userData.username || "",
          avatar: userData.avatar || "",
        });

        const roleResponse = await fetch("http://localhost:8080/users/role", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!roleResponse.ok) throw new Error(`Error fetching role: ${roleResponse.status}`);
        const roleData = await roleResponse.json();
        setRole(roleData.role);

        // Redirigir automáticamente solo si estamos en /profile sin ruta hija
        if (window.location.pathname === "/profile") {
          if (roleData.role === "ADMIN") {
            navigate("/profile/categories", { replace: true });
          } else {
            navigate("/profile/products", { replace: true });
          }
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
            <div
              className="avatar"
              style={{
                backgroundImage: `url("${
                  user.avatar ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDfxBzW11MXXkqOvQ1L8OuOOALYsKHFwbQxml2-rowcOj9Xomdwn8fJc3jtXM7hJzEx1E9bkZmCI8V89RTrZBKsqfI5EBca9J2mEalb62mYZxtiJ0-FDfXP8cCR-1wNInR2X-n6hTH09vnIHe_OzwMjbFTmSNJWQcsyUZ_W9QwSKynQigt7FmVj8HjcsjIe9r40HTQo_EK7o12GjWEy2vomFkSqroYp4ewrKHFUvMhEA57a_1TK3MuFw49bZ1ShzpBxX0jgWrPz9fxr"
                }")`,
              }}
            ></div>
          </div>
          <h2>{user.fullName}</h2>
          <p className="username">{user.username}</p>
          <Link to="/editProfile" className="edit-link">
            Edit Profile
          </Link>

          <nav className="sidebar-nav">
            {!isAdmin && (
              <>
                <Link to="/profile/orders" className="nav-link">
                  🛍 Orders
                </Link>
                <Link to="/profile/products" className="nav-link">
                  🏪 My Products
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/profile/categories" className="nav-link">
                🏷 Categories
              </Link>
            )}
            <button onClick={handleLogout} className="nav-link logout">
              Logout
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