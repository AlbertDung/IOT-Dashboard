import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

// Dynamic import for better compatibility with Vercel
let autoTable;

const loadAutoTable = async () => {
  if (!autoTable) {
    try {
      // Try dynamic import first
      const autoTableModule = await import('jspdf-autotable');
      autoTable = autoTableModule.default || autoTableModule;
    } catch (error) {
      console.log('Dynamic import failed, trying require:', error);
      try {
        // Fallback to require
        require('jspdf-autotable');
        autoTable = true;
      } catch (requireError) {
        console.error('Failed to load jspdf-autotable:', requireError);
        throw new Error('Could not load PDF table plugin');
      }
    }
  }
};

// Utility function to format date for filenames
const formatDateForFilename = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace(/:/g, '-');
};

// Vercel-compatible PDF Export Function
export const exportToPDFVercel = async (data, filename, title = 'Data Export', headers = null) => {
  try {
    console.log('Starting Vercel-compatible PDF export with data:', data.length, 'records');
    
    // Ensure autoTable is loaded
    await loadAutoTable();
    
    const doc = new jsPDF();
    
    // Check if autoTable is available
    if (typeof doc.autoTable !== 'function') {
      console.error('autoTable is not available on jsPDF instance');
      throw new Error('PDF table plugin not loaded correctly');
    }
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Records: ${data.length}`, 14, 35);
    
    if (data.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('No data available to export', 14, 50);
    } else {
      // Prepare table data
      const tableHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : []);
      const tableData = data.map(row => 
        tableHeaders.map(header => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
          }
          return String(value || '');
        })
      );
      
      console.log('Table headers:', tableHeaders);
      console.log('Table data rows:', tableData.length);
      
      // Add table with error handling
      try {
        doc.autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: 45,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak',
            columnWidth: 'wrap'
          },
          headStyles: {
            fillColor: [102, 126, 234],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 45, left: 14, right: 14 },
          tableWidth: 'auto',
          showHead: 'everyPage',
        });
      } catch (tableError) {
        console.error('Error creating table:', tableError);
        throw new Error('Failed to create PDF table: ' + tableError.message);
      }
    }
    
    const timestamp = formatDateForFilename();
    const finalFilename = `${filename}_${timestamp}.pdf`;
    
    console.log('Saving PDF as:', finalFilename);
    doc.save(finalFilename);
    
    return { success: true, message: `PDF exported successfully! ${data.length} records exported.` };
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, message: 'Failed to export PDF: ' + error.message };
  }
};

// Logs-specific PDF export for Vercel
export const exportLogsToPDFVercel = async (logs) => {
  try {
    const processedLogs = logs.map(log => ({
      'Device ID': log.deviceId || '',
      'Device Name': log.deviceName || '',
      'IP Address': log.ip || '',
      'Sensor Type': log.sensor || '',
      'Value': log.value || '',
      'Unit': log.sensor === 'Temperature' ? '°C' : log.sensor === 'Humidity' ? '%' : 'lux',
      'Severity': log.severity || '',
      'Timestamp': log.time ? new Date(log.time).toLocaleString() : '',
      'Date': log.time ? new Date(log.time).toLocaleDateString() : '',
      'Time': log.time ? new Date(log.time).toLocaleTimeString() : '',
    }));

    const headers = [
      'Device ID', 'Device Name', 'IP Address', 'Sensor Type', 
      'Value', 'Unit', 'Severity', 'Timestamp', 'Date', 'Time'
    ];

    return await exportToPDFVercel(processedLogs, 'iot_logs', 'IoT Sensor Logs Report', headers);
  } catch (error) {
    console.error('Logs PDF Export Error:', error);
    return { success: false, message: 'Failed to export logs PDF: ' + error.message };
  }
};

// Charts-specific PDF export for Vercel
export const exportChartsToPDFVercel = async (history, timeRange = 'all') => {
  try {
    const processedData = history.map(entry => ({
      'Timestamp': entry.time ? new Date(entry.time).toLocaleString() : '',
      'Device ID': entry.deviceId || '',
      'Device Name': entry.deviceName || '',
      'IP Address': entry.ip || '',
      'Temperature (°C)': entry.temperature || '',
      'Humidity (%)': entry.humidity || '',
      'Light (lux)': entry.light || '',
      'Date': entry.time ? new Date(entry.time).toLocaleDateString() : '',
      'Time': entry.time ? new Date(entry.time).toLocaleTimeString() : '',
      'Time Range': timeRange,
    }));

    const headers = [
      'Timestamp', 'Device ID', 'Device Name', 'IP Address',
      'Temperature (°C)', 'Humidity (%)', 'Light (lux)', 'Date', 'Time', 'Time Range'
    ];

    const filename = `iot_analytics_${timeRange}`;
    const title = `IoT Analytics Report - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View`;

    return await exportToPDFVercel(processedData, filename, title, headers);
  } catch (error) {
    console.error('Charts PDF Export Error:', error);
    return { success: false, message: 'Failed to export charts PDF: ' + error.message };
  }
};

// Summary statistics PDF export for Vercel
export const exportSummaryToPDFVercel = async (data, type = 'logs') => {
  try {
    let stats = {};
    
    if (type === 'logs') {
      const deviceCounts = {};
      const sensorCounts = {};
      const severityCounts = { critical: 0, warning: 0, normal: 0 };
      
      data.forEach(log => {
        deviceCounts[log.deviceId] = (deviceCounts[log.deviceId] || 0) + 1;
        sensorCounts[log.sensor] = (sensorCounts[log.sensor] || 0) + 1;
        severityCounts[log.severity] = (severityCounts[log.severity] || 0) + 1;
      });
      
      stats = {
        'Total Logs': data.length,
        'Unique Devices': Object.keys(deviceCounts).length,
        'Critical Issues': severityCounts.critical,
        'Warnings': severityCounts.warning,
        'Normal Readings': severityCounts.normal,
        'Device Breakdown': JSON.stringify(deviceCounts),
        'Sensor Breakdown': JSON.stringify(sensorCounts),
        'Generated': new Date().toLocaleString(),
      };
    } else if (type === 'analytics') {
      const temperatures = data.filter(d => d.temperature).map(d => d.temperature);
      const humidities = data.filter(d => d.humidity).map(d => d.humidity);
      const lights = data.filter(d => d.light).map(d => d.light);
      
      stats = {
        'Total Data Points': data.length,
        'Average Temperature': temperatures.length ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(2) : 0,
        'Max Temperature': temperatures.length ? Math.max(...temperatures) : 0,
        'Min Temperature': temperatures.length ? Math.min(...temperatures) : 0,
        'Average Humidity': humidities.length ? (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(2) : 0,
        'Max Humidity': humidities.length ? Math.max(...humidities) : 0,
        'Min Humidity': humidities.length ? Math.min(...humidities) : 0,
        'Average Light': lights.length ? (lights.reduce((a, b) => a + b, 0) / lights.length).toFixed(2) : 0,
        'Max Light': lights.length ? Math.max(...lights) : 0,
        'Min Light': lights.length ? Math.min(...lights) : 0,
        'Date Range Start': data.length ? new Date(Math.min(...data.map(d => new Date(d.time)))).toLocaleString() : '',
        'Date Range End': data.length ? new Date(Math.max(...data.map(d => new Date(d.time)))).toLocaleString() : '',
        'Generated': new Date().toLocaleString(),
      };
    }
    
    // Convert stats object to array format for export
    const statsArray = Object.entries(stats).map(([key, value]) => ({
      'Metric': key,
      'Value': String(value)
    }));
    
    const filename = `iot_${type}_summary`;
    const title = `IoT ${type.charAt(0).toUpperCase() + type.slice(1)} Summary Report`;
    
    return await exportToPDFVercel(statsArray, filename, title, ['Metric', 'Value']);
  } catch (error) {
    console.error('Summary PDF Export Error:', error);
    return { success: false, message: 'Failed to export summary PDF: ' + error.message };
  }
}; 