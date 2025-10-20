import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../assets/ProductsNavbar.css";

const ProductsNavbar = ({ setProducts, setLoading, setError }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.getAll("category") || []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [discount, setDiscount] = useState(searchParams.get("discount") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  const hasActiveFilters =
    searchTerm || selectedCategories.length > 0 || minPrice || maxPrice || discount || rating;

  // Traer categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories");
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setCategories(data.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Función para traer y filtrar productos
  const fetchAndFilterProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:8080/products", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      let list = Array.isArray(data.content) ? data.content : data;

      // Filtrado por frontend
      if (filters.searchTerm)
        list = list.filter((p) =>
          p.name.toLowerCase().includes(filters.searchTerm.trim().toLowerCase())
        );

      if (filters.selectedCategories?.length > 0)
        list = list.filter((p) =>
          p.categories.some((cat) => filters.selectedCategories.includes(cat))
        );

      if (filters.minPrice) list = list.filter((p) => p.finalPrice >= parseFloat(filters.minPrice));
      if (filters.maxPrice) list = list.filter((p) => p.finalPrice <= parseFloat(filters.maxPrice));
      if (filters.discount)
        list = list.filter(
          (p) => (p.discountPercentage || 0) >= parseFloat(filters.discount)
        );
      if (filters.rating)
        list = list.filter((p) => (p.rating || 0) >= parseInt(filters.rating));

      setProducts(list);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Traer productos al montar la barra, respetando searchParams
  useEffect(() => {
    fetchAndFilterProducts({
      searchTerm,
      selectedCategories,
      minPrice,
      maxPrice,
      discount,
      rating,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplicar filtros
  const applyFilters = () => {
    const params = {};
    if (searchTerm.trim()) params.keyword = searchTerm.trim();
    if (selectedCategories.length > 0) params.category = selectedCategories;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (discount) params.discount = discount;
    if (rating) params.rating = rating;

    setSearchParams(params);
    navigate(`/products?${new URLSearchParams(params).toString()}`);

    fetchAndFilterProducts({
      searchTerm,
      selectedCategories,
      minPrice,
      maxPrice,
      discount,
      rating,
    });
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setDiscount("");
    setRating("");
    setSearchParams({});
    navigate("/products");

    fetchAndFilterProducts({}); // Mostrar todos los productos
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

        <div className="filter-group">
          <h3>Categorías</h3>
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

        <div className="filter-group">
          <h3>Descuento</h3>
          <select value={discount} onChange={(e) => setDiscount(e.target.value)}>
            <option value="">Cualquiera</option>
            <option value="10">10%+</option>
            <option value="20">20%+</option>
            <option value="50">50%+</option>
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
