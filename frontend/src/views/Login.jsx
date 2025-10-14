import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/Login.css";

export default function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/auth/login";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 401 || response.status === 400) {
          setError("Username o contraseña incorrectos");
        } else {
          setError(`Error del servidor: ${text || response.status}`);
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem("jwtToken", data.access_token);
      //VERIFICACIÓN
      console.log(localStorage.getItem("jwtToken"));

      setIsLoggedIn(true); // Actualiza Navbar inmediatamente
      navigate("/"); // Redirige a landing
    } catch (err) {
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

              <button type="submit" className="btn-submit" disabled={loading}>
                Log In
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}