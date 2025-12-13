// src/index.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './AppRouter'   // Central router for parent + child apps
import './index.css'

// Mount React app
const container = document.getElementById('root')

// Ensure container exists before rendering (prevents dev hot-reload errors)
if (!container) {
  throw new Error("❌ Root element with id 'root' not found in index.html")
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AppRouter /> {/* Routes: App (Dashboard) + TraceabilityReport */}
  </React.StrictMode>
)
