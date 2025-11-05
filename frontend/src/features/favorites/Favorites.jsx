import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
} from "../../redux/slices/FavoritesSelectors";
import { fetchFavorites } from "../../redux/thunks/FavoritesThunk";
import { removeFavorite } from "../../redux/slices/FavoritesSlice";
import SingleProduct from "../products/views/SingleProduct";
import ErrorView from "../../components/ui/ErrorView";
import "./Favorites.css";

const Favorites = () => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavorites);
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemoveFavorite = (productId) => {
    dispatch(removeFavorite(productId));
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!favoriteIds.length)
    return <ErrorView message="No tienes productos en favoritos aún." />;

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
              onRemoveFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
