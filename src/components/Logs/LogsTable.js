import React, { useState } from 'react';
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
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Stack,
  LinearProgress,
  Fade,
  Zoom,
  Badge,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { exportLogsData } from '../../utils/exportUtils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

function LogsTable({ logs, page, rowsPerPage, onPageChange, onRowsPerPageChange, totalCount }) {
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'normal': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'normal': return '✅';
      default: return 'ℹ️';
    }
  };

  const getDeviceTypeIcon = (deviceId) => {
    if (deviceId.includes('ESP')) return '📡';
    if (deviceId.includes('ARD')) return '🔧';
    if (deviceId.includes('PI')) return '🍓';
    return '📱';
  };

  const getDeviceTypeLabel = (deviceId) => {
    if (deviceId.includes('ESP')) return 'ESP8266';
    if (deviceId.includes('ARD')) return 'Arduino';
    if (deviceId.includes('PI')) return 'Raspberry Pi';
    return 'Unknown';
  };

  const getTrendDirection = (value, sensor) => {
    // Simulate trend based on value (this would be real trend data in production)
    const threshold = sensor === 'Temperature' ? 25 : sensor === 'Humidity' ? 45 : 600;
    return value > threshold ? 'up' : 'down';
  };

  const handleActionClick = (event, log) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedLog(log);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
    setSelectedLog(null);
  };

  const handleAction = async (action) => {
    if (action === 'export-csv') {
      try {
        const result = exportLogsData([selectedLog], 'csv');
        console.log('Export result:', result);
      } catch (error) {
        console.error('Export error:', error);
      }
    } else {
      console.log(`${action} performed on log:`, selectedLog);
    }
    handleActionClose();
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - logTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Box>
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.3); }
            50% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.6); }
          }
          .table-row {
            transition: all 0.3s ease;
            animation: slideIn 0.4s ease-out;
          }
          .table-row:hover {
            background: linear-gradient(145deg, rgba(33, 150, 243, 0.02), rgba(156, 39, 176, 0.02)) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .pulse-chip {
            animation: pulse 2s infinite;
          }
          .glow-critical {
            animation: glow 2s infinite;
          }
        `}
      </style>

      {/* Table Statistics Header */}
      <Card sx={{ mb: 2, borderRadius: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <DevicesIcon sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                {logs.length} Active Logs
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <SecurityIcon sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                {logs.filter(log => log.severity === 'critical').length} Critical Issues
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <SpeedIcon sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                Real-time Monitoring
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)'
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '& .MuiTableCell-head': {
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderBottom: 'none'
              }
            }}>
              <TableCell>🖥️ Device Info</TableCell>
              <TableCell>📍 Network</TableCell>
              <TableCell>🔬 Sensor Data</TableCell>
              <TableCell>📊 Status & Trends</TableCell>
              <TableCell>⏰ Timeline</TableCell>
              <TableCell align="center">⚙️ Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, idx) => (
              <Fade in={true} timeout={300} style={{ transitionDelay: `${idx * 50}ms` }} key={idx}>
              <TableRow 
                  className="table-row"
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                sx={{ 
                    borderLeft: `4px solid ${
                      log.severity === 'critical' ? '#f44336' : 
                      log.severity === 'warning' ? '#ff9800' : '#4caf50'
                    }`,
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: hoveredRow === idx ? 'action.hover' : 'transparent'
                }}
              >
                  {/* Device Info */}
                <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: log.severity === 'critical' ? 'error.light' : 
                                   log.severity === 'warning' ? 'warning.light' : 'success.light',
                          width: 40, 
                          height: 40 
                        }}
                      >
                        {getDeviceTypeIcon(log.deviceId)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {log.deviceId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getDeviceTypeLabel(log.deviceId)}
                  </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main', fontWeight: 500 }}>
                          {log.deviceName}
                  </Typography>
                      </Box>
                    </Box>
                </TableCell>

                  {/* Network Info */}
                <TableCell>
                    <Box>
                  <Chip 
                        label={log.ip}
                    size="small"
                        icon={<DevicesIcon />}
                    sx={{ 
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      />
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        📡 Network: Online
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                        🔗 Signal: Strong
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Sensor Data */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {log.icon} {log.sensor}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={`${log.value}${log.sensor === 'Temperature' ? '°C' : log.sensor === 'Humidity' ? '%' : 'lux'}`}
                            size="small"
                            color={getStatusColor(log.value, log.sensor)}
                            className={log.severity === 'critical' ? 'pulse-chip' : ''}
                            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                          />
                          {getTrendDirection(log.value, log.sensor) === 'up' ? (
                            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                          ) : (
                            <TrendingDownIcon sx={{ color: 'info.main', fontSize: 16 }} />
                          )}
                        </Box>
                      </Box>
                    </Box>
                </TableCell>

                  {/* Status & Trends */}
                <TableCell>
                    <Stack spacing={1}>
                  <Chip 
                        label={`${getSeverityIcon(log.severity)} ${log.severity.toUpperCase()}`}
                    size="small"
                        color={getSeverityColor(log.severity)}
                        className={log.severity === 'critical' ? 'glow-critical' : ''}
                        sx={{ fontWeight: 600 }}
                      />
                      <LinearProgress 
                        variant="determinate" 
                        value={log.severity === 'critical' ? 90 : log.severity === 'warning' ? 60 : 30}
                        color={getSeverityColor(log.severity)}
                        sx={{ borderRadius: '4px', height: 6 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {log.severity === 'critical' ? '🔥 Immediate attention' : 
                         log.severity === 'warning' ? '⚡ Monitor closely' : '🎯 Within normal range'}
                      </Typography>
                    </Stack>
                </TableCell>

                  {/* Timeline */}
                <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getTimeAgo(log.time)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(log.time), 'MMM dd, HH:mm')}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'info.main' }}>
                        📅 {format(new Date(log.time), 'yyyy')}
                  </Typography>
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Zoom in={hoveredRow === idx} timeout={200}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            sx={{ 
                              bgcolor: 'primary.light',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.main', color: 'white' }
                            }}
                            onClick={() => handleAction('view')}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Zoom>
                      
                      <Tooltip title="More Actions">
                        <IconButton 
                          size="small"
                          onClick={(e) => handleActionClick(e, log)}
                          sx={{ 
                            bgcolor: 'action.hover',
                            '&:hover': { bgcolor: 'action.selected' }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {log.severity === 'critical' && (
                        <Badge 
                          badgeContent="!"
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              animation: 'pulse 1s infinite'
                            }
                          }}
                        >
                          <IconButton size="small" color="error">
                            <FlagIcon fontSize="small" />
                          </IconButton>
                        </Badge>
                      )}
                    </Box>
                </TableCell>
              </TableRow>
              </Fade>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary">
                    No logs found
                  </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or search criteria
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Enhanced Pagination */}
      <Card sx={{ mt: 2, borderRadius: '12px', overflow: 'hidden' }}>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
            bgcolor: 'background.paper',
          '.MuiTablePagination-select': {
            borderRadius: '8px',
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontWeight: 600
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            my: 0,
              fontWeight: 600,
              color: 'text.primary'
            },
            '.MuiTablePagination-actions button': {
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light'
              }
            }
          }}
          labelDisplayedRows={({ from, to, count }) => 
            `📊 Showing ${from}-${to} of ${count !== -1 ? count : `more than ${to}`} logs`
          }
          labelRowsPerPage="📄 Rows per page:"
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
        PaperProps={{
          sx: { 
            borderRadius: '12px', 
            mt: 1,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
      >
        <MenuItem onClick={() => handleAction('view')} sx={{ gap: 1 }}>
          <VisibilityIcon fontSize="small" color="primary" />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('flag')} sx={{ gap: 1 }}>
          <FlagIcon fontSize="small" color="warning" />
          Flag for Review
        </MenuItem>
        <MenuItem onClick={() => handleAction('export-csv')} sx={{ gap: 1 }}>
          <ShareIcon fontSize="small" color="success" />
          Export as CSV
        </MenuItem>
        <MenuItem onClick={() => handleAction('share')} sx={{ gap: 1 }}>
          <ShareIcon fontSize="small" color="info" />
          Share Log
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ gap: 1, color: 'error.main' }}>
          <DeleteIcon fontSize="small" />
          Delete Log
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default LogsTable; 