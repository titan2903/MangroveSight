import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ bgcolor: '#004D40', height: '64px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapIcon /> MangroveSight
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
            sx={{ 
              borderBottom: location.pathname === '/' ? '2px solid #00BFA5' : '2px solid transparent',
              borderRadius: 0
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/maps"
            startIcon={<MapIcon />}
            sx={{ 
              borderBottom: location.pathname === '/maps' ? '2px solid #00BFA5' : '2px solid transparent',
              borderRadius: 0
            }}
          >
            Maps
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
