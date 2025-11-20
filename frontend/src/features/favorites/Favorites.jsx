import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
} from "../../redux/slices/FavoritesSelectors";

import { fetchFavorites, deleteFavorite } from "../../redux/slices/FavoritesSlice";
import {fetchProductsByIds} from "../../redux/slices/ProductSlice";

import SingleProduct from "../products/views/SingleProduct";
import ErrorView from "../../components/ui/ErrorView";

const Favorites = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const favoriteIds = useSelector(selectFavorites);
  const loading = useSelector(selectFavoritesLoading);
  const loaded = useSelector((state) => state.favorites.loaded)
  const error = useSelector(selectFavoritesError);
  const favoriteProducts = useSelector((state) => state.products.favoriteProducts);

  useEffect(() => {
    if (!token);
    if (loaded) return;
    dispatch(fetchFavorites(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) return;
    if (favoriteIds.length === 0) return;

    dispatch(fetchProductsByIds({ token, ids: favoriteIds }));
  }, [favoriteIds, token]);


  const handleRemoveFavorite = (productId) => {
    if (!token) return;
    dispatch(deleteFavorite({ token, productId }));
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!favoriteIds || favoriteIds.length === 0)
    return <ErrorView message="No tienes productos en favoritos aún." />;

  return (
    <div className="favorites-page">
      <main className="content">
        <h1 className="fade-in-title">Your Favorites</h1>
        <p className="fade-in-subtitle">Items you've saved for later.</p>

        <div className="grid">
          {favoriteProducts.map(product => (
            <SingleProduct key={product.id} product={product} />
          ))}
        </div>

      </main>
    </div>
  );
};

export default Favorites;
