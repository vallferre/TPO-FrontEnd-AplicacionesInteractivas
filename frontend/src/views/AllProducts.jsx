import React, { useState, useEffect } from "react";
import "../components/AllProducts.css";
import SingleProduct from "./SingleProduct.jsx"; // asumimos que PostCard está en este path

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const URL = "http://localhost:8080/products";

    // Configuramos options con form y token
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    useEffect(() => {
      fetch(URL, options)
        .then((response) => {
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setProducts(Array.isArray(data.content) ? data.content : []);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        })
        .finally(() => setLoading(false));
    }, []); // se ejecuta solo al montar

  return (
    <div className="explore-page">
      <title>Explore Products</title>
      <main className="container">
        <h1 className="title">Explore Products</h1>

        <div className="filters">
          {[
            { icon: "category", label: "Category" },
            { icon: "paid", label: "Price Range" },
            { icon: "percent", label: "Discount" },
            { icon: "star", label: "Star Rating" },
            { icon: "tune", label: "Advanced Filters" },
          ].map((f, i) => (
            <button key={i} className={`filter-btn ${i === 0 ? "active" : ""}`}>
              <span className="material-symbols-outlined">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {products.map((producto) => (
            <SingleProduct
              key={producto.id}
              id={producto.id}
              name={producto.name}
              image={producto.imageIds?.[0] || null} // si tiene imágenes
              price={producto.price}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
