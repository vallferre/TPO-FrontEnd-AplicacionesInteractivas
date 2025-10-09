import React from "react";
import "../components/SingleProduct.css";

const SingleProduct = ({ id, name, description, price, stock, categories, image }) => {
  return (
    <div className="product-card" key={id}>
      {image ? (
        <img src={image} alt={name} className="product-image" />
      ) : (
        <div className="product-image placeholder">No image</div>
      )}

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">${price.toLocaleString()}</p>
        <p className="product-stock">Stock: {stock}</p>
        <div className="product-categories">
          {(categories || []).map((cat, index) => (
            <span key={index} className="category-badge">{cat}</span>
          ))}
        </div>

        <button className="btn-add">Add to Cart</button>
      </div>
    </div>
  );
};

export default SingleProduct;
