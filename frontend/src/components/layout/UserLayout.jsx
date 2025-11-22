/* src/layouts/UserLayout.jsx */
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
selectToken,
selectUser,
selectUserAvatar,
selectUserRole,
selectAuthLoading,
selectAuthError,
} from "../../redux/slices/AuthSelectors";

import {
fetchCurrentUser,
fetchUserAvatar,
fetchUserRole,
logoutUser,
} from "../../redux/slices/AuthSlice";

import placeholder from "../../assets/placeholder.png";

import "./UserLayout.css";

const UserLayout = () => {
const navigate = useNavigate();
const dispatch = useDispatch();

// Redux state
const token = useSelector(selectToken);
const user = useSelector(selectUser);
const avatar = useSelector(selectUserAvatar);
const role = useSelector(selectUserRole);
const loading = useSelector(selectAuthLoading);
const error = useSelector(selectAuthError);

// Auto-load user data chain whenever token exists
useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  (async () => {
    try {
      // 1 ─ Obtener user
      const userRes = await dispatch(fetchCurrentUser()).unwrap();

      // 2 ─ Obtener avatar (maneja 404 solo y no explota)
      await dispatch(fetchUserAvatar());

      // 3 ─ Obtener rol
      const roleRes = await dispatch(fetchUserRole()).unwrap();

      const currentPath = window.location.pathname;

      // Si está justo en /profile → redirigimos
      if (currentPath === "/profile") {
        if (roleRes === "ADMIN") {
          navigate("/profile/categories", { replace: true });
        } else {
          navigate("/profile/products", { replace: true });
        }
      }

    } catch (err) {
      console.error("Error cargando usuario:", err);
      // Si el token expiró → lo sacamos
      dispatch(logoutUser());
      navigate("/login");
    }
  })();

}, [token, dispatch, navigate]);

const handleLogout = () => {
  dispatch(logoutUser());
  navigate("/");
};


if (loading) return <p>Cargando perfil...</p>;
if (error) return <p className="error">{error}</p>;

const isAdmin = role === "ADMIN";

return (
  <div className="profile-page">
    <aside className="sidebar">
      <div className="profile-card">
        <div className="avatar-container">
          {avatar ? (
            // Si existe avatar, usamos directamente la URL que viene del backend
            <img src={avatar} alt="User avatar" className="avatar" />
          ) : (
            // Si no hay avatar, mostramos un placeholder local o ícono
            <div className="avatar placeholder">
              <span className="material-symbols-outlined">person</span>
            </div>
          )}
        </div>

        <h2>
          {user?.name} {user?.surname}
        </h2>
        <p className="username">{user?.username}</p>

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