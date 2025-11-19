import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/AuthSlice";
import { toast } from "react-toastify";
import {
  selectAuthLoading,
  selectAuthError,
  selectIsLoggedIn,
} from "../../../redux/slices/AuthSelectors";

import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    if (isLoggedIn) {
      toast.success("Login exitoso");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="app bg-light dark:bg-dark font-display text-slate-800 dark:text-slate-200">
      <div className="flex flex-col min-h-screen">
        <main className="main">
          <div className="login-box">
            <div>
              <h2 className="welcome">Bienvenido de vuelta</h2>
              <p className="subtitle">
                Inicia sesión en tu cuenta de Relicaria
              </p>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="error">{error}</p>}
              {loading && <p>Cargando...</p>}

              <button type="submit" className="btn-submit" disabled={loading}>
                Inicia sesión
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}