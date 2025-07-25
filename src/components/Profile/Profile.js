import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, Grid, Avatar, Button, Chip, Divider,
  Card, CardContent, List, ListItem, ListItemIcon, ListItemText,
  ListItemAvatar, IconButton, Tab, Tabs, Badge, Stack, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, Fade, Zoom, Grow, Slide, CircularProgress,
  Tooltip, Switch, FormControlLabel, Skeleton, SpeedDial, SpeedDialAction,
  SpeedDialIcon, Backdrop, useTheme, alpha, Container, CardActions,
  ButtonGroup, AvatarGroup, Timeline, TimelineItem, TimelineSeparator,
  TimelineConnector, TimelineContent, TimelineDot, Collapse, Stepper,
  Step, StepLabel, StepContent, Rating, Fab
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExportIcon from '@mui/icons-material/GetApp';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import PhoneIcon from '@mui/icons-material/Phone';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SparklesIcon from '@mui/icons-material/AutoFixHigh';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import { authService } from '../../services/userService';
import { activityService, logPageView } from '../../services/activityService';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [recentActivities, setRecentActivities] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      
      // Simulate loading delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load current user data
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setEditData({
          name: user.name,
          email: user.email,
          bio: user.bio || 'IoT Developer passionate about creating innovative solutions.',
          location: user.location || 'Ho Chi Minh City, Vietnam',
          phone: user.phone || '+84 xxx xxx xxx'
        });
        
        // Calculate profile completion
        calculateProfileCompletion(user);
        
        // Load user activities and stats
        loadUserActivities();
        loadUserStats();
        
        // Log page view
        logPageView('Profile');
      }
      
      setLoading(false);
    };

    loadProfileData();
  }, []);

  const loadUserActivities = () => {
    // Load real activities from activity service
    const activities = activityService.getRecentActivitiesForDisplay(10);
    setRecentActivities(activities);
  };

  const calculateProfileCompletion = (user) => {
    let completion = 0;
    const fields = ['name', 'email', 'bio', 'location', 'phone', 'role'];
    const filledFields = fields.filter(field => user[field] && user[field].trim() !== '');
    completion = Math.round((filledFields.length / fields.length) * 100);
    setProfileCompletion(completion);
  };

  const loadUserStats = () => {
    // Get real statistics from activity service
    const activityStats = activityService.getActivityStats();
    
    const stats = {
      totalLogins: activityStats.typeBreakdown.LOGIN || 0,
      devicesManaged: 12, // This would come from device service
      reportsGenerated: activityStats.typeBreakdown.GENERATE_REPORT || 0,
      dataExported: activityStats.typeBreakdown.EXPORT_DATA || 0,
      systemUptime: '98.5%', // This would come from system monitoring
      lastLogin: activityStats.lastActivity ? new Date(activityStats.lastActivity.timestamp).toLocaleString() : 'N/A',
      accountCreated: 'January 15, 2024', // This would come from user service
      projectsContributed: 8, // This would come from project service
      totalActivities: activityStats.totalActivities,
      todayActivities: activityStats.todayActivities,
      weekActivities: activityStats.weekActivities,
      monthActivities: activityStats.monthActivities,
      streak: Math.floor(Math.random() * 30) + 1, // Mock streak
      level: Math.floor(activityStats.totalActivities / 10) + 1,
      achievements: generateAchievements(activityStats)
    };
    setUserStats(stats);
  };

  const generateAchievements = (activityStats) => {
    const achievements = [];
    
    if (activityStats.totalActivities >= 50) {
      achievements.push({ 
        id: 'active_user', 
        title: 'Active User', 
        description: '50+ platform activities',
        icon: <LocalFireDepartmentIcon />,
        color: '#ff5722'
      });
    }
    
    if (activityStats.typeBreakdown.EXPORT_DATA >= 10) {
      achievements.push({ 
        id: 'data_expert', 
        title: 'Data Expert', 
        description: 'Exported data 10+ times',
        icon: <InsightsIcon />,
        color: '#2196f3'
      });
    }
    
    if (activityStats.weekActivities >= 20) {
      achievements.push({ 
        id: 'weekly_champion', 
        title: 'Weekly Champion', 
        description: '20+ activities this week',
        icon: <EmojiEventsIcon />,
        color: '#ffc107'
      });
    }

    return achievements;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Cancel editing, reset to original data
      const user = authService.getCurrentUser();
      setEditData({
        name: user.name,
        email: user.email,
        bio: user.bio || 'IoT Developer passionate about creating innovative solutions.',
        location: user.location || 'Ho Chi Minh City, Vietnam',
        phone: user.phone || '+84 xxx xxx xxx'
      });
    }
  };

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    setEditMode(false);
    showNotification('Profile updated successfully!', 'success');
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'Lead Developer': '#e91e63',
      'Frontend Dev': '#2196f3',
      'Backend Dev': '#4caf50',
      'DevOps': '#ff9800',
      'UI/UX Designer': '#9c27b0',
      'QA Engineer': '#f44336'
    };
    return roleColors[role] || '#757575';
  };

  const getActivityIcon = (action) => {
    if (action.includes('Export')) return <ExportIcon />;
    if (action.includes('Dashboard')) return <DashboardIcon />;
    if (action.includes('Device') || action.includes('Configure')) return <DevicesIcon />;
    if (action.includes('Report') || action.includes('Analytics')) return <AnalyticsIcon />;
    if (action.includes('Login')) return <LoginIcon />;
    return <SettingsIcon />;
  };

  if (loading || !currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Box>
            {/* Header Skeleton */}
            <Paper 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: 300
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Skeleton variant="circular" width={120} height={120} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="text" width={200} height={40} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    {[1, 2].map((i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Skeleton 
                          variant="rounded" 
                          height={140} 
                          sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '16px' }} 
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>

            {/* Content Skeleton */}
            <Paper sx={{ borderRadius: '16px', p: 3 }}>
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <Skeleton variant="rounded" height={200} sx={{ borderRadius: '12px' }} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }} ref={scrollRef}>
      {/* Enhanced Profile Header with Glassmorphism */}
      <Slide direction="down" in timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 70%, #ff9a8b 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 32px 64px rgba(102, 126, 234, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmer 3s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={4}>
              <Zoom in timeout={1200}>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  {/* Enhanced Avatar with Multiple Badges */}
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    badgeContent={
                      <Tooltip title="Verified User">
                        <VerifiedIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                      </Tooltip>
                    }
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title="Edit Profile">
                          <IconButton
                            size="small"
                            onClick={handleEditToggle}
                            sx={{
                              bgcolor: 'white',
                              color: '#667eea',
                              width: 40,
                              height: 40,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              '&:hover': { 
                                bgcolor: '#f5f5f5',
                                transform: 'scale(1.1)',
                                transition: 'all 0.2s ease'
                              }
                            }}
                          >
                            {editMode ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <Avatar
                        sx={{
                          width: 140,
                          height: 140,
                          border: '5px solid rgba(255,255,255,0.3)',
                          fontSize: '3.5rem',
                          bgcolor: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            border: '5px solid rgba(255,255,255,0.5)'
                          }
                        }}
                      >
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Badge>
                  </Badge>
                  
                  {/* Enhanced Name and Title */}
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800, 
                      mt: 3, 
                      mb: 1,
                      background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
                      backgroundClip: 'text',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {currentUser.name}
                  </Typography>
                  
                  {/* Role with Level System */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      icon={<WorkspacePremiumIcon />}
                      label={`${currentUser.role || 'Team Member'} • Level ${userStats.level || 1}`}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    />
                    {userStats.streak > 7 && (
                      <Chip
                        icon={<LocalFireDepartmentIcon />}
                        label={`${userStats.streak} day streak`}
                        size="small"
                        sx={{
                          bgcolor: '#ff5722',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Stack>
                  
                  {/* Profile Completion Progress */}
                  <Box sx={{ width: '100%', maxWidth: 280, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Profile Completion
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {profileCompletion}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={profileCompletion}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: profileCompletion === 100 
                            ? 'linear-gradient(90deg, #4caf50, #8bc34a)'
                            : 'linear-gradient(90deg, #ffc107, #ff9800)'
                        }
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.95, 
                      maxWidth: 320,
                      fontStyle: 'italic',
                      lineHeight: 1.6
                    }}
                  >
                    {editData.bio}
                  </Typography>

                  {/* Quick Action Buttons */}
                  <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                    <Tooltip title="Share Profile">
                      <IconButton
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Achievements">
                      <IconButton
                        onClick={() => setShowAchievements(!showAchievements)}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                      >
                        <EmojiEventsIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Zoom>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grow in timeout={1500}>
                <Grid container spacing={3}>
                  {/* Enhanced Statistics Cards */}
                  <Grid item xs={12} sm={6}>
                    <Card 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                          <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>
                            <InsightsIcon />
                          </Avatar>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            Performance
                          </Typography>
                        </Box>
                        
                        <Stack spacing={2}>
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Total Activities
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {userStats.totalActivities || 0}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min((userStats.totalActivities || 0) / 100 * 100, 100)}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#4caf50',
                                  borderRadius: 3
                                }
                              }}
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              This Week:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {userStats.weekActivities || 0}
                            </Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Data Exports:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {userStats.dataExported || 0}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                          <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>
                            <SecurityIcon />
                          </Avatar>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            Account
                          </Typography>
                        </Box>
                        
                        <Stack spacing={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Student ID:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {currentUser.studentId}
                            </Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Level:
                            </Typography>
                            <Chip
                              label={`Level ${userStats.level || 1}`}
                              size="small"
                              sx={{ 
                                bgcolor: '#ffc107', 
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Status:
                            </Typography>
                            <Chip
                              label="Active"
                              size="small"
                              sx={{ 
                                bgcolor: '#4caf50', 
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>

                          {userStats.streak > 0 && (
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                🔥 Streak:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {userStats.streak} days
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grow>
            </Grid>
          </Grid>
        </Paper>
      </Slide>
      

      {/* Tabs Navigation */}
      <Paper sx={{ borderRadius: '16px', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }
          }}
        >
          <Tab icon={<PersonIcon />} label="Personal Info" />
          <Tab icon={<TrendingUpIcon />} label="Activity" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper sx={{ borderRadius: '16px', minHeight: 400 }}>
        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Contact Information
              </Typography>
              
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon color="primary" />
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {editData.email}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <LocationOnIcon color="primary" />
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Location
                    </Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {editData.location}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <WorkIcon color="primary" />
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Role & Position
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {currentUser.role || 'Team Member'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarTodayIcon color="primary" />
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {userStats.accountCreated}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {editMode && (
                <Box display="flex" gap={2} mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    sx={{ borderRadius: '12px' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                    sx={{ borderRadius: '12px' }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Bio & Description
              </Typography>
              
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  sx={{ mb: 3 }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                  {editData.bio}
                </Typography>
              )}

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Skills & Expertise
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1}>
                {['React.js', 'IoT Development', 'Node.js', 'Python', 'Arduino', 'ESP32', 'Material-UI', 'Firebase'].map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Recent Activities
          </Typography>
          
          <List>
            {recentActivities.map((activity, index) => (
              <Zoom in timeout={300 + index * 100} key={activity.id}>
                <ListItem
                  sx={{
                    borderRadius: '12px',
                    mb: 2,
                    bgcolor: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {activity.action}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Zoom>
            ))}
          </List>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Account Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: '12px' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Security
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
                  >
                    Two-Factor Authentication
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
                  >
                    Security Log
                  </Button>
                </Stack>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: '12px' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notifications
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
                  >
                    Email Notifications
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
                  >
                    Push Notifications
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
                  >
                    Alert Preferences
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Quick Actions */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
      >
        <SpeedDialAction
          icon={<EditIcon />}
          tooltipTitle="Edit Profile"
          onClick={handleEditToggle}
        />
        <SpeedDialAction
          icon={<ShareIcon />}
          tooltipTitle="Share Profile"
          onClick={() => showNotification('Profile link copied!', 'success')}
        />
        <SpeedDialAction
          icon={<EmojiEventsIcon />}
          tooltipTitle="Achievements"
          onClick={() => setShowAchievements(!showAchievements)}
        />
      </SpeedDial>
    </Container>
  );
}

export default Profile; 