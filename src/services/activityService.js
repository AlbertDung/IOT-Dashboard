// Activity logging service for tracking user actions across the platform

// Activity types
export const ACTIVITY_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  DEVICE_CONFIGURE: 'DEVICE_CONFIGURE',
  EXPORT_DATA: 'EXPORT_DATA',
  GENERATE_REPORT: 'GENERATE_REPORT',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  VIEW_LOGS: 'VIEW_LOGS',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  TEAM_CHAT: 'TEAM_CHAT',
  FILE_UPLOAD: 'FILE_UPLOAD',
  DEVICE_RESTART: 'DEVICE_RESTART',
  DEVICE_POWER_ON: 'DEVICE_POWER_ON',
  SYSTEM_REFRESH: 'SYSTEM_REFRESH',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE'
};

// Activity icons mapping
export const ACTIVITY_ICONS = {
  [ACTIVITY_TYPES.LOGIN]: '🔐',
  [ACTIVITY_TYPES.LOGOUT]: '🚪',
  [ACTIVITY_TYPES.DASHBOARD_VIEW]: '📊',
  [ACTIVITY_TYPES.DEVICE_CONFIGURE]: '⚙️',
  [ACTIVITY_TYPES.EXPORT_DATA]: '📤',
  [ACTIVITY_TYPES.GENERATE_REPORT]: '📋',
  [ACTIVITY_TYPES.VIEW_ANALYTICS]: '📈',
  [ACTIVITY_TYPES.VIEW_LOGS]: '📝',
  [ACTIVITY_TYPES.PROFILE_UPDATE]: '👤',
  [ACTIVITY_TYPES.TEAM_CHAT]: '💬',
  [ACTIVITY_TYPES.FILE_UPLOAD]: '📎',
  [ACTIVITY_TYPES.DEVICE_RESTART]: '🔄',
  [ACTIVITY_TYPES.DEVICE_POWER_ON]: '⚡',
  [ACTIVITY_TYPES.SYSTEM_REFRESH]: '🔄',
  [ACTIVITY_TYPES.SETTINGS_CHANGE]: '⚙️'
};

// Local storage key for activities
const ACTIVITIES_STORAGE_KEY = 'iot_user_activities';
const MAX_ACTIVITIES = 100; // Keep only last 100 activities

// Get current user ID (from localStorage or auth service)
const getCurrentUserId = () => {
  return localStorage.getItem('userName') || 'unknown_user';
};

// Get stored activities from localStorage
const getStoredActivities = () => {
  try {
    const stored = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading activities from localStorage:', error);
    return [];
  }
};

// Save activities to localStorage
const saveActivities = (activities) => {
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activities to localStorage:', error);
  }
};

// Activity logging service
export const activityService = {
  // Log a new activity
  logActivity: (type, description, metadata = {}) => {
    const activities = getStoredActivities();
    
    const newActivity = {
      id: Date.now() + Math.random(), // Simple unique ID
      userId: getCurrentUserId(),
      type,
      description,
      metadata,
      timestamp: new Date().toISOString(),
      icon: ACTIVITY_ICONS[type] || '📄'
    };

    // Add new activity to the beginning
    activities.unshift(newActivity);

    // Keep only the last MAX_ACTIVITIES
    if (activities.length > MAX_ACTIVITIES) {
      activities.splice(MAX_ACTIVITIES);
    }

    saveActivities(activities);
    return newActivity;
  },

  // Get all activities for current user
  getUserActivities: (limit = 50) => {
    const activities = getStoredActivities();
    const currentUserId = getCurrentUserId();
    
    return activities
      .filter(activity => activity.userId === currentUserId)
      .slice(0, limit);
  },

  // Get activities by type
  getActivitiesByType: (type, limit = 20) => {
    const activities = getStoredActivities();
    const currentUserId = getCurrentUserId();
    
    return activities
      .filter(activity => activity.userId === currentUserId && activity.type === type)
      .slice(0, limit);
  },

  // Get activity statistics
  getActivityStats: () => {
    const activities = getStoredActivities();
    const currentUserId = getCurrentUserId();
    const userActivities = activities.filter(activity => activity.userId === currentUserId);
    
    const stats = {
      totalActivities: userActivities.length,
      todayActivities: 0,
      weekActivities: 0,
      monthActivities: 0,
      typeBreakdown: {},
      lastActivity: null,
      firstActivity: null
    };

    if (userActivities.length === 0) return stats;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    userActivities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      
      // Count activities by time period
      if (activityDate >= todayStart) stats.todayActivities++;
      if (activityDate >= weekStart) stats.weekActivities++;
      if (activityDate >= monthStart) stats.monthActivities++;

      // Count by type
      if (!stats.typeBreakdown[activity.type]) {
        stats.typeBreakdown[activity.type] = 0;
      }
      stats.typeBreakdown[activity.type]++;
    });

    // Get first and last activities
    stats.lastActivity = userActivities[0];
    stats.firstActivity = userActivities[userActivities.length - 1];

    return stats;
  },

  // Clear all activities for current user
  clearUserActivities: () => {
    const activities = getStoredActivities();
    const currentUserId = getCurrentUserId();
    
    const otherUserActivities = activities.filter(activity => activity.userId !== currentUserId);
    saveActivities(otherUserActivities);
  },

  // Get recent activities formatted for display
  getRecentActivitiesForDisplay: (limit = 10) => {
    const activities = activityService.getUserActivities(limit);
    
    return activities.map(activity => ({
      id: activity.id,
      action: activityService.formatActivityType(activity.type),
      icon: activity.icon,
      description: activity.description,
      timestamp: new Date(activity.timestamp).toLocaleString(),
      type: activity.type,
      metadata: activity.metadata
    }));
  },

  // Format activity type for display
  formatActivityType: (type) => {
    const typeMap = {
      [ACTIVITY_TYPES.LOGIN]: 'System Login',
      [ACTIVITY_TYPES.LOGOUT]: 'System Logout',
      [ACTIVITY_TYPES.DASHBOARD_VIEW]: 'Viewed Dashboard',
      [ACTIVITY_TYPES.DEVICE_CONFIGURE]: 'Configured Device',
      [ACTIVITY_TYPES.EXPORT_DATA]: 'Exported Data',
      [ACTIVITY_TYPES.GENERATE_REPORT]: 'Generated Report',
      [ACTIVITY_TYPES.VIEW_ANALYTICS]: 'Viewed Analytics',
      [ACTIVITY_TYPES.VIEW_LOGS]: 'Viewed Logs',
      [ACTIVITY_TYPES.PROFILE_UPDATE]: 'Updated Profile',
      [ACTIVITY_TYPES.TEAM_CHAT]: 'Team Communication',
      [ACTIVITY_TYPES.FILE_UPLOAD]: 'Uploaded File',
      [ACTIVITY_TYPES.DEVICE_RESTART]: 'Restarted Device',
      [ACTIVITY_TYPES.DEVICE_POWER_ON]: 'Powered On Device',
      [ACTIVITY_TYPES.SYSTEM_REFRESH]: 'System Refresh',
      [ACTIVITY_TYPES.SETTINGS_CHANGE]: 'Changed Settings'
    };

    return typeMap[type] || type;
  }
};

// Convenience functions for common activities
export const logLogin = () => {
  activityService.logActivity(
    ACTIVITY_TYPES.LOGIN,
    'Successfully logged into the IoT Dashboard',
    { loginMethod: 'credentials' }
  );
};

export const logLogout = () => {
  activityService.logActivity(
    ACTIVITY_TYPES.LOGOUT,
    'Logged out from the IoT Dashboard'
  );
};

export const logExport = (format, itemCount, dataType = 'data') => {
  activityService.logActivity(
    ACTIVITY_TYPES.EXPORT_DATA,
    `Exported ${itemCount} ${dataType} records as ${format.toUpperCase()}`,
    { format, itemCount, dataType }
  );
};

export const logDeviceAction = (action, deviceName) => {
  const activityType = action.toLowerCase().includes('restart') ? 
    ACTIVITY_TYPES.DEVICE_RESTART : ACTIVITY_TYPES.DEVICE_CONFIGURE;
  
  activityService.logActivity(
    activityType,
    `${action} performed on device: ${deviceName}`,
    { action, deviceName }
  );
};

export const logPageView = (pageName) => {
  let activityType;
  switch (pageName.toLowerCase()) {
    case 'dashboard':
      activityType = ACTIVITY_TYPES.DASHBOARD_VIEW;
      break;
    case 'analytics':
    case 'charts':
      activityType = ACTIVITY_TYPES.VIEW_ANALYTICS;
      break;
    case 'logs':
      activityType = ACTIVITY_TYPES.VIEW_LOGS;
      break;
    default:
      activityType = ACTIVITY_TYPES.DASHBOARD_VIEW;
  }

  activityService.logActivity(
    activityType,
    `Navigated to ${pageName} page`,
    { pageName }
  );
};

export const logTeamChat = (action, details = '') => {
  activityService.logActivity(
    ACTIVITY_TYPES.TEAM_CHAT,
    `Team chat: ${action}${details ? ' - ' + details : ''}`,
    { action, details }
  );
};

export const logFileUpload = (fileName, fileSize) => {
  activityService.logActivity(
    ACTIVITY_TYPES.FILE_UPLOAD,
    `Uploaded file: ${fileName} (${fileSize})`,
    { fileName, fileSize }
  );
};

export default activityService; 