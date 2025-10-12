import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../components/AllProducts.css";
import SingleProduct from "./SingleProduct.jsx";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // 🔹 Leemos keyword de la query string
  const keyword = searchParams.get("keyword") || "";
  const BASE_URL = "http://localhost:8080/products";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = keyword
          ? `${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`
          : BASE_URL;

        const response = await fetch(endpoint, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        // data.content si el backend lo devuelve así, sino usamos data
        const list = Array.isArray(data.content) ? data.content : data;
        setProducts(list);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div className="explore-page">
      <title>Explore Products</title>
      <main className="container">
        <h1 className="title">Explore Products</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {products.length > 0 ? (
            products.map((producto) => (
              <SingleProduct
                key={producto.id}
                id={producto.id}
                name={producto.name}
                image={producto.imageIds?.[0] || null}
                price={producto.price}
              />
            ))
          ) : (
            !loading && <p>No se encontraron productos para "{keyword}".</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;