import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthLayout from './AuthLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/login', { studentId, password });
      localStorage.setItem('token', res.data.access_token);
      if (onLogin) onLogin(res.data.name);
      navigate('/');
    } catch (err) {
      setError('Mã số sinh viên hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" mb={2} align="center" fontWeight={700}>
        Đăng nhập hệ thống
      </Typography>
      <form onSubmit={handleLogin} autoComplete="on">
        <TextField
          label="Mã số sinh viên"
          fullWidth
          margin="normal"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          autoFocus
          autoComplete="username"
        />
        <TextField
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
        </Button>
      </form>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button href="/forgot-password" size="small" sx={{ textTransform: 'none' }}>
          Quên mật khẩu?
        </Button>
      </Box>
    </AuthLayout>
  );
} 