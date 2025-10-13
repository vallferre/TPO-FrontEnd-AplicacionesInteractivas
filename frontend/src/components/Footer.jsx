import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} Relicaria — Todos los derechos reservados
        </p>

        <div className="footer-links">
          <a href="/about">Acerca de</a>
          <a href="/contact">Contacto</a>
          <a href="/terms">Términos</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
