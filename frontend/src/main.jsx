import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './views/LandingPage.jsx'
import SingleProduct from './views/SingleProduct.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SingleProduct />
  </StrictMode>,
)
