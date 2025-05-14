import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function ChartCard({ title, children }) {
  return (
    <Card sx={{ minWidth: 300, m: 1, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCard; 