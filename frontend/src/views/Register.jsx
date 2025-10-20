import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/Register.css";

export default function CreateAccount() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/auth/register";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      name: form.name,
      surname: form.surname
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(`Error del servidor: ${text || response.status}`);
        return;
      }

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("jwtToken", data.access_token);
        setIsLoggedIn(true); // Actualiza Navbar inmediatamente
        navigate("/"); // Redirige a landing
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app bg-light dark:bg-dark font-display text-slate-800 dark:text-slate-200">
      <div className="flex flex-col min-h-screen">
        <main className="main">
          <div className="form-wrapper">
            <div>
              <h2 className="form-title">Crea una cuenta</h2>
              <p className="form-subtitle">
                Ya tienes una cuenta?{" "}
                <Link to="/login" className="link">Inicia sesión</Link>
              </p>
            </div>

            <div className="form-card">
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Nombre de usuario</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="surname">Apellido</label>
                  <input
                    id="surname"
                    name="surname"
                    type="text"
                    value={form.surname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Dirección email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirma Contraseña</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <p className="error">{error}</p>}
                {loading && <p>Cargando...</p>}

                <button type="submit" className="btn-submit" disabled={loading}>
                  Crear cuenta
                </button>
              </form>
            </div>

            <p className="form-footer">
              Creando tu cuenta, das consentimiento a nuestros <br />
              <a href="#" className="link">Términos de servicio</a> y{" "}
              <a href="#" className="link">Políticas de privacidad</a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}