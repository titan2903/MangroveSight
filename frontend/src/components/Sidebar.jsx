import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import { askAI } from '../api';

const Sidebar = ({ 
  years, 
  selectedYear, 
  onYearChange, 
  stats,
  compareMode,
  setCompareMode,
  compareYear,
  setCompareYear,
  heatmapActive,
  setHeatmapActive,
  collapsed,
  onToggleCollapse,
  geoData,
  compareData
}) => {
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Format the Recharts data
  const chartData = stats?.epochs?.map(epoch => ({
    year: epoch.year,
    area: epoch.area_ha
  })) || [];

  const currentEpochStat = stats?.epochs?.find(e => e.year === selectedYear);
  const compareEpochStat = stats?.epochs?.find(e => e.year === compareYear);

  const handleAskAI = async () => {
    if (!currentEpochStat || !compareEpochStat) return;
    
    setAiLoading(true);
    setAiSummary('');
    try {
      const delta = currentEpochStat.area_ha - compareEpochStat.area_ha;
      const pct = (delta / compareEpochStat.area_ha) * 100;
      
      const prompt = `Dalam analisis perbandingan hutan mangrove Teluk Balikpapan antara tahun ${compareYear} (Luas: ${compareEpochStat.area_ha.toFixed(2)} ha) dan tahun ${selectedYear} (Luas: ${currentEpochStat.area_ha.toFixed(2)} ha), terjadi ${delta > 0 ? 'penambahan' : 'penurunan'} seluas ${Math.abs(delta).toFixed(2)} ha (${pct.toFixed(2)}%). Berikan kesimpulan singkat (maksimal 2 kalimat) tentang tren lingkungan ini dengan bahasa yang profesional namun mudah dipahami. WAJIB balas dalam Bahasa Indonesia.`;
      
      const response = await askAI(prompt);
      setAiSummary(response.answer);
    } catch (error) {
      console.error("AI Error:", error);
      setAiSummary("Maaf, gagal menghubungi asisten AI saat ini.");
    } finally {
      setAiLoading(false);
    }
  };

  const exportCSV = () => {
    if (!stats?.epochs) return;
    const header = "Tahun,Luas (ha),Perubahan (ha),Perubahan (%)\n";
    const rows = stats.epochs.map(e => `${e.year},${e.area_ha},${e.delta_ha || 0},${e.delta_pct || 0}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mangrove_stats.csv';
    a.click();
  };

  const exportGeoJSON = () => {
    const dataToExport = compareMode ? compareData : geoData;
    if (!dataToExport) return;
    const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mangrove_${selectedYear}${compareMode ? '_vs_'+compareYear : ''}.geojson`;
    a.click();
  };

  if (collapsed) {
    return (
      <Paper 
        elevation={4} 
        sx={{ 
          width: 60, 
          height: 60, 
          position: 'absolute', 
          top: '5vh', 
          left: 20, 
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={onToggleCollapse}
      >
        <MenuIcon sx={{ color: '#004D40' }} />
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        width: 350, 
        height: '90vh', 
        position: 'absolute', 
        top: '5vh', 
        left: 20, 
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        overflowY: 'auto',
        transition: 'all 0.3s ease'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004D40' }}>
            MangroveSight
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Pemantauan WebGIS
          </Typography>
        </Box>
        <IconButton onClick={onToggleCollapse} size="small" sx={{ color: '#004D40' }}>
          <MenuOpenIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Pilih Tahun
      </Typography>

      <FormControl fullWidth sx={{ mb: compareMode ? 2 : 4 }}>
        <InputLabel id="year-select-label">{compareMode ? "Tahun Dasar" : "Tahun Epoch"}</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear || ''}
          label={compareMode ? "Tahun Dasar" : "Tahun Epoch"}
          onChange={(e) => onYearChange(e.target.value)}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {compareMode && (
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="compare-year-select-label">Tahun Pembanding</InputLabel>
          <Select
            labelId="compare-year-select-label"
            value={compareYear || ''}
            label="Tahun Pembanding"
            onChange={(e) => setCompareYear(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Mode Analisis Tingkat Lanjut
      </Typography>
      
      <FormControlLabel
        control={
          <Switch 
            checked={compareMode} 
            onChange={(e) => {
              const isChecked = e.target.checked;
              setCompareMode(isChecked);
              if (isChecked) setHeatmapActive(false);
            }} 
            color="primary" 
          />
        }
        label={<Typography variant="body2">Mode Perbandingan (Change Detection)</Typography>}
        sx={{ mb: 1 }}
      />
      
      <FormControlLabel
        control={
          <Switch 
            checked={heatmapActive} 
            onChange={(e) => {
              const isChecked = e.target.checked;
              setHeatmapActive(isChecked);
              if (isChecked) setCompareMode(false);
            }} 
            color="secondary" 
          />
        }
        label={<Typography variant="body2">Heatmap Kepadatan</Typography>}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Statistik Area {selectedYear}
      </Typography>

      <Box sx={{ p: 2, bgcolor: 'rgba(0, 191, 165, 0.1)', borderRadius: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">Total Luas</Typography>
        <Typography variant="h4" sx={{ color: '#004D40', fontWeight: 'bold' }}>
          {currentEpochStat ? currentEpochStat.area_ha.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '-'} <Typography component="span" variant="body1">ha</Typography>
        </Typography>
      </Box>

      {!compareMode && currentEpochStat && currentEpochStat.delta_ha != null && currentEpochStat.delta_ha !== 0 && (
        <Box sx={{ p: 2, bgcolor: currentEpochStat.delta_ha > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', borderRadius: 2, mb: 4 }}>
          <Typography variant="body2" color="text.secondary">Perubahan dari sebelumnya</Typography>
          <Typography variant="h5" sx={{ color: currentEpochStat.delta_ha > 0 ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
            {currentEpochStat.delta_ha > 0 ? '+' : ''}
            {currentEpochStat.delta_ha.toLocaleString('id-ID', { maximumFractionDigits: 2 })} ha
            {currentEpochStat.delta_pct != null && (
              <> ({currentEpochStat.delta_pct > 0 ? '+' : ''}{currentEpochStat.delta_pct.toFixed(2)}%)</>
            )}
          </Typography>
        </Box>
      )}

      {compareMode && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">Legenda Perbandingan</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: '#FF5252', borderRadius: '50%', mr: 1 }} />
              <Typography variant="caption">Hilang (Loss)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: '#00E5FF', borderRadius: '50%', mr: 1 }} />
              <Typography variant="caption">Bertambah (Gain)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: '#00BFA5', borderRadius: '50%', mr: 1 }} />
              <Typography variant="caption">Tetap (Stable)</Typography>
            </Box>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={aiLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            onClick={handleAskAI}
            disabled={aiLoading}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            {aiLoading ? 'Menganalisis...' : '🤖 Jelaskan dengan AI'}
          </Button>

          {aiSummary && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="caption" sx={{ color: '#004D40', fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 1 }}>
                <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5 }} /> AI Summary
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                "{aiSummary}"
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 'auto' }}>
        Tren Perubahan Luas
      </Typography>
      
      <Box sx={{ height: 200, width: '100%', ml: -2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="year" fontSize={12} />
            <YAxis 
              domain={['dataMin - 1000', 'dataMax + 1000']} 
              fontSize={12} 
              tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
            />
            <RechartsTooltip 
              formatter={(value) => [`${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })} ha`, 'Luas Area']}
            />
            <Line 
              type="monotone" 
              dataKey="area" 
              stroke="#00BFA5" 
              strokeWidth={3}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<DownloadIcon />} 
          onClick={exportCSV}
          sx={{ flex: 1, textTransform: 'none' }}
        >
          CSV Stats
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<DownloadIcon />} 
          onClick={exportGeoJSON}
          disabled={!geoData && !compareData}
          sx={{ flex: 1, textTransform: 'none' }}
        >
          GeoJSON
        </Button>
      </Box>

    </Paper>
  );
};

export default Sidebar;
