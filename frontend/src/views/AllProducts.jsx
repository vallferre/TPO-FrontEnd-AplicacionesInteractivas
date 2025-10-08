import React from "react";
import "../components/AllProducts.css";

const ExploreProducts = () => {
  const [products, setProducts] = useState([]);
  const URL = "http://localhost:3000/api/products"

  useEffect(() => {fetch(URL)
        .then((response) => response.json())
        .then((data) => setPosts(data))
        .catch((error) => {throw Error(error)})
    }, [])

  return (
    <div className="explore-page">
      <title>Explore Products</title>
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
          {
            productos.map((producto) => (
                        <PostCard 
                        id={producto.id}
                        name={producto.name}
                        key = {producto.id}
                        />
                    ))
          }
        </div>
      </main>
    </div>
  );
};

export default ExploreProducts;