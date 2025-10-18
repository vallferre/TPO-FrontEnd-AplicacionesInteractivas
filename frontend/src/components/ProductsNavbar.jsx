import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../assets/ProductsNavbar.css";

const ProductNavbar = ({ setProducts, setLoading, setError }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "");
  const [discount, setDiscount] = useState(searchParams.get("discount") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  // Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setCategories(data.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Función para aplicar filtros y hacer fetch
  const applyFilters = async () => {
    const params = {};
    if (searchTerm.trim()) params.keyword = searchTerm.trim();
    if (selectedCategory) params.category = selectedCategory;
    if (priceRange) params.price = priceRange;
    if (discount) params.discount = discount;
    if (rating) params.rating = rating;

    // Actualizar URL
    setSearchParams(params);
    navigate(`/products?${new URLSearchParams(params).toString()}`);

    // Construir endpoint
    let endpoint = "http://localhost:8080/products";

    if (params.keyword) {
      endpoint += `/search?name=${encodeURIComponent(params.keyword)}`;
    } else if (params.category) {
      endpoint += `/by-category/${params.category}`;
    } else {
      endpoint += "";
    }

    // Agregar filtros adicionales como query params
    const extraParams = {};
    if (priceRange) extraParams.price = priceRange;
    if (discount) extraParams.discount = discount;
    if (rating) extraParams.rating = rating;

    if (Object.keys(extraParams).length > 0) {
      endpoint += endpoint.includes("?")
        ? "&" + new URLSearchParams(extraParams).toString()
        : "?" + new URLSearchParams(extraParams).toString();
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoint, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setProducts(data.content || data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") applyFilters();
  };

  return (
    <>
        <div className="product-navbar sidebar-fade-in">
          <div className="filters-section">
            <h2>Filtros</h2>

            {/* Categorías */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.description}
                </option>
              ))}
            </select>

            {/* Precio */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Precio</option>
              <option value="0-50">0 - 50</option>
              <option value="51-100">51 - 100</option>
              <option value="101-200">101 - 200</option>
              <option value="200+">200+</option>
            </select>

            {/* Descuento */}
            <select
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            >
              <option value="">Descuento</option>
              <option value="10">10%+</option>
              <option value="20">20%+</option>
              <option value="50">50%+</option>
            </select>

            {/* Rating */}
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Rating</option>
              <option value="1">1 estrella+</option>
              <option value="2">2 estrellas+</option>
              <option value="3">3 estrellas+</option>
              <option value="4">4 estrellas+</option>
              <option value="5">5 estrellas</option>
            </select>

            <button className="apply-filters-btn" onClick={applyFilters}>
              Aplicar filtros
            </button>
          </div>
        </div>
    </>
  );
};

export default ProductNavbar;
