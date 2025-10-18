import { useEffect, useState } from "react";
import SingleProduct from "../views/SingleProduct";
import "../assets/Favorites.css";

const API_BASE = "http://localhost:8080";

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/users/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok)
          throw new Error(`Error ${response.status}: no se pudieron cargar los favoritos`);

        const data = await response.json();
        // ✅ extraer productId de cada objeto
        setFavoriteIds(data.map(fav => fav.productId));
      } catch (err) {
        console.error(err);
        setError("Error al cargar los favoritos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ✅ Función para eliminar un producto de la lista local de favoritos
  const handleRemoveFavorite = (productId) => {
    setFavoriteIds(prev => prev.filter(id => id !== productId));
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!favoriteIds.length) return <p>You have no favorites yet.</p>;

  return (
    <div className="favorites-page">
      <main className="content">
        <h1 className="fade-in-title">Your Favorites</h1>
        <p className="fade-in-subtitle">Items you've saved for later.</p>

        <div className="grid">
          {favoriteIds.map((productId) => (
            <SingleProduct
              key={productId}
              id={productId}
              onRemoveFavorite={handleRemoveFavorite} // <-- pasar callback
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
