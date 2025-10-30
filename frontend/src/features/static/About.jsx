import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">About Us</h1>

        <p>
          Bienvenido a <strong>Relicaria</strong>, tu lugar para descubrir y disfrutar de productos únicos y especiales.
        </p>

        <h2>Misión</h2>
        <p>
          Nuestra misión es ofrecer experiencias auténticas y memorables a nuestros clientes, combinando calidad, creatividad y compromiso.
        </p>

        <h2>Visión</h2>
        <p>
          Aspiramos a ser la plataforma de referencia para quienes buscan productos que cuenten historias y conecten con sus emociones.
        </p>

        <h2>Valores</h2>
        <p>
          Innovación, transparencia y pasión por lo que hacemos. <strong>Relicaria</strong> valora a cada cliente y se esfuerza por brindar siempre lo mejor.
        </p>

        <p className="about-footer">
          Gracias por ser parte de <strong>Relicaria</strong>!
        </p>
      </div>
    </div>
  );
}
