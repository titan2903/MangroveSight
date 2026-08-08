import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Slider, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Divider
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

const Sidebar = ({ years, selectedYear, onYearChange, stats }) => {
  
  // Format the Recharts data
  const chartData = stats?.epochs?.map(epoch => ({
    year: epoch.year,
    area: epoch.area_ha
  })) || [];

  const currentEpochStat = stats?.epochs?.find(e => e.year === selectedYear);

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
        overflowY: 'auto'
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004D40', mb: 1 }}>
        MangroveSight
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pemantauan WebGIS Teluk Balikpapan
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Pilih Tahun
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="year-select-label">Tahun Epoch</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear || ''}
          label="Tahun Epoch"
          onChange={(e) => onYearChange(e.target.value)}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Statistik Area {selectedYear}
      </Typography>

      <Box sx={{ p: 2, bgcolor: 'rgba(0, 191, 165, 0.1)', borderRadius: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">Total Luas</Typography>
        <Typography variant="h4" sx={{ color: '#004D40', fontWeight: 'bold' }}>
          {currentEpochStat ? currentEpochStat.area_ha.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '-'} <Typography component="span" variant="body1">ha</Typography>
        </Typography>
      </Box>

      {currentEpochStat && currentEpochStat.delta_ha != null && currentEpochStat.delta_ha !== 0 && (
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

    </Paper>
  );
};

export default Sidebar;
