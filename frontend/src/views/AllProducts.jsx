import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../assets/AllProducts.css";
import SingleProduct from "./SingleProduct.jsx";
import ProductsNavbar from "../components/ProductsNavbar.jsx";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const priceRange = searchParams.get("price") || "";
  const discount = searchParams.get("discount") || "";
  const rating = searchParams.get("rating") || "";

  const BASE_URL = "http://localhost:8080/products";

  // Traer productos según filtros
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = BASE_URL;

        if (keyword) {
          endpoint += `/search?keyword=${encodeURIComponent(keyword)}`;
        } else if (category) {
          endpoint += `/by-category/${category}`;
        }

        const response = await fetch(endpoint, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        const list = Array.isArray(data.content) ? data.content : data;

        let filteredList = list;
        if (priceRange) {
          const [min, max] = priceRange.includes("+")
            ? [parseInt(priceRange), Infinity]
            : priceRange.split("-").map(Number);
          filteredList = filteredList.filter(
            (p) => p.price >= min && p.price <= max
          );
        }

        if (discount) {
          filteredList = filteredList.filter(
            (p) => (p.discount || 0) >= parseInt(discount)
          );
        }

        if (rating) {
          filteredList = filteredList.filter(
            (p) => (p.rating || 0) >= parseInt(rating)
          );
        }

        setProducts(filteredList);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, priceRange, discount, rating]);

  // Reiniciar animación al cambiar productos
  useEffect(() => {
    const cards = document.querySelectorAll(".product-card");
    cards.forEach((card, index) => {
      card.classList.remove("fade-in-up");
      void card.offsetWidth; // forzar reflow
      card.style.animationDelay = `${index * 0.15}s`;
      card.classList.add("fade-in-up");
    });
  }, [products]);

  return (
    <div className="explore-page">
      <title>Explore Products</title>
      <ProductsNavbar />
      <main className="container">
        <h1 className="title">Explore Products</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {products.length > 0 ? (
            products.map((producto, index) => (
              <div
                key={producto.id + "-" + keyword + "-" + category} // clave única para reiniciar animación
              >
                <SingleProduct
                  key={producto.id}
                  id={producto.id}
                />
              </div>
            ))
          ) : (
            !loading && (
              <p>
                No se encontraron productos para{" "}
                {keyword || "estos filtros seleccionados"}.
              </p>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
