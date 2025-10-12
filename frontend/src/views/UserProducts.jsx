import React, { useState, useEffect } from "react";
import "../components/UserProducts.css";
import { useNavigate } from "react-router-dom";

const UserProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken"); // token JWT

  useEffect(() => {
    if (!token) {
      setError("No hay token, inicia sesión");
      setLoading(false);
      return;
    }

    const URL = "http://localhost:8080/products/filter-by-username";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };

    fetch(URL, options)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((p) => ({
          name: p.name,
          img: p.imageIds?.[0] || "",
          status: p.status || "Active",
          statusClass:
            p.status === "Active"
              ? "status-active"
              : p.status === "Pending"
              ? "status-pending"
              : "status-sold",
        }));
        setProducts(formatted);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleCreate = () => navigate("/create");
  const handleEdit = (productName) =>
    navigate("/edit", { state: { productName } });

  return (
    <div className="user-products-container">
      <div className="user-products-header">
        <h1>My Products</h1>
        <button className="create-btn" onClick={handleCreate}>
          <span className="material-symbols-outlined">add</span>
          Create Product
        </button>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx}>
                <td>
                  <div className="product-info">
                    <div className="product-img-wrapper">
                      <img src={product.img} alt={product.name} />
                    </div>
                    <span className="product-name">{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${product.statusClass}`}>
                    {product.status}
                  </span>
                </td>
                <td className="text-center actions-cell">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product.name)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button className="delete-btn">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProducts;