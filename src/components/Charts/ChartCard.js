import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, 
  Chip, Fade, Tooltip, Badge, Stack, Zoom
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function ChartCard({ title, subtitle, children, onInteraction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (onInteraction) onInteraction();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setAnchorEl(null);
    setTimeout(() => setIsRefreshing(false), 1500);
    if (onInteraction) onInteraction();
  };

  const handleFullscreen = () => {
    setIsExpanded(!isExpanded);
    setAnchorEl(null);
    if (onInteraction) onInteraction();
  };

  const handleDownload = () => {
    setAnchorEl(null);
    if (onInteraction) onInteraction();
  };

  return (
    <Fade in timeout={600}>
      <Card 
        sx={{ 
          height: '100%',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15)',
            borderColor: 'rgba(102, 126, 234, 0.3)',
            '& .chart-actions': {
              opacity: 1,
              transform: 'translateY(0)',
            },
            '& .chart-gradient': {
              opacity: 1,
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            borderRadius: '20px 20px 0 0',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.03) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            borderRadius: '20px',
            className: 'chart-gradient'
          }
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Enhanced Header */}
          <Box sx={{ mb: 3, position: 'relative' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={subtitle ? 1 : 0}>
                  <Badge 
                    color="primary" 
                    variant="dot" 
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: 'pulse 2s infinite',
                        right: -2,
                        top: 2,
                      },
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(0.8)', opacity: 0.7 },
                        '50%': { transform: 'scale(1.2)', opacity: 1 },
                        '100%': { transform: 'scale(0.8)', opacity: 0.7 },
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#2d3748',
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {title}
                    </Typography>
                  </Badge>
                  
                  <Chip 
                    icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                    label="Live"
                    size="small"
                    color="success"
                    sx={{ 
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        animation: 'bounce 1s infinite',
                      },
                      '@keyframes bounce': {
                        '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                        '40%': { transform: 'translateY(-2px)' },
                        '60%': { transform: 'translateY(-1px)' },
                      }
                    }}
                  />
                </Box>
                
                {subtitle && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(45, 55, 72, 0.7)',
                      fontWeight: 500,
                      fontSize: '0.85rem'
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {/* Enhanced Action Buttons */}
              <Stack 
                direction="row" 
                spacing={0.5}
                className="chart-actions"
                sx={{
                  opacity: 0,
                  transform: 'translateY(-10px)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Tooltip title="Refresh Chart" arrow>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    sx={{
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'scale(1.1)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                      }
                    }}
                  >
                    <RefreshIcon 
                      sx={{ 
                        fontSize: 16,
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          from: { transform: 'rotate(0deg)' },
                          to: { transform: 'rotate(360deg)' },
                        }
                      }} 
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Fullscreen View" arrow>
                  <IconButton
                    size="small"
                    onClick={handleFullscreen}
                    sx={{
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <FullscreenIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="More Options" arrow>
                  <IconButton
                    size="small"
                    onClick={handleMenuClick}
                    sx={{
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            {/* Enhanced Options Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  minWidth: 180,
                  border: '1px solid rgba(0,0,0,0.1)',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem 
                onClick={handleDownload}
                sx={{ 
                  py: 1.5, 
                  borderRadius: '8px', 
                  mx: 1, 
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                <DownloadIcon sx={{ mr: 2, fontSize: 18, color: '#667eea' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Export Chart
                </Typography>
              </MenuItem>
              
              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  if (onInteraction) onInteraction();
                }}
                sx={{ 
                  py: 1.5, 
                  borderRadius: '8px', 
                  mx: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                <TrendingUpIcon sx={{ mr: 2, fontSize: 18, color: '#667eea' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  View Analytics
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Enhanced Chart Container */}
          <Box 
            sx={{ 
              flex: 1,
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,251,255,0.9) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(102, 126, 234, 0.15)',
              }
            }}
          >
            <Zoom in timeout={800}>
              <Box sx={{ width: '100%', height: '100%', p: 1 }}>
                {children}
              </Box>
            </Zoom>
            
            {/* Loading overlay */}
            {isRefreshing && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Box textAlign="center">
                  <RefreshIcon 
                    sx={{ 
                      fontSize: 40,
                      color: '#667eea',
                      animation: 'spin 1s linear infinite',
                      mb: 1,
                    }} 
                  />
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
                    Refreshing...
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}

export default ChartCard; 