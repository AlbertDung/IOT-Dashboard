import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

function ControlToggle({ label, checked, onChange }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} color="primary" />}
      label={label}
    />
  );
}

export default ControlToggle; 