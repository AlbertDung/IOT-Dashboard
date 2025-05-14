import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Stack, Divider } from '@mui/material';
import SensorWidget from './SensorWidget';
import ControlToggle from './ControlToggle';
import sensors from '../../mock/sensors';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';

function Main() {
  const [led1, setLed1] = useState(false);
  const [led2, setLed2] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(135deg, #7b1fa2 0%, #2196f3 100%)',
          color: '#fff'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Device Control Center
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 3 }}>
              Monitor and control your IoT devices in real-time
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<PowerSettingsNewIcon />}
                onClick={() => {
                  setLed1(false);
                  setLed2(false);
                }}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Turn All Off
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Settings
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              p: 3, 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h6" gutterBottom>System Status</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Active Devices: 2
              </Typography>
              <Typography variant="body2">
                Last Update: {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Sensor Readings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <SensorWidget 
                  name="Temperature" 
                  value={sensors.temperature} 
                  unit="°C" 
                  color="#e53935" 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SensorWidget 
                  name="Humidity" 
                  value={sensors.humidity} 
                  unit="%" 
                  color="#1e88e5" 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SensorWidget 
                  name="Light" 
                  value={sensors.light} 
                  unit="lux" 
                  color="#fbc02d" 
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Device Controls
            </Typography>
            <Stack spacing={2}>
              <ControlToggle 
                label="Auto Mode" 
                checked={autoMode} 
                onChange={() => setAutoMode(v => !v)} 
              />
              <Divider />
              <ControlToggle 
                label="LED 1" 
                checked={led1} 
                onChange={() => setLed1(v => !v)} 
              />
              <ControlToggle 
                label="LED 2" 
                checked={led2} 
                onChange={() => setLed2(v => !v)} 
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Main; 