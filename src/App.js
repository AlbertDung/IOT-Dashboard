import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import './App.css';

import Dashboard from './components/Dashboard/Dashboard';
import Main from './components/Main/Main';
import Charts from './components/Charts/Charts';
import Logs from './components/Logs/Logs';

const drawerWidth = 220;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {/* Sidebar first*/}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f5f7fa' },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              IoT Dashboard
            </Typography>
          </Toolbar>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/main">
              <ListItemIcon><DevicesIcon /></ListItemIcon>
              <ListItemText primary="Main" />
            </ListItem>
            <ListItem button component={Link} to="/charts">
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="Charts" />
            </ListItem>
            <ListItem button component={Link} to="/logs">
              <ListItemIcon><ListAltIcon /></ListItemIcon>
              <ListItemText primary="Logs" />
            </ListItem>
          </List>
        </Drawer>
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f9fbfd', minHeight: '100vh' }}>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1976d2' }}>
            <Toolbar>
              <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                IoT Dashboard
              </Typography>
              <Avatar alt="User" src="/static/images/avatar/1.jpg" />
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/main" element={<Main />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
