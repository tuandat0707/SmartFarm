import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Logs.scss';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:3001/notification');
      console.log('Raw API Response:', response.data);

      const notifications = response.data;

      if (!Array.isArray(notifications)) {
        throw new Error('Invalid notification data: Expected an array');
      }

      const mappedLogs = notifications.map((notification) => ({
        date: new Date(notification.createdAt).toLocaleDateString('en', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        time: new Date(notification.createdAt).toLocaleTimeString('en', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        account: notification.userKey || 'Unknown',
        activity: notification.description || 'No description',
      })).slice(-10); // Limit to the latest 10 records

      setLogs(mappedLogs);
    } catch (err) {
      console.error('Fetch Notifications Error:', err.message);
      setError('Failed to fetch notifications. Please try again later.');
      if (err.response) {
        console.error('Response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Removed setInterval to prevent automatic updates
  }, []); // Empty dependency array ensures this runs only on mount

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading<span className="dots"></span></div>
        <div className="loading-subtext">Fetching notification logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>{error}</div>
        <button className="retry-button" onClick={fetchNotifications}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="logs">
      <table className="logs-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Account</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4">No notifications available.</td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={index}>
                <td>{log.date}</td>
                <td>{log.time}</td>
                <td>{log.account}</td>
                <td>{log.activity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;