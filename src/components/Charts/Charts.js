import React from 'react';
import { Box, Grid } from '@mui/material';
import ChartCard from './ChartCard';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const lightData = {
  labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  datasets: [{
    label: 'Ánh sáng',
    data: [900, 1200, 1100, 1500, 1300, 1700],
    borderColor: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
    tension: 0.4,
  }],
};
const tempData = {
  labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  datasets: [{
    label: 'Nhiệt độ',
    data: [25, 28, 30, 27, 29, 31],
    backgroundColor: '#e53935',
  }],
};
const humidityData = {
  labels: ['Aaaa', 'Aaaaa', 'Aaaaaa', 'Aaaaaaa'],
  datasets: [{
    label: 'Độ ẩm',
    data: [25, 35, 25, 15],
    backgroundColor: ['#1976d2', '#e53935', '#fbc02d', '#43a047'],
  }],
};

function Charts() {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <ChartCard title="Cảm biến ánh sáng">
            <Line data={lightData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard title="Cảm biến nhiệt độ">
            <Bar data={tempData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="Cảm biến độ ẩm">
            <Pie data={humidityData} options={{ responsive: true }} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Charts; 