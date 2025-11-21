import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { fetchProducts } from "../../redux/slices/ProductSlice";
import { fetchCategories } from "../../redux/slices/CategorySlice";

import {
  selectProduct,
  selectLoading,
  selectError,
} from "../../redux/slices/ProductSelectors";

import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../redux/slices/CategorySelector";

import CategoryCard from "../../components/cards/CategoryCard";
import SingleProduct from "../products/views/SingleProduct";
import "./LandingPage.css";

export default function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const products = useSelector(selectProduct) || [];
  const productsLoading = useSelector(selectLoading);
  const productsError = useSelector(selectError);

  const categories = useSelector(selectCategories) || [];
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  // ===== Filtrar 5 productos con mayor descuento =====
  const discountedProducts = products
    .filter((p) => (p.discountPercentage || 0) > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 5);

  // ===== Generar items infinitos para carousel =====
  const infiniteItems = (() => {
    if (!discountedProducts || discountedProducts.length === 0) return [];
    const repeatCount = Math.ceil(10 / discountedProducts.length);
    return Array.from({ length: repeatCount }, () => discountedProducts).flat();
  })();

  // ===== Tomar 5 categorías random =====
  const featuredCategories = (() => {
    if (!categories || categories.length === 0) return [];
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  })();

  // ===== Fetch inicial =====
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ===== Scroll infinito =====
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || infiniteItems.length === 0) return;

    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      scrollPos += speed;
      if (scrollPos >= container.scrollWidth / 2) scrollPos = 0;
      container.scrollLeft = scrollPos;
      requestAnimationFrame(step);
    };

    step();
  }, [infiniteItems]);

  const handleCategoryClick = (categoryDescription) => {
    navigate(`/products?category=${encodeURIComponent(categoryDescription)}`);
  };

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero-section fade-down">
        <h1 className="hero-title">
          Bienvenido a <strong>Relicaria</strong>
        </h1>
        <p className="hero-subtitle">
          Descubrí productos únicos y experiencias inolvidables.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Productos en Descuento */}
      <section className="discount-section fade-up">
        <h2 className="section-title">Productos en Descuento</h2>
        {productsLoading ? (
          <p className="loading-text">Cargando productos...</p>
        ) : productsError ? (
          <p className="error-text">{productsError}</p>
        ) : discountedProducts.length > 0 ? (
          <div className="discount-carousel-wrapper">
            <div className="discount-carousel-infinite" ref={carouselRef}>
              {infiniteItems.map((prod, idx) => (
                <div key={`${prod.id}-${idx}`} className="discount-carousel-item">
                  <SingleProduct id={prod.id} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No hay productos en descuento disponibles.</p>
        )}
      </section>

      {/* Categorías Destacadas */}
      <section className="featured-section fade-up">
        <h2 className="section-title">Colecciones Destacadas</h2>
        {categoriesLoading ? (
          <p className="loading-text">Cargando categorías...</p>
        ) : categoriesError ? (
          <p className="error-text">{categoriesError}</p>
        ) : (
          <div className="grid grid-4">
            {featuredCategories.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={idx}
                onClick={() => handleCategoryClick(cat.description)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
