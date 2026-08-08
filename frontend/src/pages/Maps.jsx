import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import MapViewer from '../components/MapViewer';
import Sidebar from '../components/Sidebar';
import ChatAssistant from '../components/ChatAssistant';
import { fetchAvailableYears, fetchStats, fetchMangroveGeoJSON } from '../api';

const Maps = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [stats, setStats] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Initial Load: Fetch years and stats
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const availableYears = await fetchAvailableYears();
        setYears(availableYears);
        
        const fullStats = await fetchStats();
        setStats(fullStats);

        if (availableYears.length > 0) {
          // Select the latest year by default
          setSelectedYear(availableYears[availableYears.length - 1]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  // When selectedYear changes, fetch the GeoJSON for that year
  useEffect(() => {
    if (!selectedYear) return;

    const loadGeoData = async () => {
      setMapLoading(true);
      try {
        const data = await fetchMangroveGeoJSON(selectedYear);
        setGeoData(data);
      } catch (error) {
        console.error(`Error loading GeoJSON for ${selectedYear}:`, error);
      } finally {
        setMapLoading(false);
      }
    };

    loadGeoData();
  }, [selectedYear]);

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
      <Sidebar 
        years={years} 
        selectedYear={selectedYear} 
        onYearChange={setSelectedYear} 
        stats={stats} 
      />
      <MapViewer 
        data={geoData} 
        loading={mapLoading} 
        year={selectedYear} 
      />
      <ChatAssistant />
    </Box>
  );
};

export default Maps;
