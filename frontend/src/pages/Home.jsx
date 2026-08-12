import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { Map, TrendingUp, Cpu, ChevronDown, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";

// Import images
import img1 from "../images/mangrove-sea.jpg";
import img2 from "../images/Pembukan-mangrove-pt-MMP-Pokja-Pesisir2.jpg";
import img3 from "../images/bentang-mangrove.jpeg";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        overflowX: "hidden",
      }}
    >
      {/* 1. Cinematic Hero Section */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image with Parallax-like scale */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${img1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
        {/* Deep Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0, 30, 20, 0.4) 0%, rgba(0, 77, 64, 0.85) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{ position: "relative", zIndex: 2, px: 3, maxWidth: "1000px" }}
        >
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: "3.5rem", md: "5.5rem" },
                background: "linear-gradient(45deg, #A7FFEB, #00BFA5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0px 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              MangroveSight
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                fontWeight: 300,
                lineHeight: 1.6,
                opacity: 0.95,
                textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Eksplorasi Dinamika Spasial & Perubahan Ekologis Hutan Mangrove
              Teluk Balikpapan (2007 - 2022)
            </Typography>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/maps"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#00BFA5",
                  color: "#fff",
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: "1.2rem",
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: "bold",
                  boxShadow: "0 8px 32px rgba(0, 191, 165, 0.5)",
                  "&:hover": { bgcolor: "#004D40" },
                  animation: "pulse 2s infinite",
                }}
              >
                Jelajahi Peta Spasial
              </Button>
            </motion.div>
          </motion.div>
        </Box>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: "absolute", bottom: "40px", zIndex: 2 }}
        >
          <ChevronDown size={40} opacity={0.7} />
        </motion.div>
      </Box>

      {/* 2. Features & Context Section */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 3 }}
      >
        {/* Text Section (Full width, centered) */}
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <Typography
              variant="h3"
              sx={{ color: "#004D40", fontWeight: 800, mb: 3 }}
            >
              Mengapa Teluk Balikpapan?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.15rem",
                lineHeight: 1.8,
                color: "#455a64",
                mb: 2,
                maxWidth: "900px",
                mx: "auto",
              }}
            >
              Teluk Balikpapan adalah surga keanekaragaman hayati yang menopang
              kehidupan satwa endemik seperti Bekantan. Namun, pesatnya
              industrialisasi menempatkan kawasan esensial ini di bawah ancaman
              deforestasi kritis.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.15rem",
                lineHeight: 1.8,
                color: "#455a64",
                maxWidth: "900px",
                mx: "auto",
              }}
            >
              MangroveSight mengombinasikan kecerdasan spasial (GIS) dan
              analitik tingkat lanjut untuk memberikan visualisasi komprehensif
              tentang penyusutan dan pertumbuhan ekosistem lahan basah ini.
            </Typography>
          </motion.div>
        </Box>

        {/* Cards Section (2 cards per row) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            {/* Feature 1 */}
            <Box>
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e0f2f1",
                    boxShadow: "0 10px 40px rgba(0,77,64,0.05)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "#e0f2f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00BFA5",
                      mb: 2,
                    }}
                  >
                    <Map size={28} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: "#004D40" }}
                  >
                    Change Detection
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#607d8b", lineHeight: 1.6 }}
                  >
                    Analisis poligon otomatis untuk melacak area yang hilang,
                    tumbuh, atau stabil (2007-2022).
                  </Typography>
                </Paper>
              </motion.div>
            </Box>

            {/* Feature 2 */}
            <Box>
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e0f2f1",
                    boxShadow: "0 10px 40px rgba(0,77,64,0.05)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "#fff3e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f57c00",
                      mb: 2,
                    }}
                  >
                    <Activity size={28} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: "#004D40" }}
                  >
                    Heatmap Kepadatan
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#607d8b", lineHeight: 1.6 }}
                  >
                    Visualisasi konsentrasi area mangrove secara termal dengan
                    rendering canvas performa tinggi.
                  </Typography>
                </Paper>
              </motion.div>
            </Box>

            {/* Feature 3 */}
            <Box>
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e0f2f1",
                    boxShadow: "0 10px 40px rgba(0,77,64,0.05)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "#e8eaf6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3f51b5",
                      mb: 2,
                    }}
                  >
                    <TrendingUp size={28} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: "#004D40" }}
                  >
                    Statistik Panel
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#607d8b", lineHeight: 1.6 }}
                  >
                    Dashboard grafik analitik untuk melihat tren total luas area
                    secara kuantitatif & instan.
                  </Typography>
                </Paper>
              </motion.div>
            </Box>

            {/* Feature 4 */}
            <Box>
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e0f2f1",
                    boxShadow: "0 10px 40px rgba(0,77,64,0.05)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "#fce4ec",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#e91e63",
                      mb: 2,
                    }}
                  >
                    <Cpu size={28} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: "#004D40" }}
                  >
                    OpenRouter AI Assistant
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#607d8b", lineHeight: 1.6 }}
                  >
                    Chatbot integratif yang disuplai dengan konteks statistik
                    untuk menjawab pertanyaan geospasial Anda.
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* 3. Media Gallery / Context Showcase */}
      <Box sx={{ bgcolor: "#ffffff", py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: "#004D40",
                fontWeight: 800,
                mb: 6,
              }}
            >
              Ancaman Nyata, Solusi Berbasis Data
            </Typography>
          </motion.div>

          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                style={{ height: "100%" }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="320"
                      image={img3}
                      alt="Hutan Mangrove"
                      sx={{
                        transition: "transform 0.5s",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      bgcolor: "#004D40",
                      color: "white",
                      flexGrow: 1,
                      p: { xs: 3, md: 5 },
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                      Ekosistem Lahan Basah
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ opacity: 0.85, lineHeight: 1.7 }}
                    >
                      Benteng alami pesisir Balikpapan yang menyimpan cadangan
                      karbon tinggi dan melindungi lingkungan dari abrasi laut
                      yang destruktif.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                style={{ height: "100%" }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="320"
                      image={img2}
                      alt="Kerusakan Mangrove"
                      sx={{
                        transition: "transform 0.5s",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      bgcolor: "#C62828",
                      color: "white",
                      flexGrow: 1,
                      p: { xs: 3, md: 5 },
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                      Deforestasi Industri
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ opacity: 0.85, lineHeight: 1.7 }}
                    >
                      Pembukaan lahan masif yang mengancam keberlanjutan
                      wilayah. MangroveSight hadir untuk memantau perubahan ini
                      secara transparan.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. Modern Footer */}
      <Box
        sx={{
          bgcolor: "#004D40",
          color: "rgba(255, 255, 255, 0.8)",
          py: 6,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
            {/* Column 1: Project Info */}
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#00BFA5", fontWeight: 800, mb: 1 }}
              >
                MangroveSight
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Sistem Informasi Geografis & Change Detection Deforestasi
                Mangrove Teluk Balikpapan (2007-2022)
              </Typography>
            </Grid>

            {/* Column 2: Contact */}
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: 600, mb: 2, fontSize: "1rem" }}
              >
                Hubungi Saya
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: 1,
                  gap: 1.5,
                }}
              >
                <InstagramIcon sx={{ fontSize: 18, color: "#00BFA5" }} />
                <Typography
                  component="a"
                  href="https://instagram.com/titann.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": { color: "#00BFA5" },
                  }}
                >
                  @titann.io
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: 1,
                  gap: 1.5,
                }}
              >
                <EmailIcon sx={{ fontSize: 18, color: "#00BFA5" }} />
                <Typography
                  component="a"
                  href="mailto:titanioyudista29@gmail.com"
                  variant="body2"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": { color: "#00BFA5" },
                  }}
                >
                  titanioyudista29@gmail.com
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: 1.5,
                }}
              >
                <GitHubIcon sx={{ fontSize: 18, color: "#00BFA5" }} />
                <Typography
                  component="a"
                  href="https://github.com/titan2903/MangroveSight"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": { color: "#00BFA5" },
                  }}
                >
                  Source Code Repository
                </Typography>
              </Box>
            </Grid>

            {/* Column 3: Copyright */}
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                textAlign: { xs: "center", md: "right" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                &copy; {new Date().getFullYear()} MangroveSight Project.
                <br />
                All rights reserved.
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 2, opacity: 0.6, fontSize: "0.8rem" }}
              >
                Diberdayakan oleh React, Leaflet, & OpenRouter AI
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Global CSS animation for Pulse */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 191, 165, 0.7); }
            70% { box-shadow: 0 0 0 20px rgba(0, 191, 165, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 191, 165, 0); }
          }
        `}
      </style>
    </Box>
  );
};

export default Home;
