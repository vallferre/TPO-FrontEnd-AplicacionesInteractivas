import React from "react";
import { useDispatch } from "react-redux";
import { addOrUpdateRating } from "../../redux/slices/RatingSlice"; // 🔹 importá tu thunk
import "./RatingCard.css";

const RatingCard = ({ productId, userId, userName, value, comment }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.ratings);

  const handleClick = (newValue) => {
    // 🔹 Llamamos al backend cuando se hace clic en una estrella
    dispatch(
      addOrUpdateRating({
        productId,
        userId,
        value: newValue,
        comment, // dejamos el mismo comentario
      })
    );
  };

  return (
    <>
    {status == "loading" && <p>Guardando...</p>}
    {status == "failed" && <p>Error: {error}</p>}
    <div className="rating-card">
      <div className="rating-card-header">
        <span className="rating-card-user">{userName}</span>
        <span className="rating-card-stars">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`star ${i < value ? "filled" : ""}`}
              onClick={() => handleClick(i + 1)} // 🔹 ahora las estrellas envían el rating
            >
              ★
            </span>
          ))}
        </span>
      </div>
      <p className="rating-card-comment">{comment}</p>
    </div>
    </>
  );
};

export default RatingCard;
