import { useState, useEffect } from 'react';

export default function useDeviceStatus() {
  const [devices, setDevices] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateDeviceStatus = () => {
      // Mock device data
      const mockDevices = [
        {
          id: 'esp8266-demo',
          name: 'ESP8266 Demo',
          status: true,
          lastSeen: new Date().toLocaleString(),
          ip: '192.168.1.100'
        },
        {
          id: 'esp8266-backup',
          name: 'ESP8266 Backup',
          status: Math.random() > 0.3, // 70% chance to be online
          lastSeen: new Date(Date.now() - Math.random() * 300000).toLocaleString(), // Random time in last 5 minutes
          ip: '192.168.1.101'
        }
      ];
      
      setDevices(mockDevices);
      setLastUpdated(new Date().toISOString());
    };

    generateDeviceStatus();
    const interval = setInterval(generateDeviceStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return { devices, lastUpdated, error };
} 