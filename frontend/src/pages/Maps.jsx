import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import MapViewer from '../components/MapViewer';
import Sidebar from '../components/Sidebar';
import ChatAssistant from '../components/ChatAssistant';
import { fetchAvailableYears, fetchStats, fetchMangroveGeoJSON, fetchMangroveComparison, fetchMangroveHeatmap } from '../api';

const Maps = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [compareYear, setCompareYear] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [heatmapActive, setHeatmapActive] = useState(false);

  const [stats, setStats] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);

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
          setSelectedYear(availableYears[availableYears.length - 1]);
          setCompareYear(availableYears[0]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  // Fetch data based on modes
  useEffect(() => {
    if (!selectedYear) return;

    const loadData = async () => {
      setMapLoading(true);
      try {
        if (compareMode && compareYear) {
          const compData = await fetchMangroveComparison(selectedYear, compareYear);
          setCompareData(compData);
          setGeoData(null);
        } else {
          const data = await fetchMangroveGeoJSON(selectedYear);
          setGeoData(data);
          setCompareData(null);
        }

        if (heatmapActive) {
          const heatData = await fetchMangroveHeatmap(selectedYear);
          setHeatmapData(heatData);
        } else {
          setHeatmapData(null);
        }
      } catch (error) {
        console.error(`Error loading map data:`, error);
      } finally {
        setMapLoading(false);
      }
    };

    loadData();
  }, [selectedYear, compareYear, compareMode, heatmapActive]);

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
      <Sidebar
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        stats={stats}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        compareYear={compareYear}
        setCompareYear={setCompareYear}
        heatmapActive={heatmapActive}
        setHeatmapActive={setHeatmapActive}
      />
      <MapViewer
        data={geoData}
        compareData={compareData}
        heatmapData={heatmapData}
        loading={mapLoading}
        year={selectedYear}
        compareYear={compareYear}
        compareMode={compareMode}
      />
      <ChatAssistant />
    </Box>
  );
};

export default Maps;
