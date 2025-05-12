import React from 'react';
import { Typography } from '@mui/material';

export default function GaugeCard({ data }) {
  const { name, curVal, postfix, color, textColor, bgColor, maxVal } = data;
  const normalizedValue = postfix === '%' ? curVal : (curVal / maxVal) * 100;

  return (
    <div className="gauge-card" style={{ backgroundColor: bgColor }}>
      <div className="gauge-header">
        <Typography className="gauge-title">{name}</Typography>
        <Typography className="gauge-value" style={{ color: textColor }}>
          {curVal}{postfix}
        </Typography>
      </div>
      <div className="gauge-body">
        <div className="gauge-circle" style={{ borderColor: color }}>
          <Typography className="gauge-circle-value" style={{ color: textColor }}>
            {curVal}{postfix}
          </Typography>
        </div>
      </div>
    </div>
  );
}