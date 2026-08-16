import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Chip, Fade, Tooltip } from "@mui/material";
import * as L from "leaflet";
import ForestIcon from "@mui/icons-material/Forest";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HeatmapLayer from "./HeatmapLayer";
import html2canvas from "html2canvas";
import { IconButton } from "@mui/material";

const { BaseLayer } = LayersControl;

import {
  FitBounds,
  ZoomListener,
  CoordinateDisplay,
  MinimapSync,
  getAreaHa,
  getAdminArea,
} from "./MapHelpers";

// ─── Main Component ──────────────────────────────────────────────────────
const MapViewer = ({
  data,
  compareData,
  heatmapData,
  loading,
  year,
  compareYear,
  compareMode,
  onZoomChange,
}) => {
  const [showYearBadge, setShowYearBadge] = useState(false);
  const [_clickedInfo, setClickedInfo] = useState(null);
  const [parentMap, setParentMap] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
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

  const handleScreenshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const mapElement = document.getElementById("map-capture-area");
      if (mapElement) {
        html2canvas(mapElement, {
          useCORS: true,
          allowTaint: true,
          ignoreElements: (node) =>
            node.classList && node.classList.contains("no-capture"),
        })
          .then((canvas) => {
            const link = document.createElement("a");
            link.download = `MangroveSight_${year}.png`;
            link.href = canvas.toDataURL();
            link.click();
            setIsCapturing(false);
          })
          .catch((err) => {
            console.error("Screenshot error:", err);
            setIsCapturing(false);
          });
      } else {
        setIsCapturing(false);
      }
    }, 500); // small delay to hide some UI if needed
  };

  // Dismiss popup on map click (via key)
  const handleMapClick = () => setClickedInfo(null);

  const onEachFeature = useCallback(
    (feature, layer) => {
      const area = getAreaHa(feature);
      const _status = feature.properties?.status;
      const baseColor = feature.properties?.color || "#00BFA5";
      
      const statusLabel = feature.properties?.desc
        ? `<div style="display:flex; align-items:center; margin-top:2px; font-size:0.8rem; color:#555;"><span style="display:inline-block; width:10px; height:10px; background-color:${baseColor}; border-radius:50%; margin-right:6px; border:1px solid #aaa;"></span>Status: <b style="margin-left:4px;">${feature.properties.desc}</b></div>`
        : "";
      
      const spesies = feature.properties?.species || "Rhizophora sp. (Dominan)";
      // Gunakan fungsi estimasi kecamatan dari MapHelpers
      const adminArea = getAdminArea(feature);

      // Logika Tahun Dinamis berdasarkan Mode Perbandingan
      let displayYear = year;
      if (compareMode) {
        if (_status === "loss") {
          displayYear = year; // Hanya ada di tahun dasar
        } else if (_status === "gain") {
          displayYear = compareYear; // Hanya muncul di tahun pembanding
        } else {
          displayYear = `${year} & ${compareYear}`; // Ada di kedua tahun
        }
      }

      const tooltipHtml = `
      <div style="text-align:left; font-family:'Inter',sans-serif; min-width:160px; line-height:1.4;">
        <div style="color:#004D40; font-weight:700; font-size:0.95rem; margin-bottom:6px; text-align:center; border-bottom:1px solid #ddd; padding-bottom:4px;">🌿 Mangrove Patch</div>
        <div style="font-size:0.8rem; color:#555;">📅 Tahun: <b>${displayYear}</b></div>
        <div style="font-size:0.8rem; color:#555;">🧬 Spesies: <b>${spesies}</b></div>
        <div style="font-size:0.8rem; color:#555;">📍 Lokasi: <b>${adminArea}</b></div>
        ${statusLabel}
        ${area !== "—" && !compareMode ? `<div style="font-size:0.8rem; color:#555; margin-top:2px;">📏 Luas: <b>${Number(area).toFixed(2)} ha</b></div>` : ""}
      </div>
    `;
      layer.bindTooltip(tooltipHtml, {
        sticky: true,
        className: "custom-tooltip",
        offset: [15, 0],
      });

      layer.on({
        mouseover: (e) => {
          e.target.setStyle({
            weight: 3,
            color: "#FFFFFF",
            fillColor: baseColor,
            fillOpacity: 0.9,
          });
        },
        mouseout: (e) => {
          e.target.setStyle({
            weight: 1,
            color: baseColor,
            fillColor: baseColor,
            fillOpacity: compareMode ? 0.8 : 0.6,
          });
        },
        click: (e) => {
          const target = e.target;
          const map = target._map;

          try {
            if (typeof target.getBounds === "function") {
              map.flyToBounds(target.getBounds(), {
                padding: [80, 80],
                duration: 1.2,
                easeLinearity: 0.25,
              });
            } else if (typeof target.getLatLng === "function") {
              // For Point geometries (Leaflet Markers), getBounds() doesn't exist. Fly to the point instead.
              map.flyTo(target.getLatLng(), 15, {
                duration: 1.2,
                easeLinearity: 0.25,
              });
            }
          } catch (error) {
            console.warn("Could not zoom to feature:", error);
          }

          setClickedInfo({ lat: e.latlng.lat, lng: e.latlng.lng, area });
        },
      });
    },
    [year, compareYear, compareMode],
  );

  return (
    <Box
      id="map-capture-area"
      sx={{ height: "100%", width: "100%", position: "relative" }}
      onClick={handleMapClick}
    >
      <MapContainer
        center={[-1.2, 116.8]}
        zoom={10}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
        ref={setParentMap}
      >
        <CoordinateDisplay />
        <ZoomListener onZoomChange={onZoomChange} />
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
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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
            key={`geojson-${year}-${data.features?.length || 0}`}
            data={data}
            attribution='&copy; <a href="https://www.globalmangrovewatch.org/">Global Mangrove Watch</a> | MAPID'
            style={{
              color: "#00BFA5",
              weight: 1,
              fillColor: "#00BFA5",
              fillOpacity: 0.6,
            }}
            onEachFeature={onEachFeature}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 5,
                color: "#FFFFFF",
                weight: 1,
                fillColor: "#00BFA5",
                fillOpacity: 0.8,
              });
            }}
          />
        )}

        {compareData && compareMode && (
          <GeoJSON
            key={`compare-${year}-${compareYear}-${compareData.features?.length || 0}`}
            data={compareData}
            attribution='&copy; <a href="https://www.globalmangrovewatch.org/">Global Mangrove Watch</a> | MAPID'
            style={(feature) => ({
              color: feature.properties.color || "#00BFA5",
              weight: 1,
              fillColor: feature.properties.color || "#00BFA5",
              fillOpacity: 0.8,
            })}
            onEachFeature={onEachFeature}
            pointToLayer={(feature, latlng) => {
              const baseColor = feature.properties?.color || "#00BFA5";
              return L.circleMarker(latlng, {
                radius: 5,
                color: "#FFFFFF",
                weight: 1,
                fillColor: baseColor,
                fillOpacity: 0.9,
              });
            }}
          />
        )}

        {heatmapData && <HeatmapLayer points={heatmapData} />}

        <FitBounds data={compareMode ? compareData : data} />
      </MapContainer>

      {/* ── Animated Year Badge ──────────────────────────── */}
      <Fade in={showYearBadge} timeout={{ enter: 400, exit: 1000 }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 900,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(0,77,64,0.9) 0%, rgba(0,191,165,0.9) 100%)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 4,
              px: 5,
              py: 2,
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,77,64,0.5)",
              animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "rgba(255,255,255,0.7)", letterSpacing: 3 }}
            >
              TUTUPAN MANGROVE
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: "#fff", fontWeight: 900, lineHeight: 1, my: 0.5 }}
            >
              {compareMode ? `${year} vs ${compareYear}` : year}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.75)" }}
            >
              Teluk Balikpapan
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* ── Gradient Legends ──────────────────────────────── */}
      <Box
        sx={{
          position: "absolute",
          bottom: 110,
          right: 20,
          zIndex: 1000,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: 150,
        }}
      >
        {heatmapData ? (
          <>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#004D40",
                display: "block",
                mb: 0.5,
              }}
            >
              🔥 Kepadatan Mangrove
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 120,
                  height: 10,
                  borderRadius: 5,
                  background:
                    "linear-gradient(90deg, #0d47a1 0%, #0288d1 30%, #00bfa5 50%, #f9a825 70%, #e53935 90%, #b71c1c 100%)",
                }}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 0.3 }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#777", fontSize: "0.65rem" }}
              >
                Rendah
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#777", fontSize: "0.65rem" }}
              >
                Tinggi
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#004D40",
                display: "block",
                mb: 0.5,
              }}
            >
              🌿 Tutupan Mangrove
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 100,
                  height: 10,
                  borderRadius: 5,
                  background:
                    "linear-gradient(90deg, rgba(0,191,165,0.2), rgba(0,191,165,1))",
                }}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 0.3 }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#777", fontSize: "0.65rem" }}
              >
                Jarang
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#777", fontSize: "0.65rem" }}
              >
                Padat
              </Typography>
            </Box>
          </>
        )}
        {year && (
          <Chip
            label={`${year}`}
            size="small"
            sx={{
              mt: 1,
              bgcolor: "#004D40",
              color: "white",
              fontWeight: 700,
              width: "100%",
              fontSize: "0.75rem",
            }}
          />
        )}
      </Box>

      {/* ── Minimap (Overview Map) ────────────────────────── */}
      <Box
        className="no-capture"
        sx={{
          position: "absolute",
          bottom: 30,
          left: 390,
          width: 150,
          height: 150,
          zIndex: 1000,
          border: "3px solid white",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[-1.2, 116.8]}
          zoom={5}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          touchZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          {/* Rectangle roughly covering Balikpapan Bay area */}
          <GeoJSON
            data={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [116.7, -1.1],
                    [117.1, -1.1],
                    [117.1, -1.6],
                    [116.7, -1.6],
                    [116.7, -1.1],
                  ],
                ],
              },
            }}
            style={{ color: "#00BFA5", weight: 2, fillOpacity: 0 }}
          />
          <MinimapSync parentMap={parentMap} />
        </MapContainer>
      </Box>

      {/* ── Screenshot Button ─────────────────────────────── */}
      <Box
        className="no-capture"
        sx={{
          position: "absolute",
          top: 20,
          right: 70, // right of zoom control
          zIndex: 1000,
        }}
      >
        <Tooltip title="Capture Map" placement="left">
          <IconButton
            onClick={handleScreenshot}
            disabled={isCapturing}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#004D40",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            <CameraAltIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Premium Glassmorphism Loading Overlay ─────────── */}
      <Fade in={loading} timeout={300}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at center, rgba(0,77,64,0.2) 0%, rgba(255,255,255,0.5) 100%)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,191,165,0.3)",
              borderRadius: 4,
              px: 5,
              py: 4,
              boxShadow: "0 8px 32px rgba(0,77,64,0.2)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 70,
                height: 70,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "3px solid transparent",
                  borderTopColor: "#00BFA5",
                  borderRightColor: "#004D40",
                  animation: "spin 1s linear infinite",
                }}
              />
              <ForestIcon sx={{ fontSize: 32, color: "#004D40" }} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ color: "#004D40", fontWeight: 700 }}
            >
              Memuat Data {year}...
            </Typography>
            <Typography variant="caption" sx={{ color: "#888" }}>
              Mengambil geometri spasial mangrove
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default MapViewer;
