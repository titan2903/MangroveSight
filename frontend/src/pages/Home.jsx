import React from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, Paper, Divider, Button } from '@mui/material';

// Import images
import img1 from '../images/mangrove-teluk-balikpapan-IMG_0595-1200x800.jpg';
import img2 from '../images/Pembukan-mangrove-pt-MMP-Pokja-Pesisir2.jpg';
import img3 from '../images/hutan_mangrove.jpeg';

const Home = () => {
  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f5f5', pb: 8 }}>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          width: '100%', 
          height: '400px', 
          backgroundImage: `linear-gradient(rgba(0, 77, 64, 0.7), rgba(0, 77, 64, 0.7)), url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          px: 3
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          MangroveSight
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: '800px', opacity: 0.9 }}>
          Memantau Dinamika Perubahan Tutupan Lahan Hutan Mangrove di Teluk Balikpapan (2007 - 2020)
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
          
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h4" sx={{ color: '#004D40', fontWeight: 'bold', mb: 3 }}>
                Hutan Mangrove Teluk Balikpapan
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                Teluk Balikpapan merupakan salah satu kawasan perairan yang kaya akan keanekaragaman hayati di Kalimantan Timur. 
                Ekosistem mangrove di kawasan ini memiliki peranan sangat vital dalam menjaga kestabilan garis pantai, menahan abrasi, serta menjadi habitat penting bagi berbagai spesies endemik seperti Bekantan (<i>Nasalis larvatus</i>).
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                Namun, seiring dengan pesatnya pembangunan infrastruktur dan pembukaan lahan industri, keberadaan hutan mangrove di Teluk Balikpapan semakin terancam.
                Deforestasi lahan basah ini memicu kekhawatiran terkait dampak lingkungan jangka panjang.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                Melalui <b>MangroveSight</b>, kami menyajikan platform WebGIS cerdas yang mengintegrasikan data spasial multi-temporal (2007 hingga 2020) dengan AI. 
                Tujuannya adalah untuk mempermudah para peneliti, pemerintah, maupun masyarakat umum dalam mengamati, menganalisis, dan mengambil keputusan berbasis data terkait konservasi mangrove.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 4, mb: 4 }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={img3}
                  alt="Hutan Mangrove"
                />
                <CardContent sx={{ bgcolor: '#004D40', color: 'white' }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Kawasan ekosistem lahan basah Teluk Balikpapan.
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={img2}
                  alt="Kerusakan Mangrove"
                />
                <CardContent sx={{ bgcolor: '#C62828', color: 'white' }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Ancaman deforestasi dan alih fungsi lahan.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 6 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#004D40', fontWeight: 'bold', mb: 2 }}>
              Jelajahi Peta Spasial Kami
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              Lihat secara langsung bagaimana luas mangrove berubah dari tahun ke tahun melalui peta interaktif kami.
            </Typography>
            <Button 
              href="/maps"
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: '#00BFA5', 
                color: '#fff',
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem',
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 14px 0 rgba(0, 191, 165, 0.39)',
                '&:hover': {
                  bgcolor: '#004D40'
                }
              }}
            >
              Buka WebGIS MangroveSight
            </Button>
          </Box>
          
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
