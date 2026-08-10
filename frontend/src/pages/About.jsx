import React from 'react';
import { Box, Typography, Container, Grid, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const About = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ width: '100%', flex: 1, bgcolor: '#f4f6f8', py: 8 }}>
        <Container maxWidth="lg">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div variants={fadeUp}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#004D40', mb: 2 }}>
                Tentang MangroveSight
              </Typography>
              <Typography variant="h6" sx={{ color: '#607d8b', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                Platform Sistem Informasi Geografis (WebGIS) untuk memantau perubahan ekosistem lahan basah di Teluk Balikpapan.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {/* Latar Belakang */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div variants={fadeUp} style={{ height: '100%' }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,77,64,0.05)', border: '1px solid #e0f2f1' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004D40', mb: 3 }}>
                    Latar Belakang & Masalah
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#455a64', mb: 2, lineHeight: 1.8 }}>
                    Teluk Balikpapan mengalami degradasi ekosistem mangrove yang signifikan akibat tekanan industri seperti ekspansi migas, pembangunan pelabuhan, dan alih fungsi lahan lainnya. 
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#455a64', lineHeight: 1.8 }}>
                    Meskipun data pemantauan historis tersedia dari institusi global, data tersebut seringkali berupa raw file (shapefile/GeoTIFF) yang tidak mudah diakses oleh mahasiswa, peneliti, atau pemangku kepentingan lokal yang tidak memiliki latar belakang keahlian GIS.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* Solusi MangroveSight */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div variants={fadeUp} style={{ height: '100%' }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,77,64,0.05)', border: '1px solid #e0f2f1' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004D40', mb: 3 }}>
                    Solusi MangroveSight
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#455a64', mb: 2, lineHeight: 1.8 }}>
                    Tujuan proyek ini adalah menjembatani kesenjangan aksesibilitas data tersebut dengan menyediakan platform WebGIS interaktif yang mampu memvisualisasikan data perubahan temporal.
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#455a64', lineHeight: 1.8 }}>
                    Dengan arsitektur analisis yang dihitung sebelumnya (precomputed analytics), pengguna bisa mendapatkan <strong>insight geospasial secara instan</strong> — mulai dari heatmap kepadatan, tren penyusutan luas, hingga perbandingan antar-epoch dengan bantuan Gemini AI Assistant.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* Sumber Data */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div variants={fadeUp} style={{ height: '100%' }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,77,64,0.05)', border: '1px solid #e0f2f1' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004D40', mb: 3 }}>
                    Sumber Data (Global Mangrove Watch)
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#455a64', lineHeight: 1.8 }}>
                    Data set utama dalam platform ini menggunakan observasi citra satelit dari <strong>Global Mangrove Watch (GMW) v3.0</strong>. Dataset historis ini menutupi 10 epoch antara rentang waktu <strong>2007 hingga 2020</strong>. Data global mentah ini diproses (di-clip) menggunakan Python GDAL/Fiona untuk membatasi ruang lingkup observasi hanya pada *bounding box* Teluk Balikpapan demi efisiensi dan performa aplikasi.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* Metodologi AI */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div variants={fadeUp} style={{ height: '100%' }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,77,64,0.05)', border: '1px solid #e0f2f1' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004D40', mb: 3 }}>
                    Metodologi AI
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#455a64', lineHeight: 1.8 }}>
                    Implementasi kecerdasan buatan pada MangroveSight menghindari komputasi geospasial real-time (*on-the-fly* geometry reasoning) yang mahal dan tidak efisien. Sebaliknya, asisten menggunakan pendekatan <strong>RAG terstruktur dengan precomputed JSON context</strong> yang disuplai oleh backend. Ini menjamin akurasi angka dan menghindari fenomena halusinasi data kuantitatif oleh Large Language Model (LLM).
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* Tech Stack */}
            <Grid size={{ xs: 12 }}>
              <motion.div variants={fadeUp}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#004D40', color: 'white' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                    Arsitektur Teknologi (Tech Stack)
                  </Typography>
                  <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    {[
                      'React.js (Vite)', 
                      'Material UI', 
                      'Leaflet.js', 
                      'Recharts', 
                      'FastAPI (Python)', 
                      'PostgreSQL + PostGIS',
                      'Gemini AI Flash 2.0 API',
                      'GitHub Actions (CI/CD)',
                      'Heroku & Netlify'
                    ].map((tech, index) => (
                      <Grid key={index}>
                        <Box sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          border: '1px solid rgba(255,255,255,0.2)', 
                          px: 3, py: 1.5, 
                          borderRadius: 2,
                          backdropFilter: 'blur(5px)'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                            {tech}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

        </motion.div>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default About;
