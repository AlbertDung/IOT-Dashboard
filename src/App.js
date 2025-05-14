import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Avatar, IconButton, useTheme, useMediaQuery, Badge } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';

import Dashboard from './components/Dashboard/Dashboard';
import Main from './components/Main/Main';
import Charts from './components/Charts/Charts';
import Logs from './components/Logs/Logs';

const drawerWidth = 260;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const NavItem = ({ to, icon, text }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <ListItem
        button
        component={Link}
        to={to}
        sx={{
          borderRadius: '12px',
          mx: 1,
          mb: 1,
          backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          color: isActive ? 'primary.main' : 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          },
        }}
      >
        <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    );
  };

  const drawer = (
    <>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ 
          flexGrow: 1,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700
        }}>
          IoT Dashboard
        </Typography>
      </Toolbar>
      <List sx={{ px: 2 }}>
        <NavItem to="/" icon={<DashboardIcon />} text="Dashboard" />
        <NavItem to="/main" icon={<DevicesIcon />} text="Devices" />
        <NavItem to="/charts" icon={<BarChartIcon />} text="Analytics" />
        <NavItem to="/logs" icon={<ListAltIcon />} text="Logs" />
      </List>
    </>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'white',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            color: 'text.primary'
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
              IoT Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar 
              alt="User" 
              src="/static/images/avatar/1.jpg"
              sx={{ ml: 2, width: 40, height: 40, border: '2px solid #e3f2fd' }}
            />
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  bgcolor: '#f8fafc',
                  borderRight: '1px solid #e2e8f0'
                },
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  bgcolor: '#f8fafc',
                  borderRight: '1px solid #e2e8f0'
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          )}
        </Box>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: '64px'
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/main" element={<Main />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
