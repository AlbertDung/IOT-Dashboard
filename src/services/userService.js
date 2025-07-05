// Simple client-side authentication service for Vercel deployment
// This replaces the Flask API authentication

// Simple hash function for password verification (client-side only)
function simpleHash(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Generate a simple JWT-like token
function generateToken(studentId) {
  const payload = {
    userId: studentId,
    exp: Date.now() + (12 * 60 * 60 * 1000), // 12 hours
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
}

// Verify token
function verifyToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

// Group members database (same as Flask API)
const users = {
  "2124801030179": {
    "name": "Nguyễn Duy Dũng",
    "email": "2124801030179@student.tdmu.edu.vn",
    "password": simpleHash("2124801030179"),
  },
  "2124801030036": {
    "name": "Lương Nguyễn Khôi",
    "email": "2124801030036@student.tdmu.edu.vn",
    "password": simpleHash("2124801030036"),
  },
  "2124801030180": {
    "name": "Nguyễn Tiến Dũng",
    "email": "2124801030180@student.tdmu.edu.vn",
    "password": simpleHash("2124801030180"),
  },
  "2124801030076": {
    "name": "Trương Bồ Quốc Thắng",
    "email": "2124801030076@student.tdmu.edu.vn",
    "password": simpleHash("2124801030076"),
  },
  "2124801030233": {
    "name": "Trần Lê Thảo",
    "email": "2124801030233@student.tdmu.edu.vn",
    "password": simpleHash("2124801030233"),
  },
  "2124801030017": {
    "name": "Nguyễn Minh Khôi",
    "email": "2124801030017@student.tdmu.edu.vn",
    "password": simpleHash("2124801030017"),
  },
};

// Authentication service
export const authService = {
  // Login function
  login: async (studentId, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const user = users[studentId];
        if (user && user.password === simpleHash(password)) {
          const token = generateToken(studentId);
          resolve({
            access_token: token,
            name: user.name
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },

  // Verify if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return verifyToken(token) !== null;
  },

  // Get current user info
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = verifyToken(token);
    if (!payload) return null;
    
    const user = users[payload.userId];
    return user ? { ...user, studentId: payload.userId } : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  },

  // Forgot password (simplified - just check if user exists)
  forgotPassword: async (studentId, email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users[studentId];
        if (user && user.email === email) {
          // In a real app, this would send an email
          // For now, we'll just return success
          resolve({ message: "Reset instructions sent to email" });
        } else {
          reject(new Error("Student ID or email not found"));
        }
      }, 500);
    });
  },

  // Reset password (simplified)
  resetPassword: async (studentId, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users[studentId]) {
          // In a real app, this would update the password
          // For now, we'll just return success
          resolve({ message: "Password updated successfully" });
        } else {
          reject(new Error("User not found"));
        }
      }, 500);
    });
  }
};

// Mock data for IoT dashboard (since no hardware is connected)
export const mockSensorData = {
  temperature: 25.5,
  humidity: 60.2,
  light: 450,
  time: new Date().toISOString()
};

// Generate mock historical data
export const generateMockHistory = () => {
  const history = [];
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000)); // Every 5 minutes
    history.push({
      deviceId: 'esp8266-demo',
      deviceName: 'ESP8266 Demo',
      ip: '192.168.1.100',
      sensor: 'All',
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 40,
      light: 300 + Math.random() * 400,
      time: timestamp.toISOString()
    });
  }
  
  return history;
};

export default authService; 