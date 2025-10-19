import React, { useState } from "react";
import "../assets/AllProducts.css";
import SingleProduct from "./SingleProduct.jsx";
import ProductsNavbar from "../components/ProductsNavbar.jsx";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="explore-page">
      <title>Explore Products</title>

      {/* Navbar maneja los filtros y actualiza products */}
      <ProductsNavbar
        setProducts={setProducts}
        setLoading={setLoading}
        setError={setError}
      />

      <main className="container">
        <h1 className="title">Explore Products</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {products.length > 0 ? (
            products.map((producto) => (
              <div key={producto.id}>
                <SingleProduct id={producto.id} />
              </div>
            ))
          ) : (
            !loading && <p>No se encontraron productos para estos filtros.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
