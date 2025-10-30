import React from "react";
import "./Terms.css";

export default function Terms() {
  return (
    <div className="terms-container">
      <h1 className="terms-title">Términos de Servicio</h1>

      <p>
        Bienvenido a <strong>Relicaria</strong>. Al usar nuestra aplicación, aceptas cumplir estos términos de servicio. 
        Por favor, léelos cuidadosamente antes de continuar.
      </p>

      <h2>1. Uso de la Aplicación</h2>
      <p>
        Podés usar <strong>Relicaria</strong> solo con fines legales y de acuerdo con estos términos. No está permitido usar la app para actividades fraudulentas o ilegales.
      </p>

      <h2>2. Privacidad y Datos</h2>
      <p>
        Respetamos tu privacidad. Los datos que ingreses se utilizarán únicamente para mejorar la experiencia de usuario y no se compartirán con terceros sin tu consentimiento.
      </p>

      <h2>3. Responsabilidad</h2>
      <p>
        <strong>Relicaria</strong> se proporciona "tal cual". No nos hacemos responsables por pérdidas, daños o inconvenientes derivados del uso de la aplicación.
      </p>

      <h2>4. Cambios en los Términos</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Te recomendamos revisar esta página periódicamente para mantenerte informado.
      </p>

      <p className="terms-footer">
        Gracias por usar <strong>Relicaria</strong>!
      </p>
    </div>
  );
}
