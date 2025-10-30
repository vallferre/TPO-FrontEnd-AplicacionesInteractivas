// src/features/auth/authService.js
const API_BASE = 'http://localhost:8080';

export const apiLogin = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Status ${res.status}`);
  }
  return res.json(); // { access_token: '...' }
};

export const apiRegister = async (payload) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Status ${res.status}`);
  }
  return res.json();
};

export const apiFetchCurrentUser = async (token) => {
  const res = await fetch(`${API_BASE}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Status ${res.status}`);
  }
  return res.json();
};

export const apiSendWelcomeNotification = async (token) => {
  try {
    await fetch(`${API_BASE}/api/notifications/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    // no bloquear el registro si falla la notificación
    console.error('welcome notification failed', err);
  }
};
