import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/users/favorites";

const FavoriteButton = ({ productId, token }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Verificar si el producto ya es favorito al montar
  useEffect(() => {
    const checkFavorite = async () => {
      if (!token) return setLoading(false);

      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error checking favorite: ${res.status}`);
        const favorites = await res.json(); // se espera un array de favoritos
        const exists = favorites.some(fav => fav.productId === productId);
        setIsFavorite(exists);
      } catch (err) {
        console.error(err);
        toast.error("Error al obtener favoritos");
      } finally {
        setLoading(false);
      }
    };

    checkFavorite();
  }, [productId, token]);

  // ✅ Alternar favorito
  const handleFavoriteToggle = async () => {
    if (!token) {
      toast.info("Debes iniciar sesión para usar favoritos");
      return;
    }

    try {
      if (isFavorite) {
        // DELETE para remover
        const res = await fetch(API_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) throw new Error(`Error removing favorite: ${res.status}`);
        setIsFavorite(false);
        toast.success("Producto eliminado de favoritos");
      } else {
        // POST para agregar
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) throw new Error(`Error adding favorite: ${res.status}`);

        // Backend devuelve favoriteProductIds
        const data = await res.json();
        const exists = data.favoriteProductIds.includes(productId);
        setIsFavorite(exists);
        toast.success("Producto agregado a favoritos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar favoritos");
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
