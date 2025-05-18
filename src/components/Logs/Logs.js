import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, IconButton, Chip, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LogsTable from './LogsTable';
import useSensorData from '../../hooks/useSensorData';

function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    deviceId: '',
    sensor: '',
    timeRange: 'all',
  });
  const { history, error } = useSensorData();

  // Transform history: each sensor is a separate log line
  let logs = [];
  history.forEach(log => {
    if (log.temperature !== undefined && log.temperature !== null) {
      logs.push({ ...log, sensor: 'Temperature', value: log.temperature });
    }
    if (log.humidity !== undefined && log.humidity !== null) {
      logs.push({ ...log, sensor: 'Humidity', value: log.humidity });
    }
    if (log.light !== undefined && log.light !== null) {
      logs.push({ ...log, sensor: 'Light', value: log.light });
    }
  });
  // Sort from oldest to newest
  logs.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Filtering
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      (log.deviceId && log.deviceId.toLowerCase().includes(search.toLowerCase())) ||
      (log.ip && log.ip.includes(search)) ||
      (log.deviceName && log.deviceName.toLowerCase().includes(search.toLowerCase())) ||
      (log.sensor && log.sensor.toLowerCase().includes(search.toLowerCase()));
    const matchesFilters =
      (!filters.deviceId || log.deviceId === filters.deviceId) &&
      (!filters.sensor || log.sensor === filters.sensor);
    return matchesSearch && matchesFilters;
  });

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueDevices = [...new Set(logs.map(log => log.deviceId))];
  const uniqueSensors = [...new Set(logs.map(log => log.sensor))];

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
            System Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Logs: {filteredLogs.length}
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <FilterListIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: 'background.paper',
              },
            }}
          />
        </Box>
        <Stack direction="row" spacing={1} mb={2}>
          {uniqueDevices.map(deviceId => (
            <Chip
              key={deviceId}
              label={deviceId}
              onClick={() => setFilters(prev => ({
                ...prev,
                deviceId: prev.deviceId === deviceId ? '' : deviceId
              }))}
              color={filters.deviceId === deviceId ? 'primary' : 'default'}
              variant={filters.deviceId === deviceId ? 'filled' : 'outlined'}
            />
          ))}
          {uniqueSensors.map(sensor => (
            <Chip
              key={sensor}
              label={sensor}
              onClick={() => setFilters(prev => ({
                ...prev,
                sensor: prev.sensor === sensor ? '' : sensor
              }))}
              color={filters.sensor === sensor ? 'primary' : 'default'}
              variant={filters.sensor === sensor ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <LogsTable
            logs={paginatedLogs}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            totalCount={filteredLogs.length}
          />
        )}
      </Paper>
    </Box>
  );
}

export default Logs; 