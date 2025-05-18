import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://192.168.1.12:5000/';

export default function useDeviceStatus() {
  const [devices, setDevices] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/data`);
        setDevices(res.data.devices);
        setLastUpdated(res.data.lastUpdated);
      } catch (e) {
        setError('Error fetching device status');
      }
    };
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return { devices, lastUpdated, error };
} 