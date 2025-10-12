import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../components/AllProducts.css";
import SingleProduct from "./SingleProduct.jsx";
import ProductsNavbar from "../components/ProductsNavbar.jsx";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // 🔹 Leemos todos los filtros de la query string
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const priceRange = searchParams.get("price") || "";
  const discount = searchParams.get("discount") || "";
  const rating = searchParams.get("rating") || "";

  const BASE_URL = "http://localhost:8080/products";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = BASE_URL;

        // 🔹 Elegimos endpoint según filtros
        if (keyword) {
          endpoint += `/search?keyword=${encodeURIComponent(keyword)}`;
        } else if (category) {
          endpoint += `/by-category/${category}`;
        }

        // ⚠️ Nota: los filtros de price, discount y rating actualmente
        // no tienen endpoint en backend, se podrían filtrar frontend después
        const response = await fetch(endpoint, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        const list = Array.isArray(data.content) ? data.content : data;

        // 🔹 Filtrado adicional en frontend si existieran
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
