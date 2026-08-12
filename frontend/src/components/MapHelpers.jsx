import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Box, Typography } from "@mui/material";
import * as L from "leaflet";

// ─── Helper: Animated Fly to Bounds ───────────────────────────────────────
export const FitBounds = ({ data }) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.features && data.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data);
      map.flyToBounds(geoJsonLayer.getBounds(), {
        padding: [60, 60],
        duration: 1.8,
        easeLinearity: 0.3,
      });
    }
  }, [data, map]);
  return null;
};

// ─── Helper: Zoom Listener ────────────────────────────────────────────────
export const ZoomListener = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => {
      if (onZoomChange) {
        onZoomChange(map.getZoom());
      }
    },
    dragstart: () => {
      // Force close any stuck tooltips when panning the map
      map.eachLayer((layer) => {
        if (layer.closeTooltip) {
          layer.closeTooltip();
        }
      });
    },
  });
  return null;
};

// ─── Helper: Coordinate Display ───────────────────────────────────────────
export const CoordinateDisplay = () => {
  const [pos, setPos] = useState({ lat: -1.2, lng: 116.8 });
  useMapEvents({
    mousemove(e) {
      setPos(e.latlng);
    },
  });
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontFamily: "monospace", color: "#333", fontWeight: 600 }}
      >
        Lat: {pos.lat.toFixed(5)} | Lng: {pos.lng.toFixed(5)}
      </Typography>
    </Box>
  );
};

// ─── Helper: Minimap Sync ────────────────────────────────────────────────
export const MinimapSync = ({ parentMap }) => {
  const minimap = useMap();
  useEffect(() => {
    if (!parentMap) return;
    const updateMinimap = () => {
      minimap.setView(
        parentMap.getCenter(),
        Math.max(parentMap.getZoom() - 5, 0),
      );
    };
    parentMap.on("move", updateMinimap);
    parentMap.on("zoom", updateMinimap);
    updateMinimap();
    return () => {
      parentMap.off("move", updateMinimap);
      parentMap.off("zoom", updateMinimap);
    };
  }, [parentMap, minimap]);
  return null;
};

// ─── Helper: Feature area calculator ───────────────────────────────────────
export const getAreaHa = (feature) => {
  try {
    if (feature.properties) {
      return feature.properties.area_ha || feature.properties.luas_ha || "—";
    }
  } catch {
    return "—";
  }
  return "—";
};
