import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthLayout from './AuthLayout';
import { authService } from '../../services/userService';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // For demo purposes, we'll just simulate success
      // In a real app, you'd validate the token and update the password
      await authService.resetPassword('demo', password);
      setSuccess('Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.');
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" mb={2} align="center" fontWeight={700}>
        Đặt lại mật khẩu
      </Typography>
      <form onSubmit={handleReset} autoComplete="on">
        <TextField
          label="Mật khẩu mới"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(s => !s)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Đặt lại mật khẩu'}
        </Button>
      </form>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button href="/login" size="small" sx={{ textTransform: 'none' }}>
          Quay lại đăng nhập
        </Button>
      </Box>
    </AuthLayout>
  );
} 