const API_BASE = "http://localhost:8080";

export const getProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/id/${id}`);
  if (!res.ok) throw new Error("Error al cargar producto");
  return res.json();
};

export const getRelatedProducts = async (categories) => {
  if (!categories || categories.length === 0) return [];

  console.log("Categorías recibidas para productos relacionados:", categories);
  // Elegimos una categoría aleatoria
  const randomIndex = Math.floor(Math.random() * categories.length);
  const chosenCategory = categories[randomIndex];

  // Si es un objeto, usamos su descripción. Si es un string, la usamos directamente
  const categoryDescription =
    typeof chosenCategory === "string" ? chosenCategory : chosenCategory.description;

  // Buscamos la categoría por descripción
  const categoryRes = await fetch(`${API_BASE}/categories/by-description/${categoryDescription}`);
  if (!categoryRes.ok) throw new Error("Error al obtener categoría");
  const categoryData = await categoryRes.json();

  // Ahora pedimos los productos de esa categoría
  const res = await fetch(`${API_BASE}/products/by-category/${categoryData.id}`);
  if (!res.ok) throw new Error("Error al cargar productos relacionados");

  return res.json();
};


export const getProductRatings = async (productId) => {
  const res = await fetch(`${API_BASE}/ratings/by-product/${productId}`);
  if (!res.ok) throw new Error("Error al cargar calificaciones");
  return res.json();
};
