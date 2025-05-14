import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Paper,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { format } from 'date-fns';

function LogsTable({ logs, page, rowsPerPage, onPageChange, onRowsPerPageChange, totalCount }) {
  const getStatusColor = (value, sensor) => {
    if (sensor === 'Temperature') {
      if (value > 30) return 'error';
      if (value < 20) return 'warning';
      return 'success';
    }
    if (sensor === 'Humidity') {
      if (value > 60) return 'error';
      if (value < 30) return 'warning';
      return 'success';
    }
    if (sensor === 'Light') {
      if (value > 1000) return 'warning';
      if (value < 200) return 'error';
      return 'success';
    }
    return 'default';
  };

  return (
    <Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 600 }}>Device ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Device Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sensor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((row, idx) => (
              <TableRow 
                key={idx}
                sx={{ 
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {row.deviceId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {row.ip}
                  </Typography>
                </TableCell>
                <TableCell>{row.deviceName}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.sensor}
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${row.value}${row.sensor === 'Temperature' ? '°C' : row.sensor === 'Humidity' ? '%' : 'lux'}`}
                    size="small"
                    color={getStatusColor(row.value, row.sensor)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(row.time), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No logs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{
          '.MuiTablePagination-select': {
            borderRadius: '8px',
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            my: 0,
          },
        }}
      />
    </Box>
  );
}

export default LogsTable; 