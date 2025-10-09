import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // navegación sin manipular DOM
import "../components/Login.css";

export default function Login() {
  // Constante para la URL base del backend
  const API_URL = "http://localhost:8080/auth/login";

  // Hooks
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Si el backend devuelve un error
      if (!response.ok) {
        // Leemos la respuesta del backend
        const text = await response.text();

        // Diferenciamos entre error de credenciales (401) y otros errores
        if (response.status === 401 || response.status === 400) {
          setError("Username o contraseña incorrectos");
        } else {
          setError(`Error del servidor: ${text || response.status}`);
        }

        return; // Salimos antes de procesar JSON
      }

      // Si todo OK, parseamos JSON y guardamos el token
      const data = await response.json();
      localStorage.setItem("jwtToken", data.token);

      // Redirigimos al perfil
      navigate("/profile");

    } catch (err) {
      // Error de red o fetch
      setError("No se pudo conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="app bg-light dark:bg-dark font-display text-slate-800 dark:text-slate-200">
      <div className="flex flex-col min-h-screen">
        <main className="main">
          <div className="login-box">
            <div>
              <h2 className="welcome">Welcome back</h2>
              <p className="subtitle">Log in to your Relicaria account</p>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="error">{error}</p>}
              {loading && <p>Loading...</p>}

              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" name="remember-me" />
                  Remember me
                </label>
                <a href="#" className="forgot">
                  Forgot your password?
                </a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                Log In
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="socials">
              <a href="#" className="social google">
                Google
              </a>
              <a href="#" className="social facebook">
                Facebook
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
