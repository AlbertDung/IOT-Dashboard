import React from 'react';
import { FormControlLabel, Switch, Box, Typography, Zoom, Paper } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoModeIcon from '@mui/icons-material/AutoMode';

function ControlToggle({ label, checked, onChange, description }) {
  const getIcon = (label) => {
    if (label.toLowerCase().includes('auto') || label.includes('🤖')) {
      return <AutoModeIcon sx={{ 
        color: checked ? '#667eea' : '#9e9e9e',
        fontSize: 24,
        transition: 'all 0.3s ease',
        transform: checked ? 'scale(1.1)' : 'scale(1)'
      }} />;
    }
    return checked ? (
      <LightbulbIcon sx={{ 
        color: '#ffc107',
        fontSize: 24,
        filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.4))',
        transition: 'all 0.3s ease',
        transform: 'scale(1.1)'
      }} />
    ) : (
      <LightbulbOutlinedIcon sx={{ 
        color: '#9e9e9e',
        fontSize: 24,
        transition: 'all 0.3s ease'
      }} />
    );
  };

  return (
    <Zoom in timeout={400}>
      <Paper
        elevation={checked ? 4 : 1}
        sx={{
          borderRadius: '16px',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          background: checked 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: checked 
            ? '2px solid rgba(102, 126, 234, 0.2)' 
            : '1px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: checked 
              ? '0 8px 32px rgba(102, 126, 234, 0.2)'
              : '0 4px 20px rgba(0,0,0,0.1)',
            '& .control-glow': {
              opacity: 1,
            }
          },
          '&::before': checked ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
          } : {},
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.preventDefault();
            onChange({ target: { checked: !checked } });
          }}
        >
          {/* Glowing effect on hover */}
          <Box 
            className="control-glow"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: checked 
                ? 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(158, 158, 158, 0.1) 0%, transparent 70%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: checked ? 'rgba(102, 126, 234, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                transition: 'all 0.3s ease',
                transform: checked ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {getIcon(label)}
            </Box>
            
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: checked ? '#667eea' : '#2d3748',
                  fontWeight: checked ? 700 : 600,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  mb: description ? 0.5 : 0,
                }}
              >
                {label}
              </Typography>
              
              {description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={onChange}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                      color: '#667eea',
                      '& + .MuiSwitch-track': {
                        bgcolor: '#667eea',
                        opacity: 0.7,
                      },
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                      },
                    },
                  },
                  '& .MuiSwitch-track': {
                    bgcolor: '#d1d5db',
                    opacity: 1,
                    transition: 'all 0.3s ease',
                  },
                  '& .MuiSwitch-thumb': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                  },
                }}
              />
            }
            label=""
            sx={{ m: 0 }}
          />
        </Box>
      </Paper>
    </Zoom>
  );
}

export default ControlToggle; 