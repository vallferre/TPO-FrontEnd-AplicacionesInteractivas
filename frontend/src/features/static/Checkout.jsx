// src/features/static/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  });

  /* ========================= HELPERS ========================= */

  const formatCardNumber = (digits) =>
    digits
      .replace(/\s+/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      setCard((prev) => ({ ...prev, number: digitsOnly }));
      return;
    }

    if (name === "cvc") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, cvc: digitsOnly }));
      return;
    }

    if (name === "expiry") {
      let digits = value.replace(/\D/g, "").slice(0, 4);
      let formatted =
        digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
      setCard((prev) => ({ ...prev, expiry: formatted }));
      return;
    }

    if (name === "name") {
      const lettersOnly = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
      setCard((prev) => ({ ...prev, name: lettersOnly }));
      return;
    }

    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardFocus = (e) =>
    setCard((prev) => ({ ...prev, focus: e.target.name }));

  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    if (["fullName", "city", "province", "country"].includes(name)) {
      const lettersOnly = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
      setShipping((prev) => ({ ...prev, [name]: lettersOnly }));
      return;
    }

    if (name === "postalCode") {
      const digitsOnly = value.replace(/\D/g, "");
      setShipping((prev) => ({ ...prev, postalCode: digitsOnly }));
      return;
    }

    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const isNonEmpty = (str) => String(str || "").trim().length > 0;

  const isFormComplete =
    card.number.length === 16 &&
    card.expiry.length === 5 &&
    (card.cvc.length === 3 || card.cvc.length === 4) &&
    isNonEmpty(card.name) &&
    isNonEmpty(shipping.fullName) &&
    isNonEmpty(shipping.address) &&
    isNonEmpty(shipping.city) &&
    isNonEmpty(shipping.province) &&
    isNonEmpty(shipping.postalCode) &&
    isNonEmpty(shipping.country);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) return;
    alert("✔ Datos validados (demo)");
    navigate("/profile/orders");
  };

  /* ========================= UI ========================= */

  return (
    <div className="edit-page">
      <main className="edit-main">
        <div className="edit-container">
          <div className="edit-header">
            <h2>Pago y Envío</h2>
            <p>Ingresá los datos necesarios para completar la compra.</p>
          </div>

          {/* 🔹 FORMULARIO VERTICAL */}
          <form className="edit-form" onSubmit={handleSubmit}>
            {/* ================= Sección Tarjeta ================= */}
            <div
              style={{
                padding: "1.5rem",
                background: "#fafafa",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "2rem",
              }}
            >
              <h3>Datos de Pago</h3>

              <Cards
                number={card.number}
                expiry={card.expiry}
                cvc={card.cvc}
                name={card.name}
                focused={card.focus}
              />

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label>Nombre del titular *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Como figura en la tarjeta"
                  value={card.name}
                  onChange={handleCardChange}
                  onFocus={handleCardFocus}
                  required
                  pattern="[A-Za-zÀ-ÿ\s]+"
                />
              </div>

              <div className="form-group">
                <label>Número de tarjeta *</label>
                <input
                  type="text"
                  name="number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={formatCardNumber(card.number)}
                  onChange={handleCardChange}
                  onFocus={handleCardFocus}
                  required
                  maxLength={19}
                  inputMode="numeric"
                  pattern="^(\d{4}\s){3}\d{4}$"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vencimiento (MM/YY) *</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={handleCardChange}
                    onFocus={handleCardFocus}
                    required
                    maxLength={5}
                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                  />
                </div>

                <div className="form-group">
                  <label>CVC *</label>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="XXX"
                    value={card.cvc}
                    onChange={handleCardChange}
                    onFocus={handleCardFocus}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="\d{3,4}"
                  />
                </div>
              </div>
            </div>

            {/* ================= Sección Dirección ================= */}
            <div
              style={{
                padding: "1.5rem",
                background: "#fafafa",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "2rem",
              }}
            >
              <h3>Dirección de Envío</h3>

              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleShippingChange}
                  required
                  pattern="[A-Za-zÀ-ÿ\s]+"
                />
              </div>

              <div className="form-group">
                <label>Dirección *</label>
                <input
                  name="address"
                  placeholder="Calle y número"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Depto / Piso (opcional)</label>
                <input
                  name="address2"
                  value={shipping.address2}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="form-group">
                <label>Ciudad *</label>
                <input
                  name="city"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  required
                  pattern="[A-Za-zÀ-ÿ\s]+"
                />
              </div>

              <div className="form-group">
                <label>Provincia *</label>
                <input
                  name="province"
                  value={shipping.province}
                  onChange={handleShippingChange}
                  required
                  pattern="[A-Za-zÀ-ÿ\s]+"
                />
              </div>

              <div className="form-group">
                <label>Código Postal *</label>
                <input
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={handleShippingChange}
                  required
                  inputMode="numeric"
                  pattern="\d+"
                />
              </div>

              <div className="form-group">
                <label>País *</label>
                <input
                  name="country"
                  value={shipping.country}
                  onChange={handleShippingChange}
                  required
                  pattern="[A-Za-zÀ-ÿ\s]+"
                />
              </div>
            </div>

            {/* ================= SUBMIT ================= */}
            <div style={{ marginTop: "1rem" }}>
              <button
                type="submit"
                className="btn save"
                disabled={!isFormComplete}
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
