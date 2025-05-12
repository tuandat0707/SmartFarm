import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function GaugeCard({ data }) {
  const { name, curVal, postfix, color, icon, maxVal } = data;
  const normalizedValue = postfix === '%' ? curVal : (curVal / maxVal) * 100; // Normalize for progress (0-100)

  return (
    <div className="gauge-card">
      <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#111111', fontSize: '16px' }}>
        {name}
      </Typography>
      <div className="gauge-card-body">
        <div className="gauge-wrapper">
          <CircularProgress
            variant="determinate"
            value={normalizedValue}
            size={100}
            thickness={4}
            sx={{ color }}
          />
          <div className="gauge-value">
            <Typography sx={{ fontFamily: 'Inter', fontSize: '24px', fontWeight: 'bold' }}>
              {curVal}{postfix}
            </Typography>
          </div>
        </div>
        <FontAwesomeIcon icon={icon} style={{ color, fontSize: '30px' }} />
      </div>
    </div>
  );
}