import React, { useState } from 'react';
import { Typography } from '@mui/material';
import ControlCard from './ControlCard';
import dayjs from 'dayjs';
import './ScheduledControl.scss';

const ScheduledControl = ({ scheduleEnabled }) => {
  const [schedules, setSchedules] = useState({
    cooling: { start: dayjs().set('hour', 6).set('minute', 0), end: dayjs().set('hour', 18).set('minute', 0), enabled: true, value: 100 },
    pump: { start: dayjs().set('hour', 8).set('minute', 0), end: dayjs().set('hour', 17).set('minute', 0), enabled: false, value: 100 },
    lights: { start: dayjs().set('hour', 7).set('minute', 0), end: dayjs().set('hour', 20).set('minute', 0), enabled: true, value: 100 },
  });

  const [errors, setErrors] = useState({ cooling: '', pump: '', lights: '' });

  const handleTimeChange = (device, field, value) => {
    const newSchedules = {
      ...schedules,
      [device]: {
        ...schedules[device],
        [field]: value,
      },
    };

    const start = newSchedules[device].start;
    const end = newSchedules[device].end;
    if (start && end) {
      if (end.isBefore(start)) {
        setErrors((prev) => ({
          ...prev,
          [device]: 'End time must be after start time',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [device]: '',
        }));
      }
    }

    setSchedules(newSchedules);
  };

  const handleSwitchChange = (device) => {
    setSchedules((prev) => ({
      ...prev,
      [device]: {
        ...prev[device],
        enabled: !prev[device].enabled,
      },
    }));
  };

  const handleSliderChange = (device, value) => {
    setSchedules((prev) => ({
      ...prev,
      [device]: {
        ...prev[device],
        value,
      },
    }));
  };

  return (
    <div className="div-38">
      <div className="div-39">
        <ControlCard
          type={0}
          enabled={schedules.cooling.enabled}
          startTime={schedules.cooling.start}
          endTime={schedules.cooling.end}
          value={schedules.cooling.value}
          onStartChange={(value) => handleTimeChange('cooling', 'start', value)}
          onEndChange={(value) => handleTimeChange('cooling', 'end', value)}
          onSwitchChange={() => handleSwitchChange('cooling')}
          onSliderChange={(value) => handleSliderChange('cooling', value)}
          error={errors.cooling}
          scheduleEnabled={scheduleEnabled}
        />
      </div>
      <div className="div-44">
        <ControlCard
          type={1}
          enabled={schedules.pump.enabled}
          startTime={schedules.pump.start}
          endTime={schedules.pump.end}
          value={schedules.pump.value}
          onStartChange={(value) => handleTimeChange('pump', 'start', value)}
          onEndChange={(value) => handleTimeChange('pump', 'end', value)}
          onSwitchChange={() => handleSwitchChange('pump')}
          onSliderChange={(value) => handleSliderChange('pump', value)}
          error={errors.pump}
          scheduleEnabled={scheduleEnabled}
        />
      </div>
      <div className="div-53">
        <ControlCard
          type={2}
          enabled={schedules.lights.enabled}
          startTime={schedules.lights.start}
          endTime={schedules.lights.end}
          value={schedules.lights.value}
          onStartChange={(value) => handleTimeChange('lights', 'start', value)}
          onEndChange={(value) => handleTimeChange('lights', 'end', value)}
          onSwitchChange={() => handleSwitchChange('lights')}
          onSliderChange={(value) => handleSliderChange('lights', value)}
          error={errors.lights}
          scheduleEnabled={scheduleEnabled}
        />
      </div>
    </div>
  );
};

export default ScheduledControl;