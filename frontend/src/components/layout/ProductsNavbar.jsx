// src/components/layout/ProductsNavbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ProductsNavbar.css";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  searchProducts,
} from "../../redux/slices/ProductSlice";
import { fetchCategories } from "../../redux/slices/CategorySlice";

const ProductsNavbar = ({ setProducts, setLoading, setError, setHasQueried }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Categorías desde Redux
  const categories = useSelector((state) => state.categories?.items || []);

  // Filtros
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.getAll("category") || []
  );
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [discount, setDiscount] = useState(
    searchParams.get("discount") || ""
  );
  const [rating, setRating] = useState(
    searchParams.get("rating") || ""
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort") || ""
  );
  const [showCategories, setShowCategories] = useState(false);

  const hasActiveFilters =
    searchTerm ||
    selectedCategories.length > 0 ||
    minPrice ||
    maxPrice ||
    discount ||
    rating ||
    sortOrder;

  /* =====================================================
     TRAER CATEGORÍAS DESDE REDUX
  ====================================================== */
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     FETCH + FILTRADO
  ====================================================== */
  const fetchAndFilterProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      setHasQueried(true);

      let action;

      // Si hay searchTerm, voy al endpoint de búsqueda
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        action = await dispatch(
          searchProducts(filters.searchTerm.trim())
        );

        if (!searchProducts.fulfilled.match(action)) {
          const msg =
            action.error?.message ||
            "Error al buscar productos por nombre";
          throw new Error(msg);
        }
      } else {
        action = await dispatch(fetchProducts());

        if (!fetchProducts.fulfilled.match(action)) {
          const msg =
            action.error?.message || "Error al cargar productos";
          throw new Error(msg);
        }
      }

      // Normalizamos el resultado en una lista
      let list = Array.isArray(action.payload)
        ? action.payload
        : Array.isArray(action.payload?.content)
        ? action.payload.content
        : [];

      // === Filtrado extra en frontend (categorías, precio, etc.) ===
      if (filters.selectedCategories?.length > 0) {
        list = list.filter((p) =>
          p.categories?.some((cat) =>
            filters.selectedCategories.includes(cat)
          )
        );
      }

      if (filters.minPrice) {
        list = list.filter(
          (p) => p.finalPrice >= parseFloat(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        list = list.filter(
          (p) => p.finalPrice <= parseFloat(filters.maxPrice)
        );
      }

      if (filters.discount) {
        list = list.filter(
          (p) => (p.discountPercentage || 0) >= parseFloat(filters.discount)
        );
      }

      if (filters.rating) {
        list = list.filter(
          (p) => (p.rating || 0) >= parseInt(filters.rating)
        );
      }

      // Ordenar por precio
      if (filters.sortOrder === "asc") {
        list = [...list].sort((a, b) => a.finalPrice - b.finalPrice);
      } else if (filters.sortOrder === "desc") {
        list = [...list].sort((a, b) => b.finalPrice - a.finalPrice);
      }

      setProducts(list);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword") || "";

    setSearchTerm(keywordFromUrl);

    fetchAndFilterProducts({
      searchTerm: keywordFromUrl,
      selectedCategories,
      minPrice,
      maxPrice,
      discount,
      rating,
      sortOrder,
    });
  }, [searchParams]);

  /* =====================================================
     APLICAR FILTROS
  ====================================================== */
  const applyFilters = () => {
    setHasQueried(true);
    const params = {};
    if (searchTerm.trim()) params.keyword = searchTerm.trim();
    if (selectedCategories.length > 0) params.category = selectedCategories;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (discount) params.discount = discount;
    if (rating) params.rating = rating;
    if (sortOrder) params.sort = sortOrder;

    setSearchParams(params);
    navigate(`/products?${new URLSearchParams(params).toString()}`);

    fetchAndFilterProducts({
      searchTerm,
      selectedCategories,
      minPrice,
      maxPrice,
      discount,
      rating,
      sortOrder,
    });
  };

  /* =====================================================
     LIMPIAR FILTROS
  ====================================================== */
  const clearFilters = () => {
    setHasQueried(true);
    setSearchTerm("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setDiscount("");
    setRating("");
    setSortOrder("");
    setSearchParams({});
    navigate("/products");

    fetchAndFilterProducts({});
  };

  const toggleCategory = (catDescription) => {
    setSelectedCategories((prev) =>
      prev.includes(catDescription)
        ? prev.filter((c) => c !== catDescription)
        : [...prev, catDescription]
    );
  };

  return (
    <div className="product-navbar sidebar-fade-in">
      <div className="filters-section">
        <h2>Filtros</h2>

        {/* CATEGORÍAS */}
        <div className="filter-group">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Categorías</h3>
            <button
              className="toggle-categories-btn"
              onClick={() => setShowCategories(!showCategories)}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                minWidth: "auto",
              }}
            >
              {showCategories ? "▲" : "▼"}
            </button>
          </div>
          {showCategories && (
            <div className="categories-list">
              {categories.map((cat) => (
                <label key={cat.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.description)}
                    onChange={() => toggleCategory(cat.description)}
                  />
                  {cat.description}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* PRECIO */}
        <div className="filter-group">
          <h3>Precio</h3>
          <input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* DESCUENTO */}
        <div className="filter-group">
          <h3>Descuento</h3>
          <select
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          >
            <option value="">Cualquiera</option>
            <option value="10">10%+</option>
            <option value="20">20%+</option>
            <option value="50">50%+</option>
          </select>
        </div>

        {/* ORDEN */}
        <div className="filter-group">
          <h3>Ordenar por precio</h3>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Por defecto</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
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
