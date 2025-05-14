import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function SensorWidget({ name, value, unit, color }) {
  return (
    <Card sx={{ minWidth: 140, m: 1, boxShadow: 2, borderLeft: `6px solid ${color}` }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {name}
        </Typography>
        <Box display="flex" alignItems="baseline">
          <Typography variant="h5" sx={{ color, fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {unit}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SensorWidget; 