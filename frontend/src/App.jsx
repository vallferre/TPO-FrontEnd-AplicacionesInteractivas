// src/App.jsx
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Navigation from "./components/Navigation";
import Toaster from "./components/Toaster";

import LandingPage from "./views/LandingPage";
import AllProducts from "./views/AllProducts";
import Register from "./views/Register";
import Login from "./views/Login";
import UserProfile from "./views/UserProfile";
import Favorites from "./views/Favorites";
import Cart from "./views/ShoppingCart";
import CreateProduct from "./views/CreateProduct";
import EditProduct from "./views/EditProduct";
import Orders from "./views/Orders";
import AdminCreateCategory from "./views/AdminCreateCategory";
import UserLayout from "./components/UserLayout";
import UserProducts from "./views/UserProducts";
import EditProfile from "./views/EditProfile";
import ProductDetails from "./views/ProductDetails";
import Footer from "./components/Footer";
import OrderDetails from "./views/OrderDetails";
import AdminCategoriesProfile from "./views/AdminCategoriesProfile";

const App = () => {
  return (
    <div className="app-layout">
      <Navigation />
      {/* Toaster global para los popups */}
      <Toaster />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />

          {/* Layout de perfil con rutas anidadas */}
          <Route path="/profile" element={<UserLayout />}>
            <Route path="products" element={<UserProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="categories" element={<AdminCategoriesProfile />} />
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

          {/* Vieja ruta individual, opcional */}
          <Route path="/profile-old" element={<UserProfile />} />

          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/create" element={<CreateProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories/create" element={<AdminCreateCategory />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
