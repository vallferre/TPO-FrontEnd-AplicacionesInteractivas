import React, { useState, useEffect } from "react";
import "./AllProducts.css";
import SingleProduct from "./SingleProduct.jsx";
import ProductsNavbar from "../../../components/layout/ProductsNavbar.jsx";
import ErrorView from "../../../components/ui/ErrorView.jsx";

import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../../redux/slices/FavoritesSlice";

const AllProducts = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const favoritesLoaded = useSelector((state) => state.favorites.loaded);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Flag para saber si ya se hizo una búsqueda/filtrado
  const [hasQueried, setHasQueried] = useState(false);

  // ---------------------------------------------------------
  // CARGAR FAVORITOS AL ENTRAR A /PRODUCTOS
  // ---------------------------------------------------------
  useEffect(() => {
    if (token && !favoritesLoaded) {
      dispatch(fetchFavorites(token));
    }
  }, [token, favoritesLoaded, dispatch]);
  // ---------------------------------------------------------

  return (
    <div className="explore-page">
      <title>Explorar productos</title>

      <ProductsNavbar
        setProducts={setProducts}
        setLoading={setLoading}
        setError={setError}
        setHasQueried={setHasQueried}
      />

      <main className="container">
        <h1 className="title">Explorar productos</h1>

        {loading && <p>Cargando productos...</p>}
        {error && (
          <div className="error-message">
            <p className="error">{error}</p>
          </div>
        )}

        <div className="grid">
          {error ? (
            <ErrorView message="¡Parece que no hay ningún producto con estas condiciones! Prueba más tarde." />
          ) : !loading && hasQueried && products.length === 0 ? (
            <ErrorView message="¡Parece que no hay ningún producto con estas condiciones! Prueba más tarde." />
          ) : (
            products.map((producto) => (
              <div key={producto.id}>
                <SingleProduct product={producto} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
