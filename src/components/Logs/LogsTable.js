import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Box } from '@mui/material';

function LogsTable({ logs, page, rowsPerPage, onPageChange, onRowsPerPageChange, search, onSearchChange }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={onSearchChange}
        />
        {/* Placeholder for export button */}
      </Box>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID thiết bị</TableCell>
              <TableCell>Địa chỉ IP</TableCell>
              <TableCell>Tên thiết bị</TableCell>
              <TableCell>Cảm biến</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.deviceId}</TableCell>
                <TableCell>{row.ip}</TableCell>
                <TableCell>{row.deviceName}</TableCell>
                <TableCell>{row.sensor}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={100} // Placeholder
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}

export default LogsTable; 