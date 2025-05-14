import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, IconButton, Chip, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LogsTable from './LogsTable';
import logsData from '../../mock/logs';

function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    deviceId: '',
    sensor: '',
    timeRange: 'all',
  });

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = 
      log.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search) ||
      log.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      log.sensor.toLowerCase().includes(search.toLowerCase());

    const matchesFilters = 
      (!filters.deviceId || log.deviceId === filters.deviceId) &&
      (!filters.sensor || log.sensor === filters.sensor);

    return matchesSearch && matchesFilters;
  });

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueDevices = [...new Set(logsData.map(log => log.deviceId))];
  const uniqueSensors = [...new Set(logsData.map(log => log.sensor))];

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

        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
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
      </Paper>
    </Box>
  );
}

export default Logs; 