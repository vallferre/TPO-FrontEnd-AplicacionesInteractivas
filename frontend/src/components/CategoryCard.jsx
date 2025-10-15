import React from "react";

export default function CategoryCard({ category, index, onClick }) {
  return (
    <div
      className="card category-card fade-down"
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={() => onClick(category.id)}
    >
      <img
        src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(category.description)}`}
        alt={category.description}
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
