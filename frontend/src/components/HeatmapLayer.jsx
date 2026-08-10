import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import './leaflet-heat-setup';
import 'leaflet.heat';
import L from 'leaflet';

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // 1. Initialize the layer once when the map is available
  useEffect(() => {
    if (!map || typeof L.heatLayer === 'undefined') return;

    // Fix: Monkey patch L.HeatLayer._redraw and _update to check this._map
    // This prevents "Cannot read properties of null (reading 'getSize')"
    // when a requestAnimationFrame fires after the layer is removed.
    if (L.HeatLayer) {
      const originalRedraw = L.HeatLayer.prototype._redraw;
      if (originalRedraw && !L.HeatLayer.prototype._redraw_patched) {
        L.HeatLayer.prototype._redraw = function() {
          if (!this._map) return;
          return originalRedraw.call(this);
        };
        L.HeatLayer.prototype._redraw_patched = true;
      }
    }

    heatLayerRef.current = L.heatLayer([], {
      radius: 25,
      blur: 20,
      maxZoom: 16,
      max: 1.0,
      minOpacity: 0.3,
      gradient: {
        0.0: '#0d47a1', // Deep Blue
        0.3: '#0288d1', // Light Blue
        0.5: '#00bfa5', // Teal
        0.7: '#f9a825', // Yellow
        0.9: '#e53935', // Red
        1.0: '#b71c1c', // Dark Red
      },
    });

    heatLayerRef.current.addTo(map);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map]);

  // 2. Update the layer data whenever points change
  useEffect(() => {
    if (!heatLayerRef.current) return;

    if (!points || points.length === 0) {
      heatLayerRef.current.setLatLngs([]);
      return;
    }

    // Backend returns [[lat, lng, intensity], ...] where intensity is the area.
    // We normalize it between 0 and 1.
    const intensities = points.map(p => p[2] || 1);
    const maxIntensity = Math.max(...intensities, 1);
    const normalizedPoints = points.map(p => [p[0], p[1], (p[2] || 1) / maxIntensity]);

    heatLayerRef.current.setLatLngs(normalizedPoints);
    
  }, [points]);

  return null;
};

export default HeatmapLayer;

