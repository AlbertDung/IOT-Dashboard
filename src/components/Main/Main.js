import React, { useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import SensorWidget from './SensorWidget';
import ControlToggle from './ControlToggle';
import sensors from '../../mock/sensors';

function Main() {
  const [led1, setLed1] = useState(false);
  const [led2, setLed2] = useState(false);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #7b1fa2 0%, #2196f3 100%)', color: '#fff' }}>
        <Typography variant="h6">Điều khiển thiết bị</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item><SensorWidget name="Nhiệt độ" value={sensors.temperature} unit="°C" color="#e53935" /></Grid>
          <Grid item><SensorWidget name="Độ ẩm" value={sensors.humidity} unit="%" color="#1e88e5" /></Grid>
          <Grid item><SensorWidget name="Ánh sáng" value={sensors.light} unit="lux" color="#fbc02d" /></Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Các thiết bị</Typography>
          <ControlToggle label="Đèn 1" checked={led1} onChange={() => setLed1(v => !v)} />
          <ControlToggle label="Đèn 2" checked={led2} onChange={() => setLed2(v => !v)} />
        </Box>
      </Paper>
    </Box>
  );
}

export default Main; 