import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/LandingPage.css";
import CategoryCard from "../components/CategoryCard";
import SingleProduct from "./SingleProduct";

const API_BASE = "http://localhost:8080";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorDiscounts, setErrorDiscounts] = useState(null);

  const carouselRef = useRef(null);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let scrollPos = 0;
    const speed = 0.5; // velocidad del scroll (px por frame)

    let animationFrame;

    const step = () => {
      scrollPos += speed;
      if (scrollPos >= container.scrollWidth / 2) {
        // reiniciar cuando pase la mitad (porque duplicamos items)
        scrollPos = 0;
      }
      container.scrollLeft = scrollPos;
      animationFrame = requestAnimationFrame(step);
    };

    step();

    return () => cancelAnimationFrame(animationFrame);
  }, [discountedProducts]);

  // Traer categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        const allCategories = (data.content || []).map((cat) => ({
          ...cat,
          imageId: cat.imageId || null,
        }));
        const shuffled = allCategories.sort(() => 0.5 - Math.random());
        setCategories(shuffled.slice(0, 4));
      } catch (err) {
        console.error(err);
        setErrorCategories("No se pudieron cargar las categorías.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Traer productos en descuento
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        let list = Array.isArray(data.content) ? data.content : data;

        // Filtrar productos con algún descuento y ordenar por mayor dto
        const discounted = list
          .filter((p) => (p.discountPercentage || 0) > 0)
          .sort((a, b) => b.discountPercentage - a.discountPercentage)
          .slice(0, 5); // Tomar máximo 5

        setDiscountedProducts(discounted);
      } catch (err) {
        console.error(err);
        setErrorDiscounts("No se pudieron cargar los productos en descuento.");
      } finally {
        setLoadingDiscounts(false);
      }
    };
    fetchDiscountedProducts();
  }, []);

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

        {loadingDiscounts ? (
          <p className="loading-text">Cargando productos...</p>
        ) : errorDiscounts ? (
          <p className="error-text">{errorDiscounts}</p>
        ) : discountedProducts.length > 0 ? (
          <div className="discount-carousel-infinite" ref={carouselRef}>
            {/* Duplicamos los productos para efecto infinito */}
            {[...discountedProducts, ...discountedProducts].map((prod, index) => (
              <div key={`${prod.id}-${index}`} className="discount-carousel-item">
                <SingleProduct id={prod.id} />
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos en descuento disponibles.</p>
        )}
      </section>



      {/* Categorías Destacadas */}
      <section className="featured-section fade-up">
        <h2 className="section-title">Colecciones Destacadas</h2>
        {loadingCategories ? (
          <p className="loading-text">Cargando categorías...</p>
        ) : errorCategories ? (
          <p className="error-text">{errorCategories}</p>
        ) : (
          <div className="grid grid-4">
            {categories.map((cat, index) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={index}
                onClick={() => handleCategoryClick(cat.description)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mini About */}
      <section className="about-preview fade-up">
        <h2>Sobre Relicaria</h2>
        <p>
          En <strong>Relicaria</strong> buscamos ofrecer productos que cuenten
          historias. Conocé más sobre nosotros en la página de{" "}
          <Link to="/about">About Us</Link>.
        </p>
      </section>
    </div>
  );
}
