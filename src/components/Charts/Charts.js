import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, ButtonGroup, Button } from '@mui/material';
import ChartCard from './ChartCard';
import { Line, Bar, Pie } from 'react-chartjs-2';
import useSensorData from '../../hooks/useSensorData';

// Register Chart.js components
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
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const timeRanges = ['Day', 'Week', 'Month', 'Year'];

function Charts() {
  const [timeRange, setTimeRange] = useState('Day');
  const { history, error } = useSensorData();

  // Prepare chart data from history
  const labels = history.map(d => d.time ? new Date(d.time).toLocaleTimeString() : '');
  const lightData = {
    labels,
    datasets: [{
      label: 'Light Intensity',
      data: history.map(d => d.light),
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };
  const tempData = {
    labels,
    datasets: [{
      label: 'Temperature',
      data: history.map(d => d.temperature),
      backgroundColor: 'rgba(229, 57, 53, 0.8)',
      borderRadius: 4,
    }],
  };
  const humidityData = {
    labels,
    datasets: [{
      label: 'Humidity',
      data: history.map(d => d.humidity),
      backgroundColor: [
        'rgba(25, 118, 210, 0.8)',
        'rgba(229, 57, 53, 0.8)',
        'rgba(251, 192, 45, 0.8)',
        'rgba(67, 160, 71, 0.8)',
      ],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
          <ButtonGroup size="small">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'contained' : 'outlined'}
                onClick={() => setTimeRange(range)}
                sx={{
                  minWidth: 80,
                  borderRadius: '8px !important',
                  '&:not(:last-child)': { borderRight: 'none' },
                }}
              >
                {range}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <ChartCard title="Light Intensity">
                <Box sx={{ height: 300 }}>
                  <Line 
                    key={JSON.stringify(lightData)}
                    data={lightData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        tooltip: {
                          ...chartOptions.plugins.tooltip,
                          callbacks: {
                            label: (context) => `Light: ${context.raw} lux`,
                          },
                        },
                      },
                    }} 
                  />
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={5}>
              <ChartCard title="Temperature">
                <Box sx={{ height: 300 }}>
                  <Bar 
                    key={JSON.stringify(tempData)}
                    data={tempData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        tooltip: {
                          ...chartOptions.plugins.tooltip,
                          callbacks: {
                            label: (context) => `Temperature: ${context.raw}°C`,
                          },
                        },
                      },
                    }} 
                  />
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={5}>
              <ChartCard title="Humidity">
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: '80%', maxWidth: 300 }}>
                    <Pie 
                      key={JSON.stringify(humidityData)}
                      data={humidityData} 
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              pointStyle: 'circle',
                            },
                          },
                          tooltip: {
                            ...chartOptions.plugins.tooltip,
                            callbacks: {
                              label: (context) => `Humidity: ${context.raw}%`,
                            },
                          },
                        },
                      }} 
                    />
                  </Box>
                </Box>
              </ChartCard>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default Charts; 