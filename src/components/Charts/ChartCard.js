import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function ChartCard({ title, children }) {
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
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: 4,
                height: 16,
                bgcolor: 'primary.main',
                borderRadius: 2,
                mr: 1,
              }
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCard; 