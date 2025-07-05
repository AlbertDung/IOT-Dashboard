import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Grow, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

function SensorWidget({ name, value, unit, color, max, trend, description }) {
  // Format number to reasonable decimal places
  const formatValue = (val) => {
    if (val === null || val === undefined) return '--';
    return parseFloat(val).toFixed(1);
  };

  const getStatus = (value, name) => {
    if (!value && value !== 0) return { status: 'No Data', color: '#9e9e9e' };
    
    if (name === 'Temperature') {
      if (value > 30) return { status: 'High', color: '#f44336' };
      if (value < 20) return { status: 'Low', color: '#2196f3' };
      return { status: 'Normal', color: '#4caf50' };
    }
    if (name === 'Humidity') {
      if (value > 70) return { status: 'High', color: '#f44336' };
      if (value < 30) return { status: 'Low', color: '#ff9800' };
      return { status: 'Normal', color: '#4caf50' };
    }
    if (name === 'Light') {
      if (value > 800) return { status: 'Bright', color: '#ff9800' };
      if (value < 200) return { status: 'Dark', color: '#3f51b5' };
      return { status: 'Normal', color: '#4caf50' };
    }
    return { status: 'Normal', color: '#4caf50' };
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
      case 'down': return <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />;
      default: return <TrendingFlatIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />;
    }
  };

  const { status, color: statusColor } = getStatus(value, name);
  const progress = name === 'Temperature' 
    ? Math.max(0, Math.min(100, ((value - 15) / 20) * 100))
    : name === 'Humidity' 
      ? Math.max(0, Math.min(100, value || 0))
      : Math.max(0, Math.min(100, ((value || 0) / 1500) * 100));

  const getProgressColor = () => {
    if (progress > 80) return '#f44336';
    if (progress > 60) return '#ff9800';
    return color;
  };

  return (
    <Grow in timeout={600}>
      <Card 
        sx={{ 
          height: '100%',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
          border: '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            '& .sensor-glow': {
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
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: '16px 16px 0 0',
          }
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative' }}>
          {/* Glowing effect on hover */}
          <Box 
            className="sensor-glow"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: color,
                  animation: value ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.7, transform: 'scale(1.2)' },
                  }
                }}
              />
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {name}
              </Typography>
            </Box>
            {trend && getTrendIcon(trend)}
          </Box>

          {/* Value Display */}
          <Box display="flex" alignItems="baseline" mb={2}>
            <Typography 
              variant="h3" 
              sx={{ 
                color,
                fontWeight: 800,
                lineHeight: 1,
                fontFamily: '"Roboto Mono", monospace',
                textShadow: `0 1px 3px ${color}30`,
              }}
            >
              {formatValue(value)}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                ml: 1,
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '1rem'
              }}
            >
              {unit}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getProgressColor(),
                  borderRadius: 4,
                  transition: 'all 0.5s ease',
                }
              }} 
            />
          </Box>

          {/* Status and Info */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Chip 
              label={status}
              size="small"
              sx={{ 
                bgcolor: `${statusColor}15`,
                color: statusColor,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1.5
                }
              }}
            />
            
            {progress > 0 && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: '0.7rem'
                }}
              >
                {Math.round(progress)}%
              </Typography>
            )}
          </Box>

          {/* Max Value Info */}
          {max !== undefined && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mt: 1, 
                display: 'block',
                fontSize: '0.7rem',
                opacity: 0.7
              }}
            >
              Peak: {formatValue(max)} {unit}
            </Typography>
          )}

          {/* Description */}
          {description && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mt: 0.5, 
                display: 'block',
                fontSize: '0.7rem',
                fontStyle: 'italic'
              }}
            >
              {description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
}

export default SensorWidget; 