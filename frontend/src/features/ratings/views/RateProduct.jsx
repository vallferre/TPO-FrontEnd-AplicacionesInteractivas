import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../redux/slices/ProductSlice";
import { addOrUpdateRating, fetchRatingsByProduct } from "../../../redux/slices/RatingSlice";


import { selectToken, selectUser } from "../../../redux/slices/AuthSelectors";

const RateProduct = () => {
const { productId } = useParams();
const navigate = useNavigate();
const dispatch = useDispatch();

const token = useSelector(selectToken);
const user = useSelector(selectUser);

const product = useSelector((state) => state.products.product);
const loadingGlobal = useSelector((state) => state.products.loading);

const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");
const [loadingLocal, setLoadingLocal] = useState(true);


useEffect(() => {
if (!productId || !token) return;


Promise.all([
  dispatch(fetchProductById(productId)),
  dispatch(fetchRatingsByProduct({ productId, token })),
]).finally(() => setLoadingLocal(false));


}, [dispatch, productId, token]);


const handleSubmit = () => {
if (!rating) return toast.error("Seleccioná una calificación.");
if (!user?.id) return toast.error("Debés iniciar sesión.");
if (!product || product.deleted)
return toast.error("No se puede calificar un producto eliminado.");


dispatch(
  addOrUpdateRating({
    token,
    productId,
    value: rating,
    comment,
  })
)
  .unwrap()
  .then(() => {
    toast.success("¡Gracias por tu reseña!");
    navigate(-1);
  })
  .catch(() => {
    toast.error("Error al enviar la reseña.");
  });


};


if (loadingLocal || loadingGlobal) return <p>Cargando producto...</p>;
if (!product) return <p>No se encontró el producto.</p>;

return (
<div style={{ padding: "20px" }}> <h1>Calificar producto</h1>


  <p>
    <strong>{product.name}</strong>
  </p>
  <p>{product.description}</p>

  <div style={{ fontSize: "24px", margin: "10px 0" }}>
    {[1, 2, 3, 4, 5].map((val) => (
      <span
        key={val}
        onClick={() => setRating(val)}
        style={{
          cursor: "pointer",
          color: val <= rating ? "gold" : "gray",
          marginRight: "4px",
        }}
      >
        ★
      </span>
    ))}
  </div>

  <textarea
    placeholder="Dejá un comentario..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    style={{ width: "100%", height: "80px" }}
  />

  <br />
  <br />

  <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
    Confirmar
  </button>

  <button onClick={() => navigate(-1)}>Cancelar</button>
</div>


);
};

export default RateProduct;