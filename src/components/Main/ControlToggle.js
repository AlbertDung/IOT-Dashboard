import React from 'react';
import { FormControlLabel, Switch, Box, Typography } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoModeIcon from '@mui/icons-material/AutoMode';

function ControlToggle({ label, checked, onChange }) {
  const getIcon = (label) => {
    if (label.toLowerCase().includes('auto')) {
      return <AutoModeIcon color={checked ? 'primary' : 'action'} />;
    }
    return checked ? (
      <LightbulbIcon color="primary" />
    ) : (
      <LightbulbOutlinedIcon color="action" />
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        borderRadius: '8px',
        bgcolor: checked ? 'primary.light' : 'background.paper',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: checked ? 'primary.light' : 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getIcon(label)}
        <Typography
          variant="body1"
          sx={{
            color: checked ? 'primary.main' : 'text.primary',
            fontWeight: checked ? 600 : 400,
          }}
        >
          {label}
        </Typography>
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            color="primary"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                '& + .MuiSwitch-track': {
                  bgcolor: 'primary.main',
                },
              },
            }}
          />
        }
        label=""
      />
    </Box>
  );
}

export default ControlToggle; 