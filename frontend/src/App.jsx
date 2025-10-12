import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Routes, Route } from "react-router-dom";
import './App.css';

import LandingPage from './views/LandingPage';
import AllProducts from './views/AllProducts';
import Register from './views/Register';
import Login from './views/Login';
import Navigation from './views/Navigation';
import UserProfile from './views/UserProfile'; // Solo si seguís usando esta vista independiente
import Favorites from './views/Favorites';
import Cart from './views/ShoppingCart';
import CreateProduct from './views/CreateProduct';
import EditProduct from './views/EditProduct';
import Orders from './views/Orders';
import AdminCreateCategory from './views/AdminCreateCategory';
import UserLayout from './views/UserLayout';
import UserProducts from './views/UserProducts';
import EditProfile from './views/EditProfile';
//import Settings from './views/Settings';

const App = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editProfile" element={<EditProfile />} />


        {/* Layout de perfil con rutas anidadas */}
        <Route path="/profile" element={<UserLayout />}>
          <Route path="products" element={<UserProducts />} />
          <Route path="orders" element={<Orders />} />
          {/*<Route path="settings" element={<Settings />} />*/}
        </Route>

        {/* Vieja ruta individual, opcional */}
        <Route path="/profile-old" element={<UserProfile />} />

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/edit" element={<EditProduct />} />
        <Route path="/categories" element={<AdminCreateCategory />} />
      </Routes>
    </>
  );
}

export default App;
