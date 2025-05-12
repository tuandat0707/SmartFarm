import React, { useState, useEffect } from 'react';
import GaugeCard from './GaugeCard';
import OverallChart from './OverallChart';
import { Typography, Box } from '@mui/material';
import axios from 'axios';
import './style.scss';
import { faThermometerHalf, faTint, faLeaf } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sensor data for gauges with polling
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/record?sort=desc&_=${Date.now()}`, {
          timeout: 10000,
        });
        console.log('Raw API response:', response.data);

        if (!response.data || response.data.length === 0) {
          throw new Error('No records found in response');
        }

        const sortedRecords = response.data;

        const latestRecords = {
          temperature: sortedRecords
            .filter(r => r.sensorName === 'temperature' && r.value != null)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
          humid: sortedRecords
            .filter(r => r.sensorName === 'humid' && r.value != null)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
          soil: sortedRecords
            .filter(r => r.sensorName === 'soil' && r.value != null)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
        };

        console.log('Latest records:', {
          temperature: latestRecords.temperature ? { value: latestRecords.temperature.value, createdAt: latestRecords.temperature.createdAt } : null,
          humid: latestRecords.humid ? { value: latestRecords.humid.value, createdAt: latestRecords.humid.createdAt } : null,
          soil: latestRecords.soil ? { value: latestRecords.soil.value, createdAt: latestRecords.soil.createdAt } : null,
        });

        if (!latestRecords.temperature || !latestRecords.humid || !latestRecords.soil) {
          console.warn('Missing sensor data:', latestRecords);
          return; // Retain previous state instead of setting mock data
        }

        const temperature = parseFloat(latestRecords.temperature.value);
        const humidity = parseFloat(latestRecords.humid.value);
        const soilMoisture = parseFloat(latestRecords.soil.value);

        if (isNaN(temperature) || isNaN(humidity) || isNaN(soilMoisture)) {
          throw new Error(`Invalid sensor values: ${JSON.stringify({ temperature, humidity, soilMoisture })}`);
        }

        setSensorData({
          temperature: parseFloat(temperature.toFixed(1)),
          humidity: parseFloat(humidity.toFixed(1)),
          soilMoisture: parseFloat(soilMoisture.toFixed(1)),
        });
      } catch (error) {
        console.error('Error fetching sensor data:', {
          message: error.message,
          response: error.response ? error.response.data : null,
          status: error.response ? error.response.status : null,
        });
        alert('Failed to fetch sensor data. Check console for details.');
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 60000); // Poll every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Fetch chart data on mount only
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/daily-average7days');
        console.log('API Response:', response.data);
        console.log('Raw API dates:', response.data.temperature.map(day => day.date));
        const { temperature, humid, soil } = response.data;

        if (!temperature || !humid || !soil || !temperature.length || !humid.length || !soil.length) {
          throw new Error('Invalid API response: Missing or empty data');
        }

        // Use API dates directly as strings
        const dates = temperature.map(day => day.date);
        console.log('Processed dates:', dates);
        console.log('Chart labels (final):', dates);

        const transformedData = [
          {
            name: 'Temperature',
            color: '#3B82F6',
            data: temperature.map((day) => day.average || 0),
          },
          {
            name: 'Humidity',
            color: '#10B981',
            data: humid.map((day) => day.average || 0),
          },
          {
            name: 'Soil',
            color: '#F59E0B',
            data: soil.map((day) => day.average || 0),
          },
        ];

        setLabels(dates);
        setChartData(transformedData);
      } catch (error) {
        console.error('Error fetching chart data:', error.message);
        const fallbackLabels = [
          '2025-05-06',
          '2025-05-07',
          '2025-05-08',
          '2025-05-09',
          '2025-05-10',
          '2025-05-11',
          '2025-05-12',
        ];
        console.log('Fallback dates:', fallbackLabels);
        const fallbackData = [
          {
            name: 'Temperature',
            color: '#3B82F6',
            data: [24.5, 25.0, 24.8, 25.2, 25.5, 25.7, 26.0],
          },
          {
            name: 'Humidity',
            color: '#10B981',
            data: [55.0, 56.0, 57.0, 56.5, 57.5, 57.75, 58.0],
          },
          {
            name: 'Soil',
            color: '#F59E0B',
            data: [1.0, 1.02, 1.03, 1.04, 1.05, 1.04, 1.06],
          },
        ];
        console.log('Chart labels (final, fallback):', fallbackLabels);
        setLabels(fallbackLabels);
        setChartData(fallbackData);
      } finally {{
        setLoading(false);
      }}
    };

    fetchChartData();
  }, []);

  const gaugeData = [
    {
      name: 'Humidity',
      curVal: sensorData.humidity,
      postfix: '%',
      color: '#10B981',
      textColor: '#10B981',
      bgColor: '#ECFDF5',
      maxVal: 100,
      icon: faTint,
    },
    {
      name: 'Temperature',
      curVal: sensorData.temperature,
      postfix: '°C',
      color: '#3B82F6',
      textColor: '#3B82F6',
      bgColor: '#EFF6FF',
      maxVal: 50,
      icon: faThermometerHalf,
    },
    {
      name: 'Soil',
      curVal: sensorData.soilMoisture,
      postfix: '%',
      color: '#F59E0B',
      textColor: '#F59E0B',
      bgColor: '#FFF8EB',
      maxVal: 100,
      icon: faLeaf,
    },
  ];

  const assessHealth = () => {
    return {
      status: 'Healthy',
      color: '#10B981',
    };
  };

  const healthStatus = assessHealth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading<span className="dots"></span></div>
        <div className="loading-subtext">Fetching dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header"></div>
      <div className="dashboard-gauges">
        {gaugeData.map((data, index) => (
          <GaugeCard key={index} data={data} />
        ))}
      </div>
      <div className="dashboard-content">
        <div className="dashboard-content-left">
          <div className="dashboard-content-left-header">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography className="chart-title">Overall (Last 7 Days)</Typography>
            </Box>
          </div>
          <OverallChart data={chartData} labels={labels} />
        </div>
        <div className="dashboard-content-right">
          <div className="health-card">
            <Typography className="health-title">Overall Health</Typography>
            <div className="health-status">
              <div className="health-check"></div>
              <Typography className="health-text">{healthStatus.status}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}