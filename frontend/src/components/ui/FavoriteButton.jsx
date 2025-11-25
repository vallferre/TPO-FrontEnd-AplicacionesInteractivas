import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  selectFavorites,
  selectFavoritesLoading,
} from "../../redux/slices/FavoritesSelectors";

import { addFavorite, deleteFavorite } from "../../redux/slices/FavoritesSlice";

import { selectUserRole } from "../../redux/slices/AuthSelectors.js";

const FavoriteButton = ({ productId, productName }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const favorites = useSelector(selectFavorites);
  const loading = useSelector(selectFavoritesLoading);

  const [isFavorite, setIsFavorite] = useState(false);

  const role = useSelector(selectUserRole);
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    const id = Number(productId);
    setIsFavorite(favorites.includes(id));
  }, [favorites, productId]);

  const handleToggle = async () => {
    if (!token) {
      toast.info("Debes iniciar sesión para usar favoritos");
      return;
    }

    if (isAdmin) {
      toast.error("No puedes tener productos favoritos como 'Admin'");
      return;
    }

    const id = Number(productId);

    if (isFavorite) {
      const action = await dispatch(deleteFavorite({ token, productId: id }));

      if (deleteFavorite.fulfilled.match(action)) {
        toast.success(`"${productName}" eliminado de favoritos`);
      } else {
        toast.error(action.error?.message || "No se pudo eliminar de favoritos");
      }

    } else {
      const action = await dispatch(addFavorite({ token, productId: id }));

      if (addFavorite.fulfilled.match(action)) {
        toast.success(`"${productName}" agregado a favoritos`);
      } else {
        toast.error("No se puede agregar tu mismo producto a favoritos");
      }
    }
  };

  if (loading) return <span>Cargando...</span>;

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all"
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
    </button>
  );
};

export default FavoriteButton;
