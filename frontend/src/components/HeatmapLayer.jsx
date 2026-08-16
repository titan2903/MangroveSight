import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "./leaflet-heat-setup";
import "leaflet.heat";
import L from "leaflet";

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  // 1. Initialize the layer once when the map is available
  useEffect(() => {
    if (!map || typeof L.heatLayer === "undefined") return;

    // Fix: Monkey patch L.HeatLayer._redraw and _update to check this._map
    if (L.HeatLayer) {
      const originalRedraw = L.HeatLayer.prototype._redraw;
      if (originalRedraw && !L.HeatLayer.prototype._redraw_patched) {
        L.HeatLayer.prototype._redraw = function () {
          if (!this._map) return;
          return originalRedraw.call(this);
        };
        L.HeatLayer.prototype._redraw_patched = true;
      }
    }

    // Hitung radius awal berdasarkan zoom saat ini
    const currentZoom = map.getZoom();
    // Rumus sederhana: semakin besar zoom (mendekat), semakin besar radius pixelnya
    const initialRadius = Math.max(15, currentZoom * 2.5);

    heatLayerRef.current = L.heatLayer([], {
      radius: initialRadius,
      blur: initialRadius * 0.8,
      maxZoom: 16,
      max: 1.0,
      minOpacity: 0.35,
      gradient: {
        0.0: "#0d47a1", // Deep Blue
        0.3: "#0288d1", // Light Blue
        0.5: "#00bfa5", // Teal
        0.7: "#f9a825", // Yellow
        0.9: "#e53935", // Red
        1.0: "#b71c1c", // Dark Red
      },
    });

    heatLayerRef.current.addTo(map);

    // Event listener untuk mengubah radius secara dinamis saat zoom berubah
    const updateHeatmapRadius = () => {
      if (!heatLayerRef.current) return;
      const zoom = map.getZoom();
      // Radius membesar saat di-zoom in agar titik tidak menyebar dan menghilang
      const newRadius = Math.max(15, zoom * 3);
      heatLayerRef.current.setOptions({
        radius: newRadius,
        blur: newRadius * 0.8,
      });
    };

    map.on("zoomend", updateHeatmapRadius);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      map.off("zoomend", updateHeatmapRadius);
    };
  }, [map]);

  // 2. Update the layer data whenever points change
  useEffect(() => {
    if (!heatLayerRef.current) return;

    if (!points || points.length === 0) {
      heatLayerRef.current.setLatLngs([]);
      return;
    }

    // Normalisasi bobot (intensity) menggunakan Logarithmic/Square Root.
    // Jika hanya dibagi maxIntensity, area yang kecil akan memiliki bobot 0.001
    // dan menghilang ketika tidak tumpang-tindih di zoom level tinggi.
    const intensities = points.map((p) => p[2] || 1);
    const maxIntensity = Math.max(...intensities, 1);

    const normalizedPoints = points.map((p) => {
      const val = p[2] || 1;
      // Gunakan Math.sqrt agar titik kecil tetap mendapat bobot yang cukup (tidak terlalu pudar)
      const weight = Math.sqrt(val) / Math.sqrt(maxIntensity);
      return [p[0], p[1], weight];
    });

    heatLayerRef.current.setLatLngs(normalizedPoints);
  }, [points]);

  return null;
};

export default HeatmapLayer;
