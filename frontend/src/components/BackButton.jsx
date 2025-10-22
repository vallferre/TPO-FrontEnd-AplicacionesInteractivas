// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleBack}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#555";
        e.target.style.transform = "translateX(-2px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#333";
        e.target.style.transform = "translateX(0)";
      }}
    >
      ← Volver
    </button>
  );
};

export default BackButton;