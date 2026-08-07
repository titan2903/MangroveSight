---
name: mangrovesight-webgis-frontend
description: Frontend development guidelines for MangroveSight WebGIS project using React, Leaflet, and Recharts. Triggers when working on map, chart, or UI components for MangroveSight.
---

# MangroveSight WebGIS Frontend Guidelines

You are an expert Frontend Developer for the **MangroveSight** project, a WebGIS application that monitors mangrove forest changes in Teluk Balikpapan (2000-2020).

## 🛠 Tech Stack & Core Libraries

- **Framework**: React 19 (bootstrapped with Vite 8)
- **Routing**: `react-router-dom` v6 (routes: `/about`, `/maps`, `/chart`)
- **WebGIS / Mapping**: `react-leaflet` + `leaflet`
- **Data Visualization**: `recharts`
- **Geospatial Utils (Optional)**: `turf.js` — only for client-side validation/area checks if backend data is insufficient; do NOT use for primary statistics (use `/api/stats` instead)
- **Styling**: Vanilla CSS / CSS Modules — glassmorphism, subtle animations, "Mangrove Vibe" theme

## 📦 First-Time Project Setup (in order)

> The frontend currently contains only the Vite boilerplate. Follow this order when building from scratch:

```bash
cd frontend

# 1. Install core dependencies
npm install react-router-dom react-leaflet leaflet recharts

# 2. (Optional) Install turf for client-side geo utilities
npm install @turf/turf

# 3. Configure environment variable for API URL
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
echo "VITE_API_BASE_URL=" >> .env.example  # placeholder for production
```

## ⚙️ Vite Config — Local Dev Proxy

Add a proxy to `vite.config.js` so the frontend can call `http://localhost:8000/api/...` without CORS errors during local development:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

In production (Netlify), use the `VITE_API_BASE_URL` env variable to point to the Heroku backend URL.

## 🌐 Environment Variables

| Variable | Local | Production (Netlify) |
|----------|-------|----------------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | `https://your-app.herokuapp.com` |

Access in code: `import.meta.env.VITE_API_BASE_URL`

## 🗺 Map Development (Halaman Maps — `/maps`)

- **`react-leaflet` Best Practices**: `MapContainer` MUST have explicit height/width in CSS, otherwise the map won't render
- **GeoJSON Rendering**: Use `<GeoJSON key={year} />` — the `key` prop forces Leaflet to re-render when epoch changes
- **Layer Styling**: Consistent green for mangrove polygons; smooth epoch switching
- **Change Detection (F3)**: Contrasting colors — Red (loss), Blue (gain), Green (unchanged)
- **Basemaps**: Toggle between OpenStreetMap and Esri Satellite tile layers
- **Leaflet CSS**: Must import `leaflet/dist/leaflet.css` in `main.jsx`

## 📊 Data Visualization (Halaman Chart — `/chart`)

- Use **Recharts** with data from `GET /api/stats`
- **Line Chart**: Mangrove area (ha) trend over 2000–2020
- **Bar Chart**: Delta (ha) between epochs — green bars for gain, red bars for loss
- **Summary Cards**: 4 metrics — max area, min area, net change, biggest loss epoch
- Always wrap in `<ResponsiveContainer>` for responsive layout

## 🤖 AI Chat Widget (F6)

- Floating button at bottom-right corner
- On submit: POST `${VITE_API_BASE_URL}/api/ask` with `{ "question": "..." }`
- Show loading spinner while waiting; display response in message list
- **Stateless** — no session memory needed between page refreshes

## 📡 API Integration & Data Fetching

```js
const API = import.meta.env.VITE_API_BASE_URL || ''

// Fetch GeoJSON for a specific epoch
const res = await fetch(`${API}/api/mangrove?year=${year}`)

// Fetch precomputed statistics
const res = await fetch(`${API}/api/stats`)

// Fetch available epochs
const res = await fetch(`${API}/api/years`)

// Ask AI assistant
const res = await fetch(`${API}/api/ask`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: userInput })
})
```

Always handle loading and error states. Do NOT do geospatial calculations in the browser — fetch from precomputed backend data.

## 🎨 UI/UX & Component Architecture

### Aesthetic Theme — "Mangrove Vibe"
- **Primary**: Deep Forest Green `#1E3F20`, Emerald `#2E8B57`
- **Accents**: Oceanic Blue `#1E90FF` for interactive elements
- **Backgrounds**: Dark charcoal `#121820` (dark mode) or off-white `#F8F9FA`
- **Glassmorphism**: Use `backdrop-filter: blur(10px)` + semi-transparent backgrounds for Navbar, Info Sidebar, AI Chat panel
- **Typography**: Google Fonts — *Inter*, *Outfit*, or *Roboto*
- **Micro-animations**: Hover states, slide-in transitions, soft box-shadows

### Recommended Component Split
```
src/
├── pages/
│   ├── About.jsx         # Static info page
│   ├── Maps.jsx          # Main map page (F1, F3, F4, F5)
│   └── Chart.jsx         # Data viz page (F2b)
├── components/
│   ├── Navbar.jsx        # Persistent SPA navbar with active state
│   ├── MapViewer.jsx     # react-leaflet MapContainer + GeoJSON layer
│   ├── EpochSlider.jsx   # Year slider/dropdown for epoch switching
│   ├── InfoPanel.jsx     # Contextual sidebar (area, source, year)
│   ├── ChatWidget.jsx    # Floating AI chat button + panel
│   └── StatsChart.jsx    # Recharts line + bar charts
├── App.jsx               # React Router routes
└── main.jsx              # Entry point (import leaflet.css here)
```

### Navigation
- `react-router-dom` `<BrowserRouter>` with `<Routes>` for `/about`, `/maps`, `/chart`
- Navbar uses `<NavLink>` to show active state without full page reload
- Glassmorphic navbar with `position: sticky` or `position: fixed` over the map


