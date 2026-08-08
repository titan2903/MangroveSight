import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Maps from './pages/Maps';
import './App.css';

// Create a premium Mangrove-inspired Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#004D40', // Deep Forest Green
      light: '#00BFA5', // Emerald
    },
    secondary: {
      main: '#0277BD', // Ocean Blue
    },
    background: {
      default: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/maps" element={<Maps />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
