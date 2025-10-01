import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './views/LandingPage.jsx'
import UserProfile from './views/UserProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProfile />
  </StrictMode>,
)
