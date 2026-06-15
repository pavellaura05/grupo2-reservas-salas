import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Importar estilos de Bootstrap y Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// JS de Bootstrap necesario para dropdowns/modales
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Estilos base opcionales
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
