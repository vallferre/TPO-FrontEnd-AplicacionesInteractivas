import React from "react";
import "../assets/Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contáctanos</h1>

        <p className="contact-intro">
          Podés comunicarte con <strong>Relicaria</strong> a través de los siguientes medios:
        </p>

        <div className="contact-info">
          <p><strong>Teléfono:</strong> +54 9 11 1234 5678</p>
          <p><strong>Email:</strong> contacto@relicaria.com</p>
          <p><strong>Dirección:</strong> Calle Ficticia 123, Ciudad, País</p>
          <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 a 18:00</p>
        </div>

        <p className="contact-footer">
          Gracias por confiar en <strong>Relicaria</strong>!
        </p>
      </div>
    </div>
  );
}
