import React from 'react';
import { Slider, Switch } from '@mui/material';
import axios from 'axios';
import './ControlSwitch.scss';

const ControlSwitch = ({ type, device, sliderValue, onSliderChange, onSwitchChange, onDeviceStateChange }) => {
  const labels = ['Cooling', 'Pump', 'Lights'];
  const icons = ['ac_unit', 'water_drop', 'lightbulb'];
  const iconColors = ['#10B981', '#0075FF', '#F59E0B'];
  const feedIds = ['fan', 'pump', 'led'];
  const api_url = `http://localhost:3001/`;

  const handleSwitchChange = async (event) => {
    const newValue = event.target.checked;
    console.log(`Switch toggled for ${labels[type]} to ${newValue}`);

    try {
      onSwitchChange(type, newValue);
      console.log(`Updated state for ${labels[type]} to ${newValue}`);

      const feedId = feedIds[type];
      const dataToPublish = newValue ? '1' : '0';
      console.log(`Publishing to ${feedId}: ${dataToPublish}`);
      await axios.post(`${api_url}api/publish/${feedId}`, { data: dataToPublish });
      console.log(`Successfully published to ${feedId}`);

      const activityInfo = {
        userKey: 'heorey123',
        description: `Turn ${newValue ? 'on' : 'off'} the ${labels[type].toLowerCase()}`,
        deviceId: type,
        deviceName: labels[type],
        activityId: Date.now(),
      };
      await axios.post(`${api_url}activity`, { activityInfo });
      console.log(`Activity logged for ${labels[type]}`);
    } catch (error) {
      console.error(`Failed to update ${labels[type]} state:`, error.message);
    }
  };

  return (
    <div className="control-switch">
      <div className="header">
        <div className="title">
          <span className="material-icons icon" style={{ color: iconColors[type] }}>
            {icons[type]}
          </span>
          <span>{labels[type]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="status">{device.value ? `${labels[type]} On` : `${labels[type]} Off`}</span>
          <Switch
            checked={device.value}
            onChange={handleSwitchChange}
            sx={{
              '& .MuiSwitch-thumb': { backgroundColor: iconColors[type] },
              '& .MuiSwitch-track': { backgroundColor: `${iconColors[type]}80` },
            }}
            inputProps={{ 'aria-label': `Toggle ${labels[type]} manual control` }}
          />
        </div>
      </div>
      <div className="slider-container">
        <Slider
          value={sliderValue}
          onChange={(e, newValue) => onSliderChange(newValue)}
          min={0}
          max={100}
          disabled={!device.value}
          sx={{
            color: iconColors[type],
            height: 8,
            width: '100%',
            '& .MuiSlider-thumb': { height: 24, width: 24 },
          }}
          aria-label={`${labels[type]} intensity slider`}
        />
        <div className="slider-labels">
          <span>0%</span>
          <span>{sliderValue}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ControlSwitch;