import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../assets/ProductsNavbar.css";

const ProductsNavbar = ({ setProducts, setLoading, setError }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(searchParams.getAll("category") || []);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [discount, setDiscount] = useState(searchParams.get("discount") || "");
  const [shipping, setShipping] = useState({
    free: searchParams.get("freeShipping") === "true" || false,
    tomorrow: searchParams.get("arrivesTomorrow") === "true" || false,
  });
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  // ✅ Detectar si hay filtros activos
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    minPrice ||
    maxPrice ||
    discount ||
    shipping.free ||
    shipping.tomorrow ||
    rating;

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

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const applyFilters = async () => {
    const params = {};
    if (searchTerm.trim()) params.keyword = searchTerm.trim();
    if (selectedCategories.length > 0) params.category = selectedCategories;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (discount) params.discount = discount;
    if (rating) params.rating = rating;

    setSearchParams(params);
    navigate(`/products?${new URLSearchParams(params).toString()}`);

    let endpoint = "http://localhost:8080/products";
    if (params.keyword) endpoint += `/search?name=${encodeURIComponent(params.keyword)}`;
    else if (params.category) endpoint += `/by-category/${selectedCategories.join(",")}`;

    const extraParams = {};
    if (minPrice) extraParams.minPrice = minPrice;
    if (maxPrice) extraParams.maxPrice = maxPrice;
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
      const res = await fetch(endpoint, { headers: { "Content-Type": "application/json" } });
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

  // 🧹 Limpiar filtros
  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setDiscount("");
    setRating("");
    setSearchParams({});
    navigate("/products");
  };

  return (
    <div className="product-navbar sidebar-fade-in">
      <div className="filters-section">
        <h2>Filtros</h2>

        <div className="filter-group">
          <h3>Categorías</h3>
          {categories.map((cat) => (
            <label key={cat.id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              {cat.description}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h3>Precio</h3>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <h3>Descuento</h3>
          <select value={discount} onChange={(e) => setDiscount(e.target.value)}>
            <option value="">Cualquiera</option>
            <option value="10">10%+</option>
            <option value="20">20%+</option>
            <option value="50">50%+</option>
          </select>
        </div>

        <div className="filter-group">
          <h3>Calificación</h3>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Cualquiera</option>
            <option value="1">1 estrella+</option>
            <option value="2">2 estrellas+</option>
            <option value="3">3 estrellas+</option>
            <option value="4">4 estrellas+</option>
            <option value="5">5 estrellas</option>
          </select>
        </div>

        <button className="apply-filters-btn" onClick={applyFilters}>
          Aplicar filtros
        </button>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductsNavbar;