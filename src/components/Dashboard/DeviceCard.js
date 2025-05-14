import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

function DeviceCard({ name, status, lastSeen }) {
  return (
    <Card sx={{ minWidth: 220, m: 1, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{name}</Typography>
          <Chip
            label={status ? 'Online' : 'Offline'}
            color={status ? 'success' : 'error'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Last seen: {lastSeen}
        </Typography>
        {/* Placeholder for quick actions */}
      </CardContent>
    </Card>
  );
}

export default DeviceCard; 