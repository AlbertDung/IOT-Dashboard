const axios = require('axios');

// Replace with your actual Flask server IP
const SERVER_URL = 'http://192.168.1.6:5000/data';

async function fetchData() {
  try {
    const response = await axios.get(SERVER_URL);
    console.clear(); // Optional: clears console for clean display
    console.log("=== Sensor Data ===");
    console.log("Temperature:", response.data.temperature, "°C");
    console.log("Humidity   :", response.data.humidity, "%");
    console.log("Light      :", response.data.light);
    console.log("====================");
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

// Fetch every 5 seconds
setInterval(fetchData, 5000);

// Optional: run once immediately
fetchData();
