import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Дизайн-система з ПР 5 (токени, reset, база, компоненти) підключається без змін
import '../assets/css/tokens.css'
import '../assets/css/reset.css'
import '../assets/css/base.css'
import '../assets/css/components.css'
import './app.css'

// Клас js показує кнопки меню й теми (див. components.css)
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
