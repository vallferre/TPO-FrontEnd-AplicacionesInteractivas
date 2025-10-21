import React from "react";
import "../assets/RatingCard.css";

const RatingCard = ({ userName, value, comment }) => {
  return (
    <div className="rating-card">
      <div className="rating-card-header">
        <span className="rating-card-user">{userName}</span>
        <span className="rating-card-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < value ? "filled" : ""}`}>★</span>
          ))}
        </span>
      </div>
      <p className="rating-card-comment">{comment}</p>
    </div>
  );
};

export default RatingCard;
