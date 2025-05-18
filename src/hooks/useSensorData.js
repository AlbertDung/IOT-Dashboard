import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://192.168.1.12:5000/';

export default function useSensorData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get(`${API_BASE}/data`);
        setLatest(res.data);
      } catch (e) {
        setError('Error fetching latest data');
      }
    };
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/history`);
        setHistory(res.data); // [{temperature, humidity, light, time, ...}]
      } catch (e) {
        setError('Error fetching history');
      }
    };
    fetchLatest();
    fetchHistory();
    const interval = setInterval(() => {
      fetchLatest();
      fetchHistory();
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