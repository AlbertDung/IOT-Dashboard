import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Stack } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

function DeviceCard({ name, status, lastSeen }) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            {status ? (
              <WifiIcon sx={{ color: 'success.main', mr: 1 }} />
            ) : (
              <WifiOffIcon sx={{ color: 'error.main', mr: 1 }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={status ? 'Online' : 'Offline'}
              color={status ? 'success' : 'error'}
              size="small"
              sx={{ 
                borderRadius: '6px',
                fontWeight: 500
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last Seen
            </Typography>
            <Typography variant="body2">
              {lastSeen}
            </Typography>
          </Box>

          <Box display="flex" gap={1} mt={1}>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'primary.light',
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.light' }
              }}
            >
              <PowerSettingsNewIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              sx={{ 
                bgcolor: 'grey.100',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'grey.200' }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DeviceCard; 