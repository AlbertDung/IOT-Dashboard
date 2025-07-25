import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, ButtonGroup, Button, Snackbar, Alert, 
  Fade, Zoom, Chip, Badge, IconButton, Stack, LinearProgress,
  Menu, MenuItem, Divider, Avatar
} from '@mui/material';
import ChartCard from './ChartCard';
import { Line, Bar, Pie } from 'react-chartjs-2';
import useSensorData from '../../hooks/useSensorData';
import { exportChartsData, exportSummaryStats, exportChartAsPNG } from '../../utils/exportUtils';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InsightsIcon from '@mui/icons-material/Insights';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const timeRanges = [
  { label: 'Day', value: 'day', icon: '📅' },
  { label: 'Week', value: 'week', icon: '📊' },
  { label: 'Month', value: 'month', icon: '📈' },
  { label: 'Year', value: 'year', icon: '📉' }
];

function Charts() {
  const [timeRange, setTimeRange] = useState('day');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalDataPoints: 0,
    avgTemperature: 0,
    avgHumidity: 0,
    avgLight: 0,
    trends: { temperature: 'stable', humidity: 'up', light: 'down' }
  });
  const [recentInsight, setRecentInsight] = useState('Temperature trending upward');

  const { history, error } = useSensorData();

  // Auto-sync indicator
  const [syncPulse, setSyncPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncPulse(true);
      generateAnalyticsInsight();
      setTimeout(() => setSyncPulse(false), 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Calculate analytics when data changes
  useEffect(() => {
    if (history && history.length > 0) {
      const totalPoints = history.length;
      const avgTemp = history.reduce((sum, d) => sum + (d.temperature || 0), 0) / totalPoints;
      const avgHum = history.reduce((sum, d) => sum + (d.humidity || 0), 0) / totalPoints;
      const avgLux = history.reduce((sum, d) => sum + (d.light || 0), 0) / totalPoints;
      
      setAnalytics({
        totalDataPoints: totalPoints,
        avgTemperature: avgTemp,
        avgHumidity: avgHum,
        avgLight: avgLux,
        trends: {
          temperature: avgTemp > 24 ? 'up' : avgTemp < 22 ? 'down' : 'stable',
          humidity: avgHum > 55 ? 'up' : avgHum < 45 ? 'down' : 'stable',
          light: avgLux > 400 ? 'up' : avgLux < 300 ? 'down' : 'stable'
        }
      });
    }
  }, [history]);

  const generateAnalyticsInsight = () => {
    const insights = [
      'Optimal lighting conditions detected',
      'Temperature within comfortable range',
      'Humidity levels are stable',
      'Peak activity hours identified',
      'Energy efficiency improved by 12%',
      'Environmental conditions optimal'
    ];
    setRecentInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    showNotification(`Analytics view changed to ${range}`, 'info');
    setRecentInsight(`Analyzing ${range} data trends`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showNotification('Refreshing analytics data...', 'info');
    setRecentInsight('Data refresh initiated');
    
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Analytics refreshed successfully!', 'success');
      generateAnalyticsInsight();
    }, 2000);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = async (format) => {
    setExportAnchorEl(null);
    showNotification(`Preparing ${format.toUpperCase()} export...`, 'info');
    
    try {
      let result;
      
      if (format === 'image') {
        // Export chart as image
        result = await exportChartAsPNG('charts-container', 'iot-analytics-charts');
      } else if (format === 'summary') {
        // Export summary statistics
        result = exportSummaryStats(history, 'pdf', 'analytics');
      } else {
        // Export raw data
        result = exportChartsData(history, format, timeRange);
      }
      
      if (result.success) {
        showNotification(result.message, 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showNotification(`Failed to export ${format.toUpperCase()}: ${error.message}`, 'error');
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
      case 'down': return <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />;
      default: return <TrendingUpIcon sx={{ fontSize: 16, color: '#9e9e9e', transform: 'rotate(90deg)' }} />;
    }
  };

  // Prepare enhanced chart data
  const labels = history.slice(-20).map(d => d.time ? new Date(d.time).toLocaleTimeString() : '');
  
  const lightData = {
    labels,
    datasets: [{
      label: 'Light Intensity',
      data: history.slice(-20).map(d => d.light),
      borderColor: 'rgba(102, 126, 234, 1)',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(102, 126, 234, 1)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const tempData = {
    labels,
    datasets: [{
      label: 'Temperature',
      data: history.slice(-20).map(d => d.temperature),
      backgroundColor: 'rgba(255, 107, 107, 0.8)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const humidityData = {
    labels: ['Low (20-40%)', 'Optimal (40-60%)', 'High (60-80%)', 'Very High (80%+)'],
    datasets: [{
      label: 'Humidity Distribution',
      data: [15, 45, 30, 10],
      backgroundColor: [
        'rgba(255, 152, 0, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(33, 150, 243, 0.8)',
        'rgba(156, 39, 176, 0.8)',
      ],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const enhancedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 16,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: true,
        borderColor: 'rgba(102, 126, 234, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(102, 126, 234, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: { size: 12 }
        }
      },
      x: { 
        grid: { display: false },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 }
        }
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      }
    }
  };

  return (
    <Box>
      {/* Enhanced Analytics Header */}
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
                    <AnalyticsIcon sx={{ fontSize: 40 }} />
                  </Badge>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 1 }}>
            Analytics Dashboard
          </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 300 }}>
                      Real-time sensor data analysis and insights
                    </Typography>
                  </Box>
                </Box>

                {recentInsight && (
                  <Fade in timeout={500}>
                    <Chip 
                      label={`💡 ${recentInsight}`}
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
                    startIcon={isRefreshing ? <CloudSyncIcon className="rotating" /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
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
                    {isRefreshing ? 'Analyzing...' : 'Refresh Data'}
                  </Button>

                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportClick}
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
                      }
                    }}
                  >
                    Export Data
                  </Button>

                  <Button 
                    variant="contained"
                    size="large"
                    startIcon={<InsightsIcon />}
                    onClick={() => showNotification('AI insights generated!', 'success')}
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
                    AI Insights
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
                      Analytics Overview
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#4caf50' }}>
                          {analytics.totalDataPoints}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Data Points
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                          {analytics.avgTemperature.toFixed(1)}°
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Avg Temp
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption">Temperature:</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getTrendIcon(analytics.trends.temperature)}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {analytics.trends.temperature}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption">Humidity:</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getTrendIcon(analytics.trends.humidity)}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {analytics.trends.humidity}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption">Light:</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getTrendIcon(analytics.trends.light)}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {analytics.trends.light}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
          </Grid>

          {/* Enhanced Export Menu */}
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
            PaperProps={{
              sx: {
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                minWidth: 220,
              }
            }}
          >
            <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600 }}>
              📊 Export Data ({history.length} records)
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={() => handleExport('csv')} sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}>
              📊 Export as CSV
            </MenuItem>
            <MenuItem onClick={() => handleExport('json')} sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}>
              📄 Export as JSON
            </MenuItem>
            <MenuItem onClick={() => handleExport('excel')} sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}>
              📈 Export as Excel
            </MenuItem>
            <MenuItem onClick={() => handleExport('pdf')} sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}>
              📕 Export as PDF
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => handleExport('summary')} sx={{ py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}>
              📋 Export Summary Report
            </MenuItem>
            <MenuItem onClick={() => handleExport('image')} sx={{ py: 1.5, borderRadius: '8px', mx: 1 }}>
              🖼️ Export Charts as Image
            </MenuItem>
          </Menu>
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

      {/* Enhanced Time Range Controls */}
      <Fade in timeout={1200}>
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
              📈 Data Analysis
            </Typography>
            
            <ButtonGroup size="large" variant="outlined" sx={{ borderRadius: '12px' }}>
            {timeRanges.map((range) => (
              <Button
                  key={range.value}
                  variant={timeRange === range.value ? 'contained' : 'outlined'}
                  onClick={() => handleTimeRangeChange(range.value)}
                  startIcon={<span style={{ fontSize: '1rem' }}>{range.icon}</span>}
                sx={{
                    minWidth: 120,
                    borderRadius: '12px !important',
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    bgcolor: timeRange === range.value ? '#667eea' : 'transparent',
                    borderColor: '#667eea',
                    color: timeRange === range.value ? 'white' : '#667eea',
                    '&:hover': {
                      bgcolor: timeRange === range.value ? '#667eea' : 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                    '&:not(:last-child)': { 
                      borderRight: timeRange === range.value ? 'none' : '1px solid #667eea' 
                    },
                  }}
                >
                  {range.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        </Paper>
      </Fade>

      {/* Enhanced Charts Grid */}
        {error ? (
        <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Fade in timeout={1400}>
          <Box id="charts-container">
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <ChartCard 
                title="💡 Light Intensity Analysis" 
                subtitle="Real-time luminosity monitoring"
                onInteraction={() => showNotification('Light intensity chart analyzed', 'info')}
              >
                <Box sx={{ height: 350 }}>
                  <Line 
                    key={JSON.stringify(lightData)}
                    data={lightData} 
                    options={{
                      ...enhancedChartOptions,
                      plugins: {
                        ...enhancedChartOptions.plugins,
                        tooltip: {
                          ...enhancedChartOptions.plugins.tooltip,
                          callbacks: {
                            label: (context) => `💡 Light: ${context.raw} lux`,
                          },
                        },
                      },
                    }} 
                  />
                </Box>
              </ChartCard>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <ChartCard 
                title="💧 Humidity Distribution" 
                subtitle="Environmental moisture levels"
                onInteraction={() => showNotification('Humidity data visualized', 'info')}
              >
                <Box sx={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', maxWidth: 350, height: '100%' }}>
                    <Pie 
                      key={JSON.stringify(humidityData)}
                      data={humidityData} 
                      options={{
                        ...enhancedChartOptions,
                        maintainAspectRatio: true,
                        plugins: {
                          ...enhancedChartOptions.plugins,
                          legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                              padding: 15,
                              usePointStyle: true,
                              pointStyle: 'circle',
                              font: { size: 12 },
                              color: 'rgba(0, 0, 0, 0.7)'
                            },
                          },
                          tooltip: {
                            ...enhancedChartOptions.plugins.tooltip,
                            callbacks: {
                              label: (context) => `💧 ${context.label}: ${context.raw}%`,
                            },
                          },
                        },
                      }} 
                    />
                  </Box>
                </Box>
              </ChartCard>
            </Grid>
            
            <Grid item xs={12}>
              <ChartCard 
                title="🌡️ Temperature Trends" 
                subtitle="Thermal monitoring and analysis"
                onInteraction={() => showNotification('Temperature trends analyzed', 'info')}
              >
                <Box sx={{ height: 300 }}>
                  <Bar 
                    key={JSON.stringify(tempData)}
                    data={tempData} 
                    options={{
                      ...enhancedChartOptions,
                      plugins: {
                        ...enhancedChartOptions.plugins,
                        tooltip: {
                          ...enhancedChartOptions.plugins.tooltip,
                          callbacks: {
                            label: (context) => `🌡️ Temperature: ${context.raw}°C`,
                          },
                        },
                      },
                    }} 
                  />
                </Box>
              </ChartCard>
            </Grid>
          </Grid>
          </Box>
        </Fade>
      )}

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

export default Charts; 