import React from 'react';
import { Slider, Switch, Typography, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './ControlCard.scss';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          '& input': {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  },
});

const ControlCard = ({
  type,
  enabled,
  startTime,
  endTime,
  value,
  onStartChange,
  onEndChange,
  onSwitchChange,
  onSliderChange,
  error,
  scheduleEnabled,
}) => {
  const labels = ['Cooling', 'Pump', 'Lights'];
  const icons = ['ac_unit', 'water_drop', 'lightbulb'];
  const iconColors = ['#10B981', '#0075FF', '#F59E0B'];

  return (
    <ThemeProvider theme={theme}>
      <div className="control-card">
        <div className="header">
          <div className="title">
            <span className="material-icons icon" style={{ color: iconColors[type] }}>
              {icons[type]}
            </span>
            <span>{labels[type]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status">{enabled ? 'On' : 'Off'}</span>
            <Switch
              checked={enabled}
              onChange={onSwitchChange}
              disabled={!scheduleEnabled}
              sx={{
                '& .MuiSwitch-thumb': { backgroundColor: iconColors[type] },
                '& .MuiSwitch-track': { backgroundColor: `${iconColors[type]}80` },
              }}
              inputProps={{ 'aria-label': `Toggle ${labels[type]} schedule` }}
            />
          </div>
        </div>
        <div className="time-pickers">
          <div className="time-picker">
            <span className="time-label">Start</span>
            <TimePicker
              value={startTime}
              onChange={onStartChange}
              disabled={!scheduleEnabled}
              minutesStep={15}
              ampm
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  className="time-input"
                  aria-label="Start time picker"
                  InputProps={{ style: { textAlign: 'center', paddingRight: '0.4rem' } }}
                />
              )}
            />
          </div>
          <div className="time-picker">
            <span className="time-label">End</span>
            <TimePicker
              value={endTime}
              onChange={onEndChange}
              disabled={!scheduleEnabled}
              minutesStep={15}
              ampm
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  className="time-input"
                  aria-label="End time picker"
                  InputProps={{ style: { textAlign: 'center', paddingRight: '0.4rem' } }}
                />
              )}
            />
          </div>
        </div>
        {error && (
          <Typography color="error" sx={{ fontSize: '12px', marginBottom: '0.5rem' }}>
            {error}
          </Typography>
        )}
        <div className="slider-container">
          <Slider
            value={value}
            onChange={(e, newValue) => onSliderChange(newValue)}
            min={0}
            max={100}
            disabled={!scheduleEnabled || !enabled}
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
            <span>{value}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ControlCard;