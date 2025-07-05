import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://192.168.1.6:5000/data'; // Use your Flask server IP

function SensorData() {
  const [data, setData] = useState({ temperature: '', humidity: '', light: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(SERVER_URL);
      setData(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#222', color: '#fff', padding: 20, borderRadius: 8, width: 300 }}>
      <h2>Sensor Data</h2>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Temperature: <span style={{ color: '#FFD600' }}>{data.temperature} °C</span></li>
          <li>Humidity: <span style={{ color: '#FFD600' }}>{data.humidity} %</span></li>
          <li>Light: <span style={{ color: '#FFD600' }}>{data.light}</span></li>
        </ul>
      )}
    </div>
  );
}

export default SensorData; 