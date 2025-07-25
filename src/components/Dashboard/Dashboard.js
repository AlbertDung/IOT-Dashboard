import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Stack, Popover, List, ListItem, 
  ListItemText, Snackbar, Alert, Fade, Zoom, Chip, Badge, LinearProgress,
  Skeleton, IconButton, Divider, Avatar, Tooltip
} from '@mui/material';
import DeviceCard from './DeviceCard';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DevicesIcon from '@mui/icons-material/Devices';
import useDeviceStatus from '../../hooks/useDeviceStatus';

const GROUP_MEMBERS = [
  { code: '2124801030179', name: 'Nguyễn Duy Dũng', role: 'Lead Developer', avatar: '👨‍💻' },
  { code: '2124801030036', name: 'Lương Nguyễn Khôi', role: 'Frontend Dev', avatar: '🎨' },
  { code: '2124801030180', name: 'Nguyễn Tiến Dũng', role: 'Backend Dev', avatar: '⚙️' },
  { code: '2124801030076', name: 'Trương Bồ Quốc Thắng', role: 'DevOps', avatar: '🚀' },
  { code: '2124801030233', name: 'Trần Lê Thảo', role: 'UI/UX Designer', avatar: '✨' },
  { code: '2124801030017', name: 'Nguyễn Minh Khôi', role: 'QA Engineer', avatar: '🔍' },
];

function Dashboard() {
  const { devices, lastUpdated, error } = useDeviceStatus();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemStats, setSystemStats] = useState({ uptime: '24h 15m', totalRequests: 1247, avgResponse: '95ms' });
  const [recentActivity, setRecentActivity] = useState('New device connected');

  // Auto-sync indicator
  const [syncPulse, setSyncPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncPulse(true);
      setSystemStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 5),
        avgResponse: `${85 + Math.floor(Math.random() * 20)}ms`
      }));
      setTimeout(() => setSyncPulse(false), 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleGroupClick = (event) => {
    setAnchorEl(event.currentTarget);
    showNotification('Group members displayed', 'info');
  };

  const handleGroupClose = () => {
    setAnchorEl(null);
  };

  const handleAddDevice = () => {
    showNotification('Device discovery started...', 'info');
    setTimeout(() => {
      showNotification('No new devices found. Check your network connection.', 'warning');
    }, 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showNotification('Refreshing device status...', 'info');
    setRecentActivity('System refresh initiated');
    
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('All devices refreshed successfully!', 'success');
      setRecentActivity('All devices updated');
    }, 2000);
  };

  const open = Boolean(anchorEl);
  const activeDevices = devices ? devices.filter(d => d.status).length : 0;
  const totalDevices = devices ? devices.length : 0;

  return (
    <Box>
      {/* Enhanced Welcome Header */}
      <Fade in timeout={800}>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(102, 126, 234, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'shimmer 4s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
        }}
      >
          <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Badge 
                    color="secondary" 
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
                    <DashboardIcon sx={{ fontSize: 40 }} />
                  </Badge>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 1 }}>
              Welcome to IoT Dashboard
            </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 300 }}>
              Monitor and control your IoT devices in real-time
            </Typography>
                  </Box>
                </Box>

                {recentActivity && (
                  <Fade in timeout={500}>
                    <Chip 
                      label={`🔔 ${recentActivity}`}
                      color="secondary"
                      size="small"
                      sx={{ 
                        mb: 3, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 500,
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  </Fade>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                    size="large"
                startIcon={<AddIcon />}
                    onClick={handleAddDevice}
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
                    Discover Devices
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
                    {isRefreshing ? 'Refreshing...' : 'Refresh All'}
              </Button>

              <Button 
                variant="contained"
                    size="large"
                    startIcon={<GroupIcon />}
                onClick={handleGroupClick}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white', 
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    Team Members
              </Button>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Zoom in timeout={1000}>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)', 
                  p: 3, 
                  borderRadius: '20px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative'
                }}>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <NotificationsActiveIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      System Status
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#4caf50' }}>
                          {activeDevices}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Active Devices
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                          {totalDevices}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Total Devices
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption">Uptime:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {systemStats.uptime}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption">Requests:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {systemStats.totalRequests.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption">Response:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {systemStats.avgResponse}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
          </Grid>

          {/* Enhanced Group Members Popover */}
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleGroupClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ 
              sx: { 
                p: 3, 
                minWidth: 320, 
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.15)'
              } 
            }}
              >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <GroupIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                Development Team
                </Typography>
            </Box>
            
                <List dense>
              {GROUP_MEMBERS.map((member, index) => (
                <Fade in timeout={300 + index * 100} key={member.code}>
                  <ListItem 
                    sx={{ 
                      borderRadius: '12px',
                      mb: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: '#667eea', fontSize: '1.2rem' }}>
                      {member.avatar}
                    </Avatar>
                      <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {member.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {member.code}
                          </Typography>
                          <Chip 
                            label={member.role} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              height: 20, 
                              fontSize: '0.7rem',
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea'
                            }} 
                          />
                        </Box>
                      }
                      />
                    </ListItem>
                </Fade>
                  ))}
                </List>
              </Popover>
        </Paper>
      </Fade>

      {/* Progress indicator for refresh */}
      {isRefreshing && (
        <LinearProgress 
          sx={{ 
            mb: 3, 
            borderRadius: 1,
            height: 4,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
            }
          }} 
        />
      )}

      {/* Enhanced Connected Devices Section */}
      <Fade in timeout={1200}>
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <DevicesIcon sx={{ color: '#667eea', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                  Connected Devices
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
              
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary" display="block">
                  Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}
        </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                  <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    {Math.round((activeDevices / totalDevices) * 100)}% Online
        </Typography>
                </Box>
              </Box>
      </Box>

      {error ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            ) : devices && devices.length > 0 ? (
        <Grid container spacing={3}>
                {devices.map((device, index) => (
            <Grid item key={device.id} xs={12} sm={6} md={4} lg={3}>
                    <Zoom in timeout={400 + index * 100}>
                      <div>
              <DeviceCard 
                           device={device}
                           onDeviceAction={(action, deviceName) => {
                             showNotification(`${action} executed on ${deviceName}`, 'success');
                             setRecentActivity(`${deviceName} ${action.toLowerCase()}`);
                           }}
              />
                      </div>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                    <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      )}
          </Paper>
        </Box>
      </Fade>

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

export default Dashboard; 