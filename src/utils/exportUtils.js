import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

// Ensure autoTable plugin is loaded
if (typeof jsPDF.API.autoTable === 'undefined') {
  require('jspdf-autotable');
}

// Utility function to format date for filenames
const formatDateForFilename = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace(/:/g, '-');
};

// CSV Export Functions
export const exportToCSV = (data, filename, headers = null) => {
  try {
    let csvContent = '';
    
    if (headers) {
      csvContent += headers.join(',') + '\n';
    } else if (data.length > 0) {
      csvContent += Object.keys(data[0]).join(',') + '\n';
    }
    
    data.forEach(row => {
      const values = headers ? 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Escape commas and quotes
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }) :
        Object.values(row).map(value => {
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        });
      csvContent += values.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const timestamp = formatDateForFilename();
    saveAs(blob, `${filename}_${timestamp}.csv`);
    
    return { success: true, message: `CSV exported successfully! ${data.length} records exported.` };
  } catch (error) {
    console.error('CSV Export Error:', error);
    return { success: false, message: 'Failed to export CSV: ' + error.message };
  }
};

// JSON Export Functions
export const exportToJSON = (data, filename) => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const timestamp = formatDateForFilename();
    saveAs(blob, `${filename}_${timestamp}.json`);
    
    return { success: true, message: `JSON exported successfully! ${data.length} records exported.` };
  } catch (error) {
    console.error('JSON Export Error:', error);
    return { success: false, message: 'Failed to export JSON: ' + error.message };
  }
};

// Excel Export Functions
export const exportToExcel = (data, filename, sheetName = 'Data') => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Auto-adjust column widths
    const colWidths = [];
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key, index) => {
        const maxLength = Math.max(
          key.length,
          ...data.map(row => String(row[key] || '').length)
        );
        colWidths[index] = { wch: Math.min(maxLength + 2, 50) };
      });
      worksheet['!cols'] = colWidths;
    }
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const timestamp = formatDateForFilename();
    XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
    
    return { success: true, message: `Excel exported successfully! ${data.length} records exported.` };
  } catch (error) {
    console.error('Excel Export Error:', error);
    return { success: false, message: 'Failed to export Excel: ' + error.message };
  }
};

// PDF Export Functions
export const exportToPDF = (data, filename, title = 'Data Export', headers = null) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Records: ${data.length}`, 14, 35);
    
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
    
    // Add table using autoTable plugin
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 3,
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
    });
    
    const timestamp = formatDateForFilename();
    doc.save(`${filename}_${timestamp}.pdf`);
    
    return { success: true, message: `PDF exported successfully! ${data.length} records exported.` };
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, message: 'Failed to export PDF: ' + error.message };
  }
};

// Chart Export Functions
export const exportChartAsPNG = async (chartElementId, filename) => {
  try {
    const chartElement = document.getElementById(chartElementId);
    if (!chartElement) {
      throw new Error('Chart element not found');
    }
    
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });
    
    canvas.toBlob((blob) => {
      const timestamp = formatDateForFilename();
      saveAs(blob, `${filename}_chart_${timestamp}.png`);
    });
    
    return { success: true, message: 'Chart exported as PNG successfully!' };
  } catch (error) {
    console.error('Chart PNG Export Error:', error);
    return { success: false, message: 'Failed to export chart: ' + error.message };
  }
};

// Logs-specific export function
export const exportLogsData = (logs, format) => {
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

  switch (format) {
    case 'csv':
      return exportToCSV(processedLogs, 'iot_logs', headers);
    case 'json':
      return exportToJSON(processedLogs, 'iot_logs');
    case 'excel':
      return exportToExcel(processedLogs, 'iot_logs', 'IoT Sensor Logs');
    case 'pdf':
      return exportToPDF(processedLogs, 'iot_logs', 'IoT Sensor Logs Report', headers);
    default:
      return { success: false, message: 'Unsupported export format' };
  }
};

// Charts-specific export function
export const exportChartsData = (history, format, timeRange = 'all') => {
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

  switch (format) {
    case 'csv':
      return exportToCSV(processedData, filename, headers);
    case 'json':
      return exportToJSON(processedData, filename);
    case 'excel':
      return exportToExcel(processedData, filename, 'IoT Analytics Data');
    case 'pdf':
      return exportToPDF(processedData, filename, title, headers);
    default:
      return { success: false, message: 'Unsupported export format' };
  }
};

// Summary/Statistics export
export const exportSummaryStats = (data, format, type = 'logs') => {
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
      'Device Breakdown': deviceCounts,
      'Sensor Breakdown': sensorCounts,
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
    'Value': typeof value === 'object' ? JSON.stringify(value) : value
  }));
  
  const filename = `iot_${type}_summary`;
  const title = `IoT ${type.charAt(0).toUpperCase() + type.slice(1)} Summary Report`;
  
  switch (format) {
    case 'csv':
      return exportToCSV(statsArray, filename, ['Metric', 'Value']);
    case 'json':
      return exportToJSON(stats, filename);
    case 'excel':
      return exportToExcel(statsArray, filename, 'Summary Statistics');
    case 'pdf':
      return exportToPDF(statsArray, filename, title, ['Metric', 'Value']);
    default:
      return { success: false, message: 'Unsupported export format' };
  }
}; 