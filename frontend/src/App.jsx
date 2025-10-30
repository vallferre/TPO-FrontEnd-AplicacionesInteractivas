// src/App.jsx
import { Routes, Route } from "react-router-dom";

import "./App.css";

//import Navigation from "./components/Navigation";
import Toaster from "./components/ui/Toaster";
import Navigation from "./components/layout/Navigation";
//import LandingPage from "./views/LandingPage";
import LandingPage from "./features/home/LandingPage";
//import AllProducts from "./views/AllProducts";
import AllProducts from "./features/products/views/AllProducts";
import Register from "./features/auth/views/Register";
import Login from "./features/auth/views/Login";
import UserProfile from "./features/auth/views/UserProfile";
//import Favorites from "./views/Favorites";
import Favorites from "./features/favorites/Favorites";
import Cart from "./features/cart/views/ShoppingCart";
//import CreateProduct from "./views/CreateProduct";
import CreateProduct from "./features/products/views/CreateProduct";
//import EditProduct from "./views/EditProduct";
import EditProduct from "./features/products/views/EditProduct";
import Orders from "./features/orders/views/Orders";
//import AdminCreateCategory from "./views/AdminCreateCategory";
import AdminCreateCategory from "./features/admin/AdminCreateCategory";
import UserLayout from "./components/layout/UserLayout";
import UserProducts from "./features/auth/views/UserProducts";
//import EditProfile from "./views/EditProfile";
import EditProfile from "./features/auth/views/EditProfile";
//import ProductDetails from "./views/ProductDetails";
import ProductDetails from "./features/products/views/ProductDetails";
import Footer from "./components/layout/Footer";
import OrderDetails from "./features/orders/views/OrderDetails";
import AdminCategoriesProfile from "./features/admin/AdminCategoriesProfile";
//import EditCategory from "./components/EditCategory";
import EditCategory from "./features/admin/EditCategory";
import About from "./features/static/About";
import Contact from "./features/static/Contact";
import Terms from "./features/static/Terms";
import ErrorView from "./components/ui/ErrorView"
import RateProduct from "./features/ratings/views/RateProduct";

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
          <Route path="/rate-product/:productId" element={<RateProduct />} />

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
          <Route path="categories/edit/:id" element={<EditCategory />} />
          {/* rutas del footer */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/error" element={<ErrorView />}/>
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
