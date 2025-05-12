import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGlobalContext } from '../../../context/index';
import ControlSwitch from './ControlSwitch';
import './ManualControl.scss';

const ManualControl = () => {
  const { lightBtn, airBtn, pumperBtn } = useGlobalContext();
  const { user } = useAuthContext();

  const [devices, setDevices] = useState([
    { feed_id: 'fan', value: false, sliderValue: 100 },
    { feed_id: 'pumper', value: false, sliderValue: 100 },
    { feed_id: 'led', value: false, sliderValue: 100 },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch the latest toggle state from notifications on mount
  useEffect(() => {
    const fetchLatestDeviceStates = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/notification');
        const notifications = response.data;

        if (!Array.isArray(notifications)) {
          throw new Error('Invalid notification data: Expected an array');
        }

        // Filter and sort notifications for each device to get the latest action
        const updatedDevices = devices.map((device) => {
          const deviceNotifications = notifications
            .filter((notif) => notif.description.includes(device.feed_id) && notif.description.includes('turned'))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          const latestAction = deviceNotifications[0];
          const isOn = latestAction && latestAction.description.includes('turned on');
          return {
            ...device,
            value: latestAction ? isOn : device.value, // Use the latest state if available
          };
        });

        setDevices(updatedDevices);
      } catch (error) {
        console.error('Failed to fetch device states:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDeviceStates();
  }, []);

  // Sync with global context only if the values differ
  useEffect(() => {
    const updatedDevices = devices.map((device, idx) => {
      let newValue;
      switch (device.feed_id) {
        case 'fan':
          newValue = airBtn === '0' ? false : true;
          break;
        case 'pumper':
          newValue = pumperBtn === '1' ? true : false;
          break;
        case 'led':
          newValue = lightBtn === '1' ? true : false;
          break;
        default:
          newValue = device.value;
      }
      return device.value !== newValue ? { ...device, value: newValue } : device;
    });
    if (JSON.stringify(devices) !== JSON.stringify(updatedDevices)) {
      setDevices(updatedDevices);
    }
  }, [airBtn, pumperBtn, lightBtn]);

  const handleSliderChange = (index, newValue) => {
    setDevices((prev) =>
      prev.map((device, idx) =>
        idx === index ? { ...device, sliderValue: newValue } : device
      )
    );
  };

  const handleSwitchChange = async (index) => {
    setDevices((prev) =>
      prev.map((device, idx) =>
        idx === index ? { ...device, value: !device.value } : device
      )
    );

    const updatedDevices = devices.map((device, idx) =>
      idx === index ? { ...device, value: !device.value } : device
    );
    const device = updatedDevices[index];
    const action = device.value ? 'turned on' : 'turned off';
    const username = user ? user.username : 'Unknown';

    try {
      const notificationUrl = 'http://localhost:3001/notification';
      const notificationResponse = await axios.post(notificationUrl, {
        notificationInfo: {
          description: `User ${username} ${action} ${device.feed_id}`,
          userKey: username,
          notificationId: Date.now(),
        },
      });
      console.log('ManualControl.jsx: Notification response:', notificationResponse.data);
    } catch (notificationError) {
      console.error('ManualControl.jsx: Failed to post notification:', notificationError.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading<span className="dots"></span></div>
        <div className="loading-subtext">Fetching device states...</div>
      </div>
    );
  }

  return (
    <div className="div-6a">
      {devices.map((device, idx) => (
        <div className={`div-6b div-${idx}`} key={idx}>
          <ControlSwitch
            type={idx}
            device={device}
            sliderValue={device.sliderValue}
            onSliderChange={(value) => handleSliderChange(idx, value)}
            onSwitchChange={() => handleSwitchChange(idx)}
          />
        </div>
      ))}
    </div>
  );
};

export default ManualControl;