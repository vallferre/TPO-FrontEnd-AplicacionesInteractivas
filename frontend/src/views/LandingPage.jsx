import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        const allCategories = (data.content || []).map(cat => ({
          ...cat,
          // construimos la URL de la imagen si existe
          imageId: cat.imageId || null
        }));

        // Mezclar aleatoriamente y tomar 4
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

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <main className="main container">
        <section className="section">
          <h2 className="fade-down" style={{ animationDelay: "0s" }}>
            Featured Collections
          </h2>
          <div className="grid grid-4">
            {categories.map((cat, index) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={index}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
