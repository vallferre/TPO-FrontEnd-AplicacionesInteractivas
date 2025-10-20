import React, { useState } from "react";
import "../assets/AllProducts.css";
import SingleProduct from "./SingleProduct.jsx";
import ProductsNavbar from "../components/ProductsNavbar.jsx";
import ErrorView from "../components/ErrorView.jsx";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Flag para saber si ya se intentó una búsqueda/filtrado.
  // Evita mostrar ErrorView antes de la primera interacción del usuario.
  const [hasQueried, setHasQueried] = useState(false);

  return (
    <div className="explore-page">
      <title>Explore Products</title>

      {/* IMPORTANTE: el Navbar se renderiza siempre para que pueda disparar búsquedas */}
      <ProductsNavbar
        setProducts={setProducts}
        setLoading={setLoading}
        setError={setError}
        setHasQueried={setHasQueried} // <-- pasar el setter para que el navbar indique "ya busqué"
      />

      <main className="container">
        <h1 className="title">Explore Products</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <div className="error-message"><p className="error">{error}</p></div>}

        <div className="grid">
          {/* Si hay error lo mostramos con ErrorView.
              Si ya se hizo una búsqueda y no hay productos, también mostramos ErrorView.
              Si todavía NO hubo búsqueda (hasQueried=false) y products está vacío, mostramos nada
              (o un mensaje neutro), para no interrumpir la UX inicial. */}
          {error ? (
            <ErrorView />
          ) : !loading && hasQueried && products.length === 0 ? (
            <ErrorView />
          ) : (
            products.map((producto) => (
              <div key={producto.id}>
                <SingleProduct id={producto.id} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
