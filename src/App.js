import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Avatar, IconButton, useTheme, useMediaQuery, Badge, Popover, Button, Divider } from '@mui/material';
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
import SensorData from './components/SensorData';

// Lazy load auth pages for smoothness
const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./components/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./components/auth/ResetPasswordPage'));

const drawerWidth = 260;

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(() => {
    // Optionally, store user info in localStorage after login
    return localStorage.getItem('userName') || '';
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
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
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Auth pages */}
          <Route path="/login" element={<LoginPage onLogin={name => { setUser(name); localStorage.setItem('userName', name); }} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected main app */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
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
                      <IconButton color="inherit" onClick={handleAvatarClick} sx={{ ml: 2 }}>
                        <Avatar alt={user || 'User'} src="/static/images/avatar/1.jpg" sx={{ width: 40, height: 40, border: '2px solid #e3f2fd' }} />
                      </IconButton>
                      <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ sx: { p: 2, minWidth: 220 } }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                          Thông tin người dùng
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <b>Tên:</b> {user || 'Chưa xác định'}
                        </Typography>
                        <Button variant="outlined" color="error" fullWidth onClick={handleLogout} sx={{ mt: 1 }}>
                          Đăng xuất
                        </Button>
                      </Popover>
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
                    <SensorData />
                  </Box>
                </Box>
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
