import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../components/Register.css";

export default function CreateAccount() {
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
      const token = data.token || data.access_token; // <-- acepta cualquiera de los dos nombres

      if (token) {
        localStorage.setItem("jwtToken", token);
        setIsLoggedIn(true); // actualiza estado global
        navigate("/"); // redirige a la landing
      } else {
        throw new Error("No se recibió token del servidor");
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
              <h2 className="form-title">Create an account</h2>
              <p className="form-subtitle">
                Already have an account?{" "}
                <Link to="/login" className="link">Sign in</Link>
              </p>
            </div>

            <div className="form-card">
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
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
                  <label htmlFor="name">First Name</label>
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
                  <label htmlFor="surname">Last Name</label>
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
                  <label htmlFor="email">Email address</label>
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
                  <label htmlFor="password">Password</label>
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
                  <label htmlFor="confirmPassword">Confirm Password</label>
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
                {loading && <p>Loading...</p>}

                <button type="submit" className="btn-submit" disabled={loading}>
                  Create Account
                </button>
              </form>

              <div className="divider">
                <span>Or continue with</span>
              </div>

              <div className="socials">
                <a href="#" className="social google">Google</a>
                <a href="#" className="social facebook">Facebook</a>
              </div>
            </div>

            <p className="form-footer">
              By creating an account, you agree to our <br />
              <a href="#" className="link">Terms of Service</a> and{" "}
              <a href="#" className="link">Privacy Policy</a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
