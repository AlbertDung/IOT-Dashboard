import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SensorsIcon sx={{ fontSize: 40, color: '#fff' }} />
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          IoT Dashboard
        </Typography>
      </Box>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          minWidth: { xs: 320, sm: 400 },
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
          background: '#fff',
        }}
      >
        {children}
      </Paper>
      <Typography variant="caption" sx={{ mt: 4, color: '#e3f2fd' }}>
        Group Project - HCMUAF
      </Typography>
    </Box>
  );
} 