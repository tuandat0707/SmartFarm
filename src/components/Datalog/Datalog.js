import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import axios from 'axios';
import './style.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Datalog() {
  const [mode, setMode] = useState(0);
  const [timePeriod, setTimePeriod] = useState('week');
  const [data, setData] = useState([
    { name: 'Temperature', color: 'rgb(15, 136, 249)', data: [] },
    { name: 'Humidity', color: '#10B981', data: [] },
    { name: 'Soil', color: 'rgb(252, 163, 61)', data: [] },
  ]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let newData = [
        { name: 'Temperature', color: 'rgb(15, 136, 249)', data: [] },
        { name: 'Humidity', color: '#10B981', data: [] },
        { name: 'Soil', color: 'rgb(252, 163, 61)', data: [] },
      ];
      let newLabels = [];

      if (timePeriod === 'week') {
        const response = await axios.get('http://localhost:3001/daily-average7days');
        console.log('Raw API Response (Week):', response.data);

        const { temperature = [], humid = [], soil = [] } = response.data || {};

        if (!Array.isArray(temperature) || !Array.isArray(humid) || !Array.isArray(soil)) {
          throw new Error('Invalid sensor data: Expected arrays for temperature, humid, soil');
        }

        console.log('Processed Arrays:', { temperature, humid, soil });

        newLabels = temperature.length > 0
          ? temperature.map((day) =>
              day.date
                ? new Date(day.date).toLocaleDateString('en', { month: 'short', day: '2-digit', timeZone: 'UTC' })
                : 'Unknown'
            )
          : [];

        newData = [
          {
            name: 'Temperature',
            color: 'rgb(15, 136, 249)',
            data: temperature.map((day) => (day.average != null ? parseFloat(day.average.toFixed(1)) : 0)),
          },
          {
            name: 'Humidity',
            color: '#10B981',
            data: humid.map((day) => (day.average != null ? parseFloat(day.average.toFixed(1)) : 0)),
          },
          {
            name: 'Soil',
            color: 'rgb(252, 163, 61)',
            data: soil.map((day) => (day.average != null ? parseFloat(day.average.toFixed(1)) : 0)),
          },
        ];

        console.log('New Labels:', newLabels);
        console.log('New Data:', newData);
      } else if (timePeriod === 'month') {
        const response = await axios.get('http://localhost:3001/monthly-avg-1year');
        console.log('Raw API Response (Month):', response.data);

        const { temperature = [], humid = [], soil = [] } = response.data || {};

        if (!Array.isArray(temperature) || !Array.isArray(humid) || !Array.isArray(soil)) {
          throw new Error('Invalid sensor data: Expected arrays for temperature, humid, soil');
        }

        newLabels = temperature.length > 0
          ? temperature.map((month) => {
              if (!month.month) return 'Unknown';
              const [year, mon] = month.month.split('-');
              return `${new Date(0, mon - 1).toLocaleString('en', { month: 'short' })} ${year}`;
            })
          : [];

        newData = [
          {
            name: 'Temperature',
            color: 'rgb(15, 136, 249)',
            data: temperature.map((month) => (month.average != null ? parseFloat(month.average.toFixed(1)) : 0)),
          },
          {
            name: 'Humidity',
            color: '#10B981',
            data: humid.map((month) => (month.average != null ? parseFloat(month.average.toFixed(1)) : 0)),
          },
          {
            name: 'Soil',
            color: 'rgb(252, 163, 61)',
            data: soil.map((month) => (month.average != null ? parseFloat(month.average.toFixed(1)) : 0)),
          },
        ];

        console.log('New Labels:', newLabels);
        console.log('New Data:', newData);
      }

      if (newLabels.length === 0 || newData.some((d) => d.data.length === 0)) {
        throw new Error('No data available for the selected period');
      }

      setData(newData);
      setLabels(newLabels);
      console.log('Final Chart Data:', {
        labels: newLabels,
        datasets: newData,
      });
    } catch (error) {
      console.error('Fetch Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError(error.message || 'Failed to fetch datalog data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const barThickness = timePeriod === 'week' ? 28 : 24;

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          font: {
            family: 'Poppins',
            size: 16,
          },
          padding: 20,
          filter: (legendItem, chartData) => {
            const labels = chartData.datasets.map(dataset => dataset.label);
            return labels.indexOf(legendItem.text) === legendItem.datasetIndex;
          },
        },
      },
      tooltip: {
        bodyFont: {
          family: 'Poppins',
        },
      },
    },
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: true,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Poppins',
            size: 16,
          },
        },
        offset: true,
      },
      y: {
        beginAtZero: true,
        max: data[mode].data.length > 0 ? Math.max(...data[mode].data) * 1.1 : 100,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          font: {
            family: 'Poppins',
            size: 16,
          },
          stepSize: data[mode].data.length > 0 ? Math.max(...data[mode].data) / 10 || 10 : 10,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
        barThickness,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 5,
        hoverRadius: 7,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
      },
    },
    categoryPercentage: 0.8,
    barPercentage: 0.7,
  };

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: data[mode].name,
        data: data[mode].data,
        backgroundColor: data[mode].color,
      },
      {
        type: 'line',
        label: data[mode].name,
        data: data[mode].data,
        borderColor: data[mode].color,
        fill: false,
      },
    ],
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading<span className="dots"></span></div>
        <div className="loading-subtext">Fetching sensor data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>{error}</div>
        <button className="retry-button" onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  if (labels.length === 0 || data[mode].data.length === 0) {
    return <div>No data available for the selected period.</div>;
  }

  return (
    <div className="datalog">
      <div className="datalog-left">
        <button
          style={{ background: mode === 0 && data[mode].color }}
          onClick={() => setMode(0)}
          className={mode === 0 ? 'active' : ''}
        >
          Temperature
        </button>
        <button
          style={{ background: mode === 1 && data[mode].color }}
          onClick={() => setMode(1)}
          className={mode === 1 ? 'active' : ''}
        >
          Humidity
        </button>
        <button
          style={{ background: mode === 2 && data[mode].color }}
          onClick={() => setMode(2)}
          className={mode === 2 ? 'active' : ''}
        >
          Soil
        </button>
      </div>
      <div className="datalog-right">
        <Chart type="bar" options={options} data={chartData} />
        <div className="mode-diag">
          <button
            onClick={() => setTimePeriod('week')}
            className={timePeriod === 'week' ? 'active' : ''}
          >
            Week
          </button>
          <button
            onClick={() => setTimePeriod('month')}
            className={timePeriod === 'month' ? 'active' : ''}
          >
            Month
          </button>
        </div>
      </div>
    </div>
  );
}