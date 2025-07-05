import { useState, useEffect } from 'react';
import { mockSensorData, generateMockHistory } from '../services/userService';

export default function useSensorData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateLatest = () => {
      // Generate dynamic mock data with some variation
      const baseData = mockSensorData;
      const newData = {
        temperature: baseData.temperature + (Math.random() - 0.5) * 4, // ±2°C variation
        humidity: baseData.humidity + (Math.random() - 0.5) * 20, // ±10% variation
        light: baseData.light + (Math.random() - 0.5) * 200, // ±100 variation
        time: new Date().toISOString(),
        deviceId: 'esp8266-demo',
        deviceName: 'ESP8266 Demo'
      };
      setLatest(newData);
    };

    const loadHistory = () => {
      const mockHistory = generateMockHistory();
      setHistory(mockHistory);
    };

    // Initialize data
    generateLatest();
    loadHistory();
    
    // Update data periodically to simulate real sensor data
    const interval = setInterval(() => {
      generateLatest();
      // Optionally update history less frequently
      if (Math.random() < 0.1) { // 10% chance to update history
        loadHistory();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate max values
  const max = {
    temperature: history.length ? Math.max(...history.map(d => d.temperature || 0)) : undefined,
    humidity: history.length ? Math.max(...history.map(d => d.humidity || 0)) : undefined,
    light: history.length ? Math.max(...history.map(d => d.light || 0)) : undefined,
  };

  return { latest, history, max, error };
} 