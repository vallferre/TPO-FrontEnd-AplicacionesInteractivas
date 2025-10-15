import { useEffect, useState } from "react";
import "../components/Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
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
        const response = await fetch("http://localhost:8080/users/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: no se pudieron cargar los favoritos`);
        }

        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los favoritos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!favorites.length) return <p>You have no favorites yet.</p>;

  return (
    <div className="favorites-page">
      <main className="content">
        <h1 className="fade-in-title">Your Favorites</h1>
        <p className="fade-in-subtitle">Items you've saved for later.</p>
        <div className="grid">
          {favorites.map((p, i) => (
            <div className="card" key={p.id}>
              <div className="card-img fade-in-img" style={{ animationDelay: `${i * 0.1}s` }}>
                <img
                  src={p.img || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={p.name}
                />
                <div className="fav-btn-wrapper">
                  <button className="fav-btn">♡</button>
                </div>
              </div>
              <div className="card-info">
                <h3 className="fade-in-card">{p.name}</h3>
                <p className="fade-in-card">${p.finalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;