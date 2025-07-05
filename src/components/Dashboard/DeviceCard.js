import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Chip, IconButton, Stack, 
  Tooltip, Fade, LinearProgress, Menu, MenuItem, Avatar, Divider
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';

function DeviceCard({ device, onDeviceAction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Mock device metrics for demonstration
  const deviceMetrics = {
    cpuUsage: Math.floor(Math.random() * 60) + 20,
    memoryUsage: Math.floor(Math.random() * 50) + 30,
    signalStrength: Math.floor(Math.random() * 40) + 60,
    uptime: `${Math.floor(Math.random() * 72) + 1}h ${Math.floor(Math.random() * 60)}m`,
    temperature: Math.floor(Math.random() * 20) + 35
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeviceAction = (action) => {
    setIsActionLoading(true);
    setAnchorEl(null);
    
    setTimeout(() => {
      setIsActionLoading(false);
      if (onDeviceAction) {
        onDeviceAction(action, device.name);
      }
    }, 1500);
  };

  const getSignalIcon = (strength) => {
    if (strength > 80) return <SignalWifi4BarIcon sx={{ color: '#4caf50' }} />;
    if (strength > 60) return <SignalWifi3BarIcon sx={{ color: '#8bc34a' }} />;
    if (strength > 40) return <SignalWifi2BarIcon sx={{ color: '#ff9800' }} />;
    return <SignalWifi1BarIcon sx={{ color: '#f44336' }} />;
  };

  const getSignalColor = (strength) => {
    if (strength > 80) return '#4caf50';
    if (strength > 60) return '#8bc34a';
    if (strength > 40) return '#ff9800';
    return '#f44336';
  };

  const getStatusColor = (status) => {
    return status ? '#4caf50' : '#f44336';
  };

  const getDeviceTypeEmoji = (name) => {
    if (name.toLowerCase().includes('esp8266')) return '📡';
    if (name.toLowerCase().includes('arduino')) return '🔧';
    if (name.toLowerCase().includes('raspberry')) return '🍓';
    return '🖥️';
  };

  return (
    <Fade in timeout={600}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
          border: `2px solid ${device.status ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`,
          boxShadow: device.status 
            ? '0 8px 32px rgba(76, 175, 80, 0.1)' 
            : '0 8px 32px rgba(244, 67, 54, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: device.status 
              ? '0 16px 48px rgba(76, 175, 80, 0.2)' 
              : '0 16px 48px rgba(244, 67, 54, 0.2)',
            '& .device-glow': {
              opacity: 1,
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: device.status 
              ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
              : 'linear-gradient(90deg, #f44336, #ff5722)',
            borderRadius: '20px 20px 0 0',
          }
        }}
      >
        {/* Glowing effect on hover */}
        <Box 
          className="device-glow"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${getStatusColor(device.status)}20 0%, transparent 70%)`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Loading overlay */}
        {isActionLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: '20px',
            }}
          >
            <LinearProgress 
              sx={{ 
                width: '60%',
                borderRadius: 2,
                height: 6,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                }
              }} 
            />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar 
                sx={{ 
                  bgcolor: getStatusColor(device.status),
                  width: 40, 
                  height: 40,
                  fontSize: '1.2rem',
                  animation: device.status ? 'pulse 3s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.8, transform: 'scale(1.05)' },
                  }
                }}
              >
                {getDeviceTypeEmoji(device.name)}
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#2d3748',
                    mb: 0.5
                  }}
                >
                  {device.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  {device.status ? (
                    <WifiIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                  ) : (
                    <WifiOffIcon sx={{ color: '#f44336', fontSize: 16 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {device.ip || 'Unknown IP'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Tooltip title="Device Actions">
              <IconButton 
                size="small" 
                onClick={handleMenuOpen}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status Section */}
          <Stack spacing={2.5}>
            {/* Main Status */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Connection Status
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Chip
                  label={device.status ? 'Online' : 'Offline'}
                  color={device.status ? 'success' : 'error'}
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
                {device.status && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {getSignalIcon(deviceMetrics.signalStrength)}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: getSignalColor(deviceMetrics.signalStrength),
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    >
                      {deviceMetrics.signalStrength}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Last Seen */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Last Activity
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Roboto Mono", monospace',
                  fontSize: '0.85rem',
                  color: '#4a5568'
                }}
              >
                {device.lastSeen}
              </Typography>
            </Box>

            {/* Device Metrics */}
            {device.status && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                  Performance
                </Typography>
                <Stack spacing={1.5}>
                  {/* CPU Usage */}
                  <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MemoryIcon sx={{ fontSize: 14, color: '#667eea' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          CPU
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        {deviceMetrics.cpuUsage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={deviceMetrics.cpuUsage} 
                      sx={{ 
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: deviceMetrics.cpuUsage > 70 ? '#f44336' : deviceMetrics.cpuUsage > 50 ? '#ff9800' : '#4caf50',
                          borderRadius: 2,
                        }
                      }} 
                    />
                  </Box>

                  {/* Memory Usage */}
                  <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <StorageIcon sx={{ fontSize: 14, color: '#667eea' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          Memory
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        {deviceMetrics.memoryUsage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={deviceMetrics.memoryUsage} 
                      sx={{ 
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: deviceMetrics.memoryUsage > 70 ? '#f44336' : deviceMetrics.memoryUsage > 50 ? '#ff9800' : '#4caf50',
                          borderRadius: 2,
                        }
                      }} 
                    />
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Uptime */}
            {device.status && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <SpeedIcon sx={{ fontSize: 14, color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Uptime:
                  </Typography>
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    color: '#4a5568'
                  }}
                >
                  {deviceMetrics.uptime}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Quick Action Buttons */}
          <Box display="flex" gap={1} mt={3}>
            <Tooltip title={device.status ? "Restart Device" : "Power On"}>
              <IconButton 
                size="small" 
                onClick={() => handleDeviceAction(device.status ? 'Restart' : 'Power On')}
                sx={{ 
                  bgcolor: device.status ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                  color: device.status ? '#ff9800' : '#4caf50',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: device.status ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                {device.status ? <RestartAltIcon fontSize="small" /> : <PowerSettingsNewIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Device Settings">
              <IconButton 
                size="small"
                onClick={() => handleDeviceAction('Configure')}
                sx={{ 
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>

        {/* Enhanced Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              minWidth: 180,
            }
          }}
        >
          <MenuItem 
            onClick={() => handleDeviceAction('Update Firmware')}
            sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}
          >
            <MemoryIcon sx={{ mr: 1.5, fontSize: 18 }} />
            Update Firmware
          </MenuItem>
          
          <MenuItem 
            onClick={() => handleDeviceAction('Factory Reset')}
            sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5, color: '#f44336' }}
          >
            <RestartAltIcon sx={{ mr: 1.5, fontSize: 18 }} />
            Factory Reset
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            onClick={() => handleDeviceAction('Remove Device')}
            sx={{ py: 1.5, borderRadius: '8px', mx: 1, color: '#f44336' }}
          >
            <PowerSettingsNewIcon sx={{ mr: 1.5, fontSize: 18 }} />
            Remove Device
          </MenuItem>
        </Menu>
      </Card>
    </Fade>
  );
}

export default DeviceCard; 