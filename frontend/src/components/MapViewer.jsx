import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, ScaleControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Chip, Fade, Tooltip } from '@mui/material';
import * as L from 'leaflet';
import ForestIcon from '@mui/icons-material/Forest';
import SatelliteIcon from '@mui/icons-material/Satellite';
import LayersIcon from '@mui/icons-material/Layers';
import HeatmapLayer from './HeatmapLayer';

const { BaseLayer } = LayersControl;

// ─── Helper: Animated Fly to Bounds ───────────────────────────────────────
const FitBounds = ({ data }) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.features && data.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data);
      map.flyToBounds(geoJsonLayer.getBounds(), { padding: [60, 60], duration: 1.8, easeLinearity: 0.3 });
    }
  }, [data, map]);
  return null;
};

// ─── Helper: Feature area calculator ───────────────────────────────────────
const getAreaHa = (feature) => {
  try {
    if (feature.properties) {
      return (feature.properties.area_ha || feature.properties.luas_ha || '—');
    }
  } catch { return '—'; }
  return '—';
};

// ─── Main Component ──────────────────────────────────────────────────────
const MapViewer = ({ data, compareData, heatmapData, loading, year, compareYear, compareMode }) => {
  const [showYearBadge, setShowYearBadge] = useState(false);
  const [clickedInfo, setClickedInfo] = useState(null);
  const prevYear = useRef(null);

  // Animate year badge whenever year changes
  useEffect(() => {
    if (year && year !== prevYear.current) {
      prevYear.current = year;
      setShowYearBadge(true);
      const t = setTimeout(() => setShowYearBadge(false), 3000);
      return () => clearTimeout(t);
    }
  }, [year]);

  // Dismiss popup on map click (via key)
  const handleMapClick = () => setClickedInfo(null);

  const onEachFeature = useCallback((feature, layer) => {
    const area = getAreaHa(feature);
    const status = feature.properties?.status;
    const baseColor = feature.properties?.color || '#00BFA5';
    const statusLabel = feature.properties?.desc ? `Status: <b>${feature.properties.desc}</b><br/>` : '';

    const tooltipHtml = `
      <div style="text-align:center; font-family:'Inter',sans-serif; min-width:130px;">
        <div style="color:#004D40; font-weight:700; font-size:0.9rem; margin-bottom:4px;">🌿 Mangrove Patch</div>
        <div style="font-size:0.8rem; color:#555;">Tahun: <b>${compareMode ? `${year} vs ${compareYear}` : year}</b></div>
        ${statusLabel}
        ${area !== '—' && !compareMode ? `<div style="font-size:0.8rem; color:#555;">Luas: <b>${Number(area).toFixed(2)} ha</b></div>` : ''}
      </div>
    `;
    layer.bindTooltip(tooltipHtml, { sticky: true, className: 'custom-tooltip', offset: [15, 0] });

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 3, color: '#FFFFFF', fillColor: baseColor, fillOpacity: 0.9 });
        e.target.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle({ weight: 1, color: baseColor, fillColor: baseColor, fillOpacity: compareMode ? 0.8 : 0.6 });
      },
      click: (e) => {
        const target = e.target;
        const map = target._map;
        
        try {
          if (typeof target.getBounds === 'function') {
            map.flyToBounds(target.getBounds(), { padding: [80, 80], duration: 1.2, easeLinearity: 0.25 });
          } else if (typeof target.getLatLng === 'function') {
            // For Point geometries (Leaflet Markers), getBounds() doesn't exist. Fly to the point instead.
            map.flyTo(target.getLatLng(), 15, { duration: 1.2, easeLinearity: 0.25 });
          }
        } catch (error) {
          console.warn("Could not zoom to feature:", error);
        }
        
        setClickedInfo({ lat: e.latlng.lat, lng: e.latlng.lng, area });
      }
    });
  }, [year, compareYear, compareMode]);

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }} onClick={handleMapClick}>
      <MapContainer
        center={[-1.2, 116.8]}
        zoom={10}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        <ZoomControl position="topright" />
        <ScaleControl position="bottomright" imperial={false} />

        <LayersControl position="topleft">
          <BaseLayer checked name="🗺️ Light Map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />
          </BaseLayer>
          <BaseLayer name="🛰️ Satellite (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </BaseLayer>
          <BaseLayer name="🌙 Dark Mode">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />
          </BaseLayer>
          <BaseLayer name="🏔️ OpenTopo">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            />
          </BaseLayer>
        </LayersControl>

        {data && !compareMode && (
          <GeoJSON
            key={`data-${year}`}
            data={data}
            style={{
              color: '#00BFA5',
              weight: 1,
              fillColor: '#00BFA5',
              fillOpacity: 0.6,
            }}
            onEachFeature={onEachFeature}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 5,
                color: '#FFFFFF',
                weight: 1,
                fillColor: '#00BFA5',
                fillOpacity: 0.8
              });
            }}
          />
        )}
        
        {compareData && compareMode && (
          <GeoJSON
            key={`compare-${year}-${compareYear}`}
            data={compareData}
            style={(feature) => ({
              color: feature.properties.color || '#00BFA5',
              weight: 1,
              fillColor: feature.properties.color || '#00BFA5',
              fillOpacity: 0.8,
            })}
            onEachFeature={onEachFeature}
            pointToLayer={(feature, latlng) => {
              const baseColor = feature.properties?.color || '#00BFA5';
              return L.circleMarker(latlng, {
                radius: 5,
                color: '#FFFFFF',
                weight: 1,
                fillColor: baseColor,
                fillOpacity: 0.9
              });
            }}
          />
        )}

        {heatmapData && <HeatmapLayer points={heatmapData} />}

        <FitBounds data={compareMode ? compareData : data} />
      </MapContainer>

      {/* ── Animated Year Badge ──────────────────────────── */}
      <Fade in={showYearBadge} timeout={{ enter: 400, exit: 1000 }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 900,
          pointerEvents: 'none',
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(0,77,64,0.9) 0%, rgba(0,191,165,0.9) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 4,
            px: 5, py: 2,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,77,64,0.5)',
            animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 3 }}>
              TUTUPAN MANGROVE
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1, my: 0.5 }}>
              {compareMode ? `${year} vs ${compareYear}` : year}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              Teluk Balikpapan
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* ── Gradient Legend ──────────────────────────────── */}
      <Box sx={{
        position: 'absolute',
        bottom: 110,
        right: 20,
        zIndex: 1000,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        p: 1.5,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: 150,
      }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#004D40', display: 'block', mb: 0.5 }}>
          🌿 Tutupan Mangrove
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 100, height: 10, borderRadius: 5, background: 'linear-gradient(90deg, rgba(0,191,165,0.2), rgba(0,191,165,1))' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.3 }}>
          <Typography variant="caption" sx={{ color: '#777', fontSize: '0.65rem' }}>Jarang</Typography>
          <Typography variant="caption" sx={{ color: '#777', fontSize: '0.65rem' }}>Padat</Typography>
        </Box>
        {year && (
          <Chip
            label={`${year}`}
            size="small"
            sx={{ mt: 1, bgcolor: '#004D40', color: 'white', fontWeight: 700, width: '100%', fontSize: '0.75rem' }}
          />
        )}
      </Box>

      {/* ── Premium Glassmorphism Loading Overlay ─────────── */}
      <Fade in={loading} timeout={300}>
        <Box sx={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(0,77,64,0.2) 0%, rgba(255,255,255,0.5) 100%)',
          backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
        }}>
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,191,165,0.3)',
            borderRadius: 4, px: 5, py: 4,
            boxShadow: '0 8px 32px rgba(0,77,64,0.2)'
          }}>
            <Box sx={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#00BFA5', borderRightColor: '#004D40',
                animation: 'spin 1s linear infinite'
              }} />
              <ForestIcon sx={{ fontSize: 32, color: '#004D40' }} />
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#004D40', fontWeight: 700 }}>
              Memuat Data {year}...
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Mengambil geometri spasial mangrove
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* ── Global CSS Animations ─────────────────────────── */}
      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.5); }
          80%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .leaflet-interactive {
          transition: fill-opacity 0.25s ease, stroke-width 0.2s ease;
        }
        .custom-tooltip {
          background-color: rgba(255,255,255,0.97) !important;
          border: 1px solid #00BFA5 !important;
          border-radius: 10px !important;
          box-shadow: 0 6px 20px rgba(0,77,64,0.15) !important;
          padding: 10px 14px !important;
        }
        .leaflet-tooltip-left.custom-tooltip::before  { border-left-color:  #00BFA5 !important; }
        .leaflet-tooltip-right.custom-tooltip::before { border-right-color: #00BFA5 !important; }
        .leaflet-control-layers {
          border-radius: 10px !important;
          border: none !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          overflow: hidden;
        }
        .leaflet-control-layers-expanded { padding: 12px !important; }
        /* Push zoom controls down from top to avoid overlapping with layers control */
        .leaflet-top.leaflet-right {
          top: 10px !important;
        }
        .leaflet-control-zoom {
          margin-top: 60px !important;
        }
        .leaflet-control-zoom a {
          border-radius: 6px !important;
          transition: background 0.2s !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #004D40 !important;
          color: white !important;
        }
        .leaflet-bar a {
          transition: all 0.2s ease !important;
        }
      `}</style>
    </Box>
  );
};

export default MapViewer;
