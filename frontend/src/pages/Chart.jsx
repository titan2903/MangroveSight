import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import BarChartIcon from "@mui/icons-material/BarChart";
import { fetchStats } from "../api";
import StatsChart from "../components/StatsChart";
import Footer from "../components/Footer";

const Chart = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchStats();
        setStatsData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Gagal memuat data statistik. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Hero Header Banner */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #004D40 0%, #00695C 50%, #0277BD 100%)",
          py: { xs: 5, md: 7 },
          px: 2,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-40%",
            right: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-50%",
            left: "-5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Chip
              icon={
                <BarChartIcon
                  sx={{ color: "#A5F3FC !important", fontSize: "0.85rem" }}
                />
              }
              label="Dashboard Statistik"
              sx={{
                mb: 2,
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#A5F3FC",
                border: "1px solid rgba(165,243,252,0.3)",
                fontWeight: "bold",
                fontSize: "0.75rem",
                backdropFilter: "blur(4px)",
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#ffffff",
                mb: 1.5,
                fontSize: { xs: "2rem", md: "2.75rem" },
                lineHeight: 1.2,
              }}
            >
              Analisis Statistik Mangrove
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: 400,
                maxWidth: 600,
                fontSize: { xs: "0.95rem", md: "1.1rem" },
              }}
            >
              Visualisasi komprehensif tren luas dan perubahan area mangrove di
              Teluk Balikpapan berdasarkan data{" "}
              <strong style={{ color: "#A5F3FC" }}>
                Global Mangrove Watch (2007–2022)
              </strong>
              .
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, bgcolor: "#f0f4f3", py: 5 }}>
        <Container maxWidth="lg">
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                p: 10,
              }}
            >
              <CircularProgress sx={{ color: "#00BFA5" }} size={48} />
              <Typography variant="body2" color="text.secondary">
                Memuat data statistik...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && statsData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <StatsChart stats={statsData} />
            </motion.div>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Chart;
