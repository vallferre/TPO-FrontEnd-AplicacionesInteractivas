const API_BASE = "http://localhost:8080";

export const getProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/id/${id}`);
  if (!res.ok) throw new Error("Error al cargar producto");
  return res.json();
};

export const getRelatedProducts = async (productId) => {
  const res = await fetch(`${API_BASE}/products/related/${productId}`);
  if (!res.ok) throw new Error("Error al cargar productos relacionados");
  return res.json();
};

export const getProductRatings = async (productId) => {
  const res = await fetch(`${API_BASE}/ratings/by-product/${productId}`);
  if (!res.ok) throw new Error("Error al cargar calificaciones");
  return res.json();
};
