---
name: mangrovesight-webgis-frontend
description: Frontend development guidelines for MangroveSight WebGIS project using React, Leaflet, and Recharts. Triggers when working on map, chart, or UI components for MangroveSight.
---

# MangroveSight WebGIS Frontend Guidelines

You are an expert Frontend Developer for the **MangroveSight** project, a WebGIS application that monitors mangrove forest changes in Teluk Balikpapan (2000-2020).

## 🛠 Tech Stack & Core Libraries
- **Framework**: React JS (bootstrapped with Vite)
- **Routing**: React Router v6 (`/about`, `/maps`, `/chart`)
- **WebGIS / Mapping**: `react-leaflet` (Leaflet.js wrapper)
- **Data Visualization**: `recharts`
- **Geospatial Utils (Optional)**: `turf.js` (for client-side area validation/processing if needed)
- **Styling**: Vanilla CSS / CSS Modules with modern and clean UI (glassmorphism, subtle animations).

## 🗺 Map Development (Halaman Maps - `/maps`)
- **`react-leaflet` Best Practices**: Ensure the `MapContainer` has a defined height/width (otherwise the map won't render).
- **GeoJSON Rendering**: Use Leaflet's `<GeoJSON />` component to render the mangrove spatial data. Be mindful of React state changes to avoid unnecessary re-renders of heavy GeoJSON layers.
- **Layer Styling**: Maintain a consistent green color for mangrove layers. Ensure smooth switching between epochs (2000-2020).
- **Change Detection View**: When comparing two epochs (F3), use contrasting colors (e.g., Red for Loss, Blue for Gain, Green for Unchanged).
- **Basemaps**: Provide toggle functionality between OpenStreetMap (OSM) and Esri Satellite base maps.

## 📊 Data Visualization (Halaman Chart - `/chart`)
- Use **Recharts** to render statistical data fetched from `/api/stats`.
- **Line Chart**: To visualize the trend of mangrove area (ha) over time (2000-2020).
- **Bar Chart**: To display the changes (delta in ha) between epochs. Use green bars for gain and red bars for loss.
- Ensure charts are fully responsive (`<ResponsiveContainer>`) and adapt to the layout.

## 🤖 AI Insight Assistant (Chat Widget)
- Implement a floating chat widget for the AI Assistant.
- **Mechanism**: The frontend simply sends user text input to the backend (`/api/ask`) and displays the response.
- **Stateless**: The chat doesn't need complex multi-turn memory across sessions. Keep the UI simple (Message list + Input box + Loading state).
- Ensure a fast and responsive UI, displaying a loading indicator while waiting for the Gemini API response from the backend.

## 📡 API Integration & Data Fetching
- **Endpoints to consume**:
  - `GET /api/mangrove?year=YYYY`: Fetch GeoJSON for a specific epoch.
  - `GET /api/stats`: Fetch precomputed statistics (JSON).
  - `GET /api/years`: Fetch available epochs.
  - `POST /api/ask`: Submit queries to the AI assistant.
- Use `useEffect` with standard `fetch` or `axios` for data fetching. Handle loading and error states properly to improve UX.
- Prevent on-the-fly geospatial calculation in the browser if it can be fetched directly from precomputed backend stats.

## 🎨 UI/UX and Component Architecture
- **Aesthetic & Theme (Mangrove Vibe)**: Design a UI that feels premium, modern, and deeply connected to nature. 
  - **Color Palette**: Use curated "Mangrove" colors. 
    - *Primary/Brand*: Deep Forest Green (`#1E3F20`), Emerald/Vibrant Mangrove Green (`#2E8B57` or `#34A853`).
    - *Accents*: Oceanic/Bay Blue (`#1E90FF` or `#007BFF`) for interactive elements and water references, Earthy Brown (`#8B4513`) for subtle highlights.
    - *Backgrounds*: Clean off-white/light gray (`#F8F9FA`) for light mode, or deep rich dark blue/charcoal (`#121820`) for dark mode to make the maps pop.
  - **Modern UI Elements**: Employ Glassmorphism (translucent backgrounds with `backdrop-filter: blur()`) for floating panels (Navbar, Info Sidebar, AI Chat) so the map remains visible underneath.
  - **Typography**: Use modern, clean fonts (e.g., *Inter*, *Outfit*, or *Roboto*).
  - **Micro-animations**: Add smooth hover states, gentle slide-in transitions for panels, and soft shadows to provide depth.
- **Navigation (F0)**: Ensure the Navbar is persistent and indicates the active route cleanly without page reloads (SPA routing). Give it a glassmorphic effect if it overlays the map.
- **Sidebar/Panel (F4)**: Build a contextual info panel that updates automatically when a user selects a different epoch or map area. Floating cards with rounded corners (`border-radius: 12px` or `16px`) and soft drop-shadows work best.
- **Component Splitting**: Keep components focused. For example, separate `MapViewer.jsx`, `EpochSlider.jsx`, `ChatWidget.jsx`, and `StatsChart.jsx`.
