import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OverallChart({ data, labels }) {
  const barThickness = labels.length <= 7 ? 28 : 18;

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
        stacked: true,
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
        stacked: true,
        beginAtZero: true,
        max: 200,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          font: {
            family: 'Poppins',
            size: 16,
          },
          stepSize: 40,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
        barThickness,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
      },
    },
    categoryPercentage: labels.length <= 7 ? 0.9 : 0.85,
    barPercentage: labels.length <= 7 ? 0.8 : 0.75,
  };

  const chartData = {
    labels,
    datasets: data.map((dataset) => ({
      label: dataset.name,
      data: dataset.data,
      backgroundColor: dataset.color,
      stack: 'Stack 0',
    })),
  };

  return <Bar options={options} data={chartData} />;
}