import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RateProduct.css";
//import "../assets/RateProduct.css";
import {toast} from "react-toastify";

const API_BASE = "http://localhost:8080";

const RateProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // ✅ productId desde la ruta
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      setError("No se especificó ningún producto para calificar.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/id/${productId}`);
        if (!res.ok) throw new Error(`Error al obtener producto: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!rating) {
      toast.error("Por favor seleccioná una calificación antes de confirmar.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/ratings/add/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: rating, comment }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al enviar la reseña.");
      }

      toast.success("¡Gracias por tu reseña!");
      navigate(-1);
    } catch (err) {
      console.error("Error al enviar reseña:", err);
      toast.warning("Error al enviar la reseña. Intenta nuevamente.");
    }
  };

  if (loading) return <div className="rate-loading">Cargando producto...</div>;
  if (error) return <div className="rate-error">{error}</div>;

  return (
    <div className="rate-page">
      <div className="rate-header">
        <h1>Calificar producto</h1>
        <p>Contanos qué te pareció tu compra.</p>
      </div>

      {product && (
        <div className="rate-card">
          <div className="rate-product-info">
            <div
              className="rate-product-image"
              style={{
                backgroundImage: `url(${API_BASE}/images/${
                  product.imageIds?.[0] || "placeholder.jpg"
                })`,
              }}
            ></div>
            <div className="rate-product-text">
              <p className="rate-product-name">{product.name}</p>
              <p className="rate-product-detail">{product.description}</p>
            </div>
          </div>

          <div className="rate-stars">
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                className={`material-symbols-outlined star-icon ${
                  val <= rating ? "filled" : ""
                }`}
                onClick={() => setRating(val)}
              >
                star
              </span>
            ))}
          </div>

          <div className="rate-textarea">
            <label htmlFor="review">Dejá un comentario (opcional)</label>
            <textarea
              id="review"
              placeholder="Contanos tu experiencia..."
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="rate-actions">
            <button
              className="rate-confirm"
              onClick={handleSubmit}
              style={{
                backgroundColor: "#facc15",
                color: "#1e293b",
                fontWeight: "bold",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Confirmar
            </button>

            <button
              className="rate-cancel"
              onClick={() => navigate(-1)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#e2e8f0",
                color: "#1e293b",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateProduct;
