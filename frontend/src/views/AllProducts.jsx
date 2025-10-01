import React from "react";
import "../components/AllProducts.css";

const products = [
  {
    name: "Vintage Action Figure",
    price: "$50 - $100",
    rating: 4.8,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHtEKj0BfdX1sKVjXYGUfJFmqaYLPNkbsGVE7Ugy9ahC81vT2kJfg_V1blKrOn0fNr9WUIjMiLNLnjXeIK82LVmbsSEx3X1K0hV1Y-OTYtSgQkjzyiOsgTo_D4TmPtZO9gKk1eV1EQgjM_Vn4VFlZ27vj3J3qAR08g7Tq-_H94BlMciallsngvnbSOMHnnVlToxiIXIXIqyhRfLa5O3gGjWLVsst0PZOHngS2oi_F6oKTI_5C08HfTxy1LKdWk1wvN3fdXcsdnznU"
  },
  {
    name: "Limited Edition Sneakers",
    price: "$200 - $500",
    rating: 4.9,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJa__rZPq-xDqeCLfQNFxuSZr3A-5gJelY4J3dfyM-uQxkj-l7CDbKZOmPBDtif8nCQK0Ba71UqWyCMhiGLT1dfIunsf2KfZGdrT8QS19KL-hV5hYWO0Lee1kK61sYlVPlC9dTNluzT95ZEjoOfbYwRCPEKQE6HzEatMuHOtvLmazERUBqpukaxzDN6q_qk6ahGa5VE5_v7iZ_yK-AJRXVFMvHcRUbrkYN_UquP_Eh4YWRkWpV-5EeqTt8zFzQzJOKAvJCNDod8Eo"
  },
  // Agrega los demás productos aquí...
];

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo">ColecXion</a>
          <nav className="nav">
            <a href="#">Featured</a>
            <a href="#">Men</a>
            <a href="#">Women</a>
            <a href="#">Accessories</a>
            <a href="#" className="sale">Sale</a>
          </nav>
        </div>
      </header>

      <main className="main container">
        <div className="breadcrumb">
          <a href="#">Home</a> / <span>Collectibles</span>
        </div>

        <h1 className="title">Collectibles</h1>

        <div className="filters">
          <button>Category</button>
          <button>Price</button>
          <button>Condition</button>
          <button>Popularity</button>
          <button>More Filters</button>
        </div>

        <div className="products-grid">
          {products.map((p, idx) => (
            <div className="product" key={idx}>
              <div className="product-image">
                <img src={p.img} alt={p.name} />
              </div>
              <h3>{p.name}</h3>
              <p className="price">{p.price}</p>
              <p className="seller">Seller: {p.rating} ★</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="links">
            <a href="#">About</a>
            <a href="#">Support</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>
          <p>©2024 ColecXion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
