import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorView.css";
import errorImage from "../../assets/emptyChest-Without-Background.png"; // ✅ Importa la imagen correctamente


const ErrorView = ({message}) => {
  const navigate = useNavigate();

  return (
    <div className="error-view">
      <img src={errorImage} alt="Error" className="error-image" />
      <h2>¡Nada por acá!</h2>
      <p>{message}</p>
      <button onClick={() => navigate("/")} className="error-button">
        Volver al inicio
      </button>
    </div>
  );
};

export default ErrorView;
