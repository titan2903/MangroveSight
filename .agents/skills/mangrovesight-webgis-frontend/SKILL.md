---
name: mangrovesight-webgis-frontend
description: Frontend development guidelines for MangroveSight WebGIS project using React, Leaflet, and Recharts. Triggers when working on map, chart, or UI components for MangroveSight.
---

# MangroveSight WebGIS Frontend Guidelines

You are an expert Frontend Developer for the **MangroveSight** project, a WebGIS application that monitors mangrove forest changes in Teluk Balikpapan (2007-2020).

## 🛠 Tech Stack & Core Libraries

- **Framework**: React 19 (bootstrapped with Vite 8)
- **UI Library**: `Material UI (MUI)` (`@mui/material`, `@emotion/react`, `@emotion/styled`)
- **Icons**: `lucide-react` & `@mui/icons-material`
- **WebGIS / Mapping**: `react-leaflet` + `leaflet`
- **Data Visualization**: `recharts`
- **API Client**: `axios`
- **Styling**: MUI's `sx` prop + Custom Theme (`createTheme`) + Glassmorphism

## 📦 First-Time Project Setup (in order)

> The frontend uses Vite. Follow this order when building from scratch:

```bash
cd frontend

# 1. Install core dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material leaflet react-leaflet recharts axios lucide-react

# 2. Configure environment variable for API URL (Optional, currently hardcoded to localhost:8000 in api.js)
```

## 📡 API Integration & Data Fetching

Use the centralized `api.js` Axios wrapper:

```js
import { fetchAvailableYears, fetchStats, fetchMangroveGeoJSON, askAI } from './api';

// Example Usage:
const years = await fetchAvailableYears();
const geoData = await fetchMangroveGeoJSON(2007);
const stats = await fetchStats();
const aiResponse = await askAI("Berapa luas mangrove?");
```

Always handle loading and error states (e.g., using `CircularProgress` from MUI).

## 🗺 Map Development (MapViewer)

- **`react-leaflet` Best Practices**: `MapContainer` MUST have explicit height/width in CSS, otherwise the map won't render
- **GeoJSON Rendering**: Use `<GeoJSON key={year} />` — the `key` prop forces Leaflet to re-render when epoch changes
- **Auto Zoom**: Use a nested component with `useMap()` and `map.fitBounds()` to auto-focus on the new GeoJSON when it loads.
- **Leaflet CSS**: Must import `leaflet/dist/leaflet.css`

## 📊 Data Visualization (Sidebar)

- Use **Recharts** with data from `GET /api/stats`
- **Line Chart**: Mangrove area (ha) trend over 2007–2020 inside `ResponsiveContainer`.
- **Metrics**: Display total area and delta (change from previous year) using MUI `Typography`.

## 🤖 AI Chat Widget (ChatAssistant)

- Floating button (`Fab`) at bottom-right corner
- Opens a glassmorphic `Paper` dialog with chat history.
- Uses `lucide-react` icons (Bot, User, Send).

## 🎨 UI/UX & Component Architecture

### Aesthetic Theme — "Mangrove Vibe" (MUI Theme)
- **Primary**: Deep Forest Green `#004D40`, Emerald `#00BFA5`
- **Accents**: Oceanic Blue `#0277BD`
- **Backgrounds**: Off-white `#f5f5f5`
- **Glassmorphism**: Use `sx={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)' }}`
- **Typography**: Google Fonts — *Inter*, *Roboto*

### Component Architecture (Single Page Dashboard)
```
src/
├── api.js                # Axios instance and API wrappers
├── App.jsx               # Main Layout (ThemeProvider, States)
├── components/
│   ├── MapViewer.jsx     # Leaflet map taking full screen
│   ├── Sidebar.jsx       # Floating glass panel for Stats & Recharts
│   └── ChatAssistant.jsx # Floating AI chatbot widget
└── main.jsx              # Entry point
```

The app is a unified Single-Page Dashboard (no routes needed). `Sidebar` and `ChatAssistant` float above the full-screen `MapViewer` using CSS positioning and `zIndex`.




