import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function CategoryCard({ category, index, onClick }) {
  const [imageUrl, setImageUrl] = useState(
    `https://via.placeholder.com/300x200?text=${encodeURIComponent(category.description)}`
  );

  useEffect(() => {
    if (!category.fileImageId) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories/${category.id}/image`, {
          // Si tu endpoint requiere auth, agregá headers:
          // headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error cargando imagen");

        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
        // Mantiene el placeholder si falla
      }
    };

    fetchImage();

    // Limpiar URL al desmontar
    return () => {
      if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [category.fileImageId]);

  return (
    <div
      className="card category-card fade-down"
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={() => onClick(category.id)}
    >
      <img
        src={imageUrl}
        alt={category.description}
        style={{ objectFit: "cover", width: "100%", height: "200px" }}
      />
      <p
        className="fade-text"
        style={{ animationDelay: `${index * 0.2 + 0.2}s` }}
      >
        {category.description}
      </p>
    </div>
  );
}
