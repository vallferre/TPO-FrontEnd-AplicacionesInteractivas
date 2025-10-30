// src/pages/CreateAccount.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/thunks/AuthThunk';
import { selectAuthLoading, selectAuthError, selectIsLoggedIn } from '../../../redux/slices/AuthSelectors';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function CreateAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', name: '', surname: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    const payload = { username: form.username, email: form.email, password: form.password, name: form.name, surname: form.surname };
    try {
      await dispatch(registerUser(payload)).unwrap();
      // redirect por efecto
    } catch (err) {
      setLocalError(err || 'Error al registrar');
    }
  };

  return (
    <div className="app bg-light dark:bg-dark font-display text-slate-800 dark:text-slate-200">
      <div className="flex flex-col min-h-screen">
        <main className="main">
          <div className="form-wrapper">
            <div>
              <h2 className="form-title">Crea una cuenta</h2>
              <p className="form-subtitle"> Ya tienes una cuenta? <Link to="/login" className="link">Inicia sesión</Link> </p>
            </div>
            <div className="form-card">
              <form className="form" onSubmit={handleSubmit}>
                {/* Inputs (username, name, surname, email, password, confirmPassword) */}
                <div className="form-group">
                  <label htmlFor="username">Nombre de usuario</label>
                  <input id="username" name="username" type="text" value={form.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">Apellido</label>
                  <input id="surname" name="surname" type="text" value={form.surname} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Dirección email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirma Contraseña</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
                </div>

                {(localError || error) && <p className="error">{localError || error}</p>}
                {loading && <p>Cargando...</p>}
                <button type="submit" className="btn-submit" disabled={loading}>Crear cuenta</button>
              </form>
            </div>
            <p className="form-footer"> Creando tu cuenta, das consentimiento a nuestros <br />
              <a href="#" className="link">Términos de servicio</a> y <a href="#" className="link">Políticas de privacidad</a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
