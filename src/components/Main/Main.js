import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, Stack, Divider, 
  Snackbar, Alert, Fade, Zoom, Chip, Badge, IconButton,
  Skeleton, LinearProgress
} from '@mui/material';
import SensorWidget from './SensorWidget';
import ControlToggle from './ControlToggle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useSensorData from '../../hooks/useSensorData';

function Main() {
  const [led1, setLed1] = useState(false);
  const [led2, setLed2] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [systemStatus, setSystemStatus] = useState('online');
  const [lastAction, setLastAction] = useState('');
  const { latest, max, error } = useSensorData();

  // Auto-sync indicator
  const [syncPulse, setSyncPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setSyncPulse(true), 3000);
    const timeout = setTimeout(() => setSyncPulse(false), 500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [syncPulse]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLastAction('Data refreshed');
    showNotification('Refreshing sensor data...', 'info');
    
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Data refreshed successfully!', 'success');
    }, 1500);
  };

  const handleTurnAllOff = () => {
    setLed1(false);
    setLed2(false);
    setAutoMode(false);
    setLastAction('All devices turned off');
    showNotification('All devices turned off', 'warning');
  };

  const handleControlChange = (control, value) => {
    // eslint-disable-next-line default-case
    switch(control) {
      case 'led1':
        setLed1(value);
        setLastAction(`LED 1 ${value ? 'ON' : 'OFF'}`);
        showNotification(`LED 1 turned ${value ? 'ON' : 'OFF'}`, value ? 'success' : 'info');
        break;
      case 'led2':
        setLed2(value);
        setLastAction(`LED 2 ${value ? 'ON' : 'OFF'}`);
        showNotification(`LED 2 turned ${value ? 'ON' : 'OFF'}`, value ? 'success' : 'info');
        break;
      case 'auto':
        setAutoMode(value);
        setLastAction(`Auto Mode ${value ? 'ENABLED' : 'DISABLED'}`);
        showNotification(`Auto Mode ${value ? 'enabled' : 'disabled'}`, 'info');
        if (value) {
          // Simulate auto mode behavior
          setTimeout(() => {
            setLed1(latest?.light < 300);
            setLed2(latest?.temperature > 27);
            showNotification('Auto adjustments applied', 'success');
          }, 1000);
        }
        break;
    }
  };

  const activeDevices = [led1, led2, autoMode].filter(Boolean).length;
  const getSystemStatusColor = () => {
    if (error) return '#f44336';
    if (activeDevices > 0) return '#4caf50';
    return '#ff9800';
  };

  return (
    <Box>
      {/* Enhanced Device Control Center Header */}
      <Fade in timeout={800}>
        <Paper 
          elevation={8}
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'shimmer 3s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                  🎛️ Device Control Center
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95, mb: 3, fontWeight: 300 }}>
                  Monitor and control your IoT devices in real-time
                </Typography>
                
                {lastAction && (
                  <Fade in timeout={500}>
                    <Chip 
                      label={`Last Action: ${lastAction}`}
                      color="secondary"
                      size="small"
                      sx={{ 
                        mb: 3, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Fade>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PowerSettingsNewIcon />}
                    onClick={handleTurnAllOff}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    Emergency Stop
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={isRefreshing ? <CloudSyncIcon className="rotating" /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: 'white',
                      fontWeight: 500,
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-1px)',
                      },
                      '& .rotating': {
                        animation: 'rotate 1s linear infinite',
                      },
                      '@keyframes rotate': {
                        from: { transform: 'rotate(0deg)' },
                        to: { transform: 'rotate(360deg)' },
                      }
                    }}
                  >
                    {isRefreshing ? 'Syncing...' : 'Refresh Data'}
                  </Button>
                  
                  <IconButton
                    sx={{
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Zoom in timeout={1000}>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)', 
                  p: 3, 
                  borderRadius: '16px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative'
                }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Badge 
                      color="success" 
                      variant="dot" 
                      invisible={!syncPulse}
                      sx={{
                        '& .MuiBadge-badge': {
                          animation: syncPulse ? 'pulse 0.5s ease-in-out' : 'none',
                        },
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(0.8)', opacity: 0.5 },
                          '50%': { transform: 'scale(1.2)', opacity: 1 },
                          '100%': { transform: 'scale(0.8)', opacity: 0.5 },
                        }
                      }}
                    >
                      <NotificationsActiveIcon />
                    </Badge>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      System Status
                    </Typography>
                  </Box>
                  
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Active Devices:</Typography>
                      <Chip 
                        label={activeDevices} 
                        size="small" 
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Connection:</Typography>
                      <Chip 
                        label="Online" 
                        size="small" 
                        sx={{ 
                          bgcolor: getSystemStatusColor(),
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Last Update: {new Date().toLocaleTimeString()}
                    </Typography>
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Progress indicator for refresh */}
      {isRefreshing && (
        <LinearProgress 
          sx={{ 
            mb: 2, 
            borderRadius: 1,
            height: 3,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
            }
          }} 
        />
      )}

      <Grid container spacing={3}>
        {/* Enhanced Sensor Readings */}
        <Grid item xs={12} md={8}>
          <Fade in timeout={1200}>
            <Paper 
              elevation={6}
              sx={{ 
                p: 3, 
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                  📊 Sensor Readings
                </Typography>
                {syncPulse && (
                  <Chip 
                    label="Live" 
                    size="small" 
                    color="success"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>
              
              {error ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              ) : latest ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <SensorWidget 
                      name="Temperature" 
                      value={latest?.temperature} 
                      unit="°C" 
                      color="#ff6b6b" 
                      max={max?.temperature}
                      trend={latest?.temperature > 25 ? 'up' : 'down'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SensorWidget 
                      name="Humidity" 
                      value={latest?.humidity} 
                      unit="%" 
                      color="#4ecdc4" 
                      max={max?.humidity}
                      trend={latest?.humidity > 50 ? 'up' : 'down'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SensorWidget 
                      name="Light" 
                      value={latest?.light} 
                      unit="lux" 
                      color="#ffe66d" 
                      max={max?.light}
                      trend={latest?.light > 400 ? 'up' : 'down'}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  {[1, 2, 3].map((i) => (
                    <Grid item xs={12} sm={4} key={i}>
                      <Skeleton variant="rounded" height={120} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Fade>
        </Grid>

        {/* Enhanced Device Controls */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={1400}>
            <Paper 
              elevation={6}
              sx={{ 
                p: 3, 
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2d3748', mb: 3 }}>
                🎮 Device Controls
              </Typography>
              
              <Stack spacing={3}>
                <ControlToggle 
                  label="🤖 Auto Mode" 
                  checked={autoMode} 
                  onChange={(e) => handleControlChange('auto', e.target.checked)}
                  description="Automatic light adjustment"
                />
                
                <Divider sx={{ my: 2 }} />
                
                <ControlToggle 
                  label="💡 LED 1" 
                  checked={led1} 
                  onChange={(e) => handleControlChange('led1', e.target.checked)}
                  description="Main lighting control"
                />
                
                <ControlToggle 
                  label="🔆 LED 2" 
                  checked={led2} 
                  onChange={(e) => handleControlChange('led2', e.target.checked)}
                  description="Secondary lighting"
                />
              </Stack>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Enhanced Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          variant="filled"
          sx={{ 
            borderRadius: 2,
            fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Main; 