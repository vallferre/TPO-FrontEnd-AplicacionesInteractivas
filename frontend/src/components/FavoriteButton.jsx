import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "../assets/FavoriteButton.css";

const API_URL = "http://localhost:8080/users/favorites";

const FavoriteButton = ({ productId, productName, token, onRemoveFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si el producto ya es favorito al montar
  useEffect(() => {
    const checkFavorite = async () => {
      if (!token) return setLoading(false);

      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error checking favorites: ${res.status}`);
        const data = await res.json();

        const favIds = Array.isArray(data.favoriteProductIds)
          ? data.favoriteProductIds.map(id => Number(id))
          : Array.isArray(data)
            ? data.flatMap(f => f.favoriteProductIds.map(id => Number(id)))
            : [];

        setIsFavorite(favIds.includes(Number(productId)));
      } catch (err) {
        console.error(err);
        toast.error("Error al obtener favoritos");
      } finally {
        setLoading(false);
      }
    };

    checkFavorite();
  }, [productId, token]);


  // Alternar favorito
 const handleFavoriteToggle = async () => {
    if (!token) {
      toast.info("Debes iniciar sesión para usar favoritos");
      return;
    }

    try {
      let res, data;
      if (isFavorite) {
        // DELETE para remover
        res = await fetch(API_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) {
          data = await res.json().catch(() => ({}));
          const msg = data.message || `Error removing favorite: ${res.status}`;
          throw new Error(msg);
        }

        setIsFavorite(false);
        toast.success(`"${productName}" eliminado de favoritos`);

        // ✅ Llamar a la función de callback para actualizar la lista en Favorites.jsx
        if (onRemoveFavorite) onRemoveFavorite(productId);

      } else {
        // POST para agregar
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) {
          data = await res.json().catch(() => ({}));
          const msg = data.message || `Error adding favorite: ${res.status}`;
          throw new Error(msg);
        }

        data = await res.json();
        const favIds = Array.isArray(data.favoriteProductIds) ? data.favoriteProductIds.map(id => Number(id)) : [];
        setIsFavorite(favIds.includes(Number(productId)));
        toast.success(`"${productName}" agregado a favoritos`);
      }
    } catch (err) {
      console.error(err.message);
      toast.error(err.message || "Error al actualizar favoritos");
    }
  };


  if (loading) return <span>Cargando...</span>;

  return (
    <button
      onClick={handleFavoriteToggle}
      className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all"
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
    </button>
  );
};

export default FavoriteButton;