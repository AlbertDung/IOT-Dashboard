import React from 'react';
import { Box, Typography, Grid, Paper, Button, Stack } from '@mui/material';
import DeviceCard from './DeviceCard';
import devices from '../../mock/devices';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

function Dashboard() {
  return (
    <Box>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome to IoT Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
              Monitor and control your IoT devices in real-time
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Add Device
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
                Active Devices: {devices.filter(d => d.status).length}
              </Typography>
              <Typography variant="body2">
                Total Devices: {devices.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Connected Devices
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {devices.map(device => (
          <Grid item key={device.id} xs={12} sm={6} md={4} lg={3}>
            <DeviceCard 
              name={device.name} 
              status={device.status} 
              lastSeen={device.lastSeen} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard; 