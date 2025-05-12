import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Typography } from '@mui/material';
import { StyledSwitch } from '../components/Control/ManualControl/ControlSwitch/styles';
import ScheduledControl from '../components/Control/ScheduledControl';
import ManualControl from '../components/Control/ManualControl';
import './Controls.scss';

const Controls = () => {
  const [scheduleEnabled, setScheduleEnabled] = useState(true);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="main-container">
        <div className="main-body">
          <div className="inner-div">
            <div className="div-33">
              <div className="header">
                <div className="div-34">
                  <span className="controls-35">Controls</span>
                  <span className="manage-farm-systems">Manage farm systems and schedules</span>
                </div>
              </div>
              <div className="section">
                <div className="flex-row-fe">
                  <div>
                    <span className="schedule-settings">Schedule Settings</span>
                    <Typography variant="subtitle2" sx={{ color: '#757575', fontSize: '14px' }}>
                      Automated system timings
                    </Typography>
                  </div>
                  <div className="div-36">
                    <StyledSwitch
                      checked={scheduleEnabled}
                      onChange={() => setScheduleEnabled((prev) => !prev)}
                      inputProps={{ 'aria-label': 'Toggle schedule settings' }}
                    />
                    <span className="schedule-toggle-label">{scheduleEnabled ? 'On' : 'Off'}</span>
                  </div>
                </div>
                {scheduleEnabled && <ScheduledControl scheduleEnabled={scheduleEnabled} />}
              </div>
              <div className="section-69">
                <div>
                  <span className="manual-controls">Manual Controls</span>
                  <Typography variant="subtitle2" sx={{ color: '#757575', fontSize: '14px' }}>
                    Manually override automation
                  </Typography>
                </div>
                <ManualControl />
              </div>
            </div>
          </div>
        </div>
      </Box>
    </LocalizationProvider>
  );
};

export default Controls;