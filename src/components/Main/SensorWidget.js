import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function SensorWidget({ name, value, unit, color, max }) {
  const getStatus = (value, name) => {
    if (name === 'Temperature') {
      if (value > 30) return { status: 'High', icon: <TrendingUpIcon color="error" /> };
      if (value < 20) return { status: 'Low', icon: <TrendingDownIcon color="warning" /> };
      return { status: 'Normal', icon: null };
    }
    if (name === 'Humidity') {
      if (value > 60) return { status: 'High', icon: <TrendingUpIcon color="error" /> };
      if (value < 30) return { status: 'Low', icon: <TrendingDownIcon color="warning" /> };
      return { status: 'Normal', icon: null };
    }
    if (name === 'Light') {
      if (value > 1000) return { status: 'High', icon: <TrendingUpIcon color="warning" /> };
      if (value < 200) return { status: 'Low', icon: <TrendingDownIcon color="error" /> };
      return { status: 'Normal', icon: null };
    }
    return { status: 'Normal', icon: null };
  };

  const { status, icon } = getStatus(value, name);
  const progress = name === 'Temperature' 
    ? ((value - 15) / 20) * 100 
    : name === 'Humidity' 
      ? value 
      : (value / 1500) * 100;

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: 8,
                height: 8,
                bgcolor: color,
                borderRadius: '50%',
                mr: 1,
              }
            }}
          >
            {name}
          </Typography>
          {icon}
        </Box>

        <Box display="flex" alignItems="baseline" mb={1}>
          <Typography 
            variant="h4" 
            sx={{ 
              color,
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1,
              color: 'text.secondary'
            }}
          >
            {unit}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
              }
            }} 
          />
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          Status: {status}
        </Typography>
        {max !== undefined && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Max: {max} {unit}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default SensorWidget; 