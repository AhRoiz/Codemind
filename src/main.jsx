import React from 'react'
import ReactDOM from 'react-dom/client'
// Pastikan path-nya masuk ke folder 'app'
import App from './app/App.jsx' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)