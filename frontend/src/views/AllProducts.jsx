import React from "react";
import "../components/AllProducts.css";

const ExploreProducts = () => {
  const products = [
    {
      name: "Modern Desk Lamp",
      price: "$49.99",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYIjA8eA7wWsnaTxnNkhMM60FmpZWijg9twQrRL5608_zqrxa7A315tSJyI4hye9xZYXN7Z8rZ08tO-d7LBhgsb4H7Gb4ZWMFH2ER4SiU1hNkLASfIt3sWOQwDf_6wfCnEAftm8g2heml5DBPJmOIYAQ2yttK4PKmc2eHFaMw4ZpYxOHe4MZJ2v28w7ce7-hlnoDPeydfz57nBbYnIpSqCtxOnfzQCyO_D7s0JDLcfw50AJDBKpgNEa6fQKObBQWxMVrFWbaICFyE",
    },
    {
      name: "Ergonomic Office Chair",
      price: "$199.99",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaB5VP4YQGudU3IVaONw1LmasHjoqsPg0N2goUAFuERLJEzyP5rEdVZI-k-sfbDuFeNiyRKEss9HsgP6tUwoek272VBvrqVouNuIINe22qA_FYHIP62nc5Wdikaz_pLpku9kUszBzoktfItajmq6Ixsjl4Bz4xIEzbCdgk7P65QyWRKfWHM2-qQpZwm453j60vFyCsm2Yg5W44V3MzwWpM5uDlqgMBxWve_ZZX3Poo2P_8_AiBpbrffY-uy5fONGDrmGO72-rUOXw_",
    },
    {
      name: "Wireless Noise-Canceling Headphones",
      price: "$149.99",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACQpSxCm5AKBAg3h2wKlD7-yC9BWj912b0q-6s5vXXMxhQyrmHPHPpTnUnEGHf-dzlhIbVUeMd33H1zuqz_a-y7wn6puojh3BZk4XKb_hAyJaWXMsH3BWEoRbjYTD8eNYWgGgbxymjmq2GJcRGl-WSlGjmQriEI7wlDAuaszlOd0X0Og2TSvGN-C-QTB5-s2VhJnJ61SFckjPbU8cdhPVPJamPBEXMSvamIj_BZOmw9SmP9jrSCEZZhoSz5Ydx36BGo8Uepz09JBSn",
    },
    // Puedes agregar más productos aquí...
  ];

  return (
    <div className="explore-page">
      <main className="container">
        <h1 className="title">Explore Products</h1>

        <div className="filters">
          {[
            { icon: "category", label: "Category" },
            { icon: "paid", label: "Price Range" },
            { icon: "percent", label: "Discount" },
            { icon: "star", label: "Star Rating" },
            { icon: "tune", label: "Advanced Filters" },
          ].map((f, i) => (
            <button key={i} className={`filter-btn ${i === 0 ? "active" : ""}`}>
              <span className="material-symbols-outlined">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid">
          {products.map((p, i) => (
            <div className="card" key={i}>
              <div className="card-img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="card-info">
                <h3>{p.name}</h3>
                <p>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ExploreProducts;