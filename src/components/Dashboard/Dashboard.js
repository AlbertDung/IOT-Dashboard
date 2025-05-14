import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import DeviceCard from './DeviceCard';
import devices from '../../mock/devices';

function Dashboard() {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', color: '#fff' }}>
        <Typography variant="h5" gutterBottom>Chào mừng bạn đến với bài thực hành của nhóm PHATPT chúng tôi!</Typography>
        <Typography variant="body1">Tên nhóm: Nhóm PHATPT</Typography>
        <Typography variant="body1">Thành viên 1: Phan Trung Phát 1</Typography>
        <Typography variant="body1">Thành viên 2: Phan Trung Phát 2</Typography>
        <Typography variant="body1">Bài thực hành số 4</Typography>
      </Paper>
      <Typography variant="h6" sx={{ mb: 2 }}>Thiết bị kết nối</Typography>
      <Grid container spacing={2}>
        {devices.map(device => (
          <Grid item key={device.id} xs={12} sm={6} md={4} lg={3}>
            <DeviceCard name={device.name} status={device.status} lastSeen={device.lastSeen} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard; 