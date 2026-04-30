import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/**
 * AutoApply Pro: Local Entry Point
 * This file connects your index.html to the React logic in App.jsx.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)