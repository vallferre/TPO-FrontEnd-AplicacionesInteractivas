import React, { useState, useEffect } from "react";
import "../components/LandingPage.css";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        const allCategories = data.content || [];

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

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <main className="main container">
        <section className="section">
          <h2>Featured Collections</h2>
          <div className="grid grid-4">
            {categories.map((cat) => (
              <a href={`#`} key={cat.id} className="card">
                {/* Placeholder de imagen, podés reemplazarlo luego por algo dinámico */}
                <img
                  src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(cat.description)}`}
                  alt={cat.description}
                />
                <p>{cat.description}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}