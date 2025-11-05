// src/services/favoritesService.js
const API_BASE = "http://localhost:8080";

export const getFavorites = async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("No se encontró token de autenticación");

  const response = await fetch(`${API_BASE}/users/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok)
    throw new Error(`Error ${response.status}: no se pudieron cargar los favoritos`);

  const data = await response.json();

  if (Array.isArray(data.favoriteProductIds)) {
    return data.favoriteProductIds;
  } else if (Array.isArray(data)) {
    return data.flatMap((fav) => fav.favoriteProductIds || []);
  } else {
    throw new Error("Formato de respuesta inesperado del servidor");
  }
};
