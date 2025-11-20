// src/features/static/Checkout.jsx
import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const Checkout = () => {
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

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardFocus = (e) => {
    setCard((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete =
    card.number &&
    card.expiry &&
    card.cvc &&
    card.name &&
    shipping.fullName &&
    shipping.address &&
    shipping.city &&
    shipping.province &&
    shipping.postalCode &&
    shipping.country;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) return;
    alert("✔ Datos de pago y envío completos (demo)");
  };

  return (
    <div className="edit-page">
      <main className="edit-main">
        <div className="edit-container">
          <div className="edit-header">
            <h2>Pago y Envío</h2>
            <p>Ingresá los datos necesarios para continuar la compra.</p>
          </div>

          <div className="edit-form payment-layout">

            {/* =================== SECCIÓN TARJETA =================== */}
            <div className="payment-card-column section-box">
              <h3>Datos de Pago</h3>
              <Cards
                number={card.number}
                expiry={card.expiry}
                cvc={card.cvc}
                name={card.name}
                focused={card.focus}
              />

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label htmlFor="cardName">Nombre del titular *</label>
                <input
                  id="cardName"
                  type="text"
                  name="name"
                  placeholder="Como figura en la tarjeta"
                  value={card.name}
                  onChange={handleCardChange}
                  onFocus={handleCardFocus}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Número de tarjeta *</label>
                <input
                  id="cardNumber"
                  type="text"
                  name="number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={card.number}
                  onChange={handleCardChange}
                  onFocus={handleCardFocus}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">Vencimiento (MM/YY) *</label>
                  <input
                    id="expiry"
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={handleCardChange}
                    onFocus={handleCardFocus}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvc">CVC *</label>
                  <input
                    id="cvc"
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    value={card.cvc}
                    onChange={handleCardChange}
                    onFocus={handleCardFocus}
                    required
                  />
                </div>
              </div>
            </div>

            {/* =================== SECCIÓN DIRECCIÓN =================== */}
            <form className="payment-shipping-column section-box" onSubmit={handleSubmit}>
              <h3>Dirección de Envío</h3>

              <div className="form-group">
                <label htmlFor="fullName">Nombre completo *</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección *</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Calle y número"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address2">Depto / Piso (opcional)</label>
                <input
                  id="address2"
                  type="text"
                  name="address2"
                  value={shipping.address2}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Ciudad *</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="province">Provincia *</label>
                  <input
                    id="province"
                    type="text"
                    name="province"
                    value={shipping.province}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Código Postal *</label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={shipping.postalCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">País *</label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={shipping.country}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: "1rem" }}>
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
        </div>
      </main>
    </div>
  );
};

export default Checkout;
