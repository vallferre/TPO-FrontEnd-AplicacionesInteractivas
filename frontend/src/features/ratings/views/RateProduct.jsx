import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RateProduct.css";
import { toast } from "react-toastify";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateRating,
  fetchRatingsByProduct,
} from "../../../redux/slices/RatingSlice";

const API_BASE = "http://localhost:8080";

const RateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();

  // Estado global autenticación
  const { token, user } = useSelector((state) => state.auth);

  // 🟣 OBTENER ORDEN ACTUAL DESDE REDUX
  const currentOrder = useSelector((state) => state.orders.currentOrder);

  const isSameProduct =
    String(currentOrder.snapshotProductId) === String(productId);

  // Estado local
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar producto + ratings
  useEffect(() => {
    if (!productId) {
      setError("No se especificó ningún producto para calificar.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {

        // SI EL PRODUCTO COINCIDE CON LA ORDEN → CARGAR RATINGS
        if (isSameProduct) {
          dispatch(fetchRatingsByProduct(productId));
        }
      
    };

    fetchProduct();
  }, [isSameProduct, productId, dispatch]);

  // ⭐ Enviar rating usando Redux Thunk
  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Por favor seleccioná una calificación antes de confirmar.");
      return;
    }

    if (!user?.id) {
      toast.error("Debés iniciar sesión para calificar.");
      return;
    }

    try {
      const resultAction = await dispatch(
        addOrUpdateRating({
          productId,
          userId: user.id,
          value: rating,
          comment,
        })
      );

      if (addOrUpdateRating.fulfilled.match(resultAction)) {
        toast.success("¡Gracias por tu reseña!");
        navigate(-1);
      } else {
        throw new Error(resultAction.error?.message || "Error al enviar reseña");
      }
    } catch (err) {
      console.error("Error al enviar reseña:", err);
      toast.error("Error al enviar la reseña. Intenta nuevamente.");
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

          {/* Estrellas */}
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

          {/* Comentario */}
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

          {/* Botones */}
          <div className="rate-actions">
            <button className="rate-confirm" onClick={handleSubmit}>
              Confirmar
            </button>

            <button className="rate-cancel" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateProduct;
