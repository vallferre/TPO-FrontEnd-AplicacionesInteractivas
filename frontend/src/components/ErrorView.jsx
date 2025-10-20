import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/ErrorView.css";
import errorImage from "../assets/emptyChest-Without-Background.png"; // ✅ Importa la imagen correctamente

const ErrorView = () => {
  const navigate = useNavigate();

  return (
    <div className="error-view">
      <img src={errorImage} alt="Error" className="error-image" />
      <h2>¡Ups! Algo salió mal</h2>
      <p>Ocurrió un error inesperado. Intenta nuevamente más tarde.</p>
      <button onClick={() => navigate("/")} className="error-button">
        Volver al inicio
      </button>
    </div>
  );
};

export default ErrorView;
