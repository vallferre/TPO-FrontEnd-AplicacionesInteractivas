import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './views/LandingPage';
import AllProducts from './views/AllProducts';
import Register from './views/Register';
import Login from './views/Login';
import Navigation from './views/Navigation';

const App = () =>{
  return(
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collectibles" element={<AllProducts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </>
  )
}

export default App
