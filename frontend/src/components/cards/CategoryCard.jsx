// src/components/CategoryCard.jsx (o donde lo tengas)
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryImage} from "../../redux/slices/CategoryImagesSlice";
import {selectCategoryImageById} from "../../redux/slices/CategoryImagesSelector"


export default function CategoryCard({ category, index, onClick }) {
  const dispatch = useDispatch();

  const reduxImageUrl = useSelector((state) =>
    selectCategoryImageById(state, category.id)
  );

  const placeholder = `https://via.placeholder.com/300x200?text=${encodeURIComponent(
    category.description
  )}`;

  const imageUrl = reduxImageUrl || placeholder;

  useEffect(() => {
    if (!category.fileImageId) return;
    dispatch(fetchCategoryImage(category.id));
  }, [dispatch, category.id, category.fileImageId]);

  return (
    <div
      className="card category-card fade-down"
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={() => onClick(category.id)}
    >
      <img
        src={imageUrl}
        alt={category.description}
        style={{ objectFit: "cover", width: "100%", height: "200px" }}
      />
      <p
        className="fade-text"
        style={{ animationDelay: `${index * 0.2 + 0.2}s` }}
      >
        {category.description}
      </p>
    </div>
  );
}
