import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Stack, Popover, List, ListItem, ListItemText } from '@mui/material';
import DeviceCard from './DeviceCard';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import useDeviceStatus from '../../hooks/useDeviceStatus';

const GROUP_MEMBERS = [
  { code: '2124801030179', name: 'Nguyễn Duy Dũng' },
  { code: '2124801030036', name: 'Lương Nguyễn Khôi' },
  { code: '2124801030180', name: 'Nguyễn Tiến Dũng' },
  { code: '2124801030076', name: 'Trương Bồ Quốc Thắng' },
  { code: '2124801030233', name: 'Trần Lê Thảo' },
  { code: '2124801030017', name: 'Nguyễn Minh Khôi' },
];

function Dashboard() {
  const { devices, lastUpdated, error } = useDeviceStatus();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleGroupClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleGroupClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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
              <Button 
                variant="contained"
                sx={{ bgcolor: '#fff', color: 'primary.main', fontWeight: 600 }}
                onClick={handleGroupClick}
              >
                Group Members
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleGroupClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { p: 2, minWidth: 260 } }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Group Members
                </Typography>
                <List dense>
                  {GROUP_MEMBERS.map(member => (
                    <ListItem key={member.code}>
                      <ListItemText
                        primary={member.name}
                        secondary={member.code}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Popover>
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
                Active Devices: {devices ? devices.filter(d => d.status).length : 0}
              </Typography>
              <Typography variant="body2">
                Total Devices: {devices ? devices.length : 0}
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
          Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'N/A'}
        </Typography>
      </Box>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {devices && devices.map(device => (
            <Grid item key={device.id} xs={12} sm={6} md={4} lg={3}>
              <DeviceCard 
                name={device.name} 
                status={device.status} 
                lastSeen={device.lastSeen} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard; 