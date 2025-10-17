import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../components/LandingPage.css";
import CategoryCard from "../components/CategoryCard";

const API_BASE = "http://localhost:8080";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) return <p className="loading-text">Cargando categorías...</p>;
  if (error) return <p className="error-text">{error}</p>;

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

      {/* Categorías Destacadas */}
      <section className="featured-section fade-up">
        <h2 className="section-title">Colecciones Destacadas</h2>
        <div className="grid grid-4">
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={index}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
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
