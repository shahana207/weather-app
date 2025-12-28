import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 
    <App />
 
)
////http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={API_KEY}