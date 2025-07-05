import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthLayout from './AuthLayout';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/userService';

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
      const res = await authService.login(studentId, password);
      localStorage.setItem('token', res.access_token);
      if (onLogin) onLogin(res.name);
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
      
      {/* Development credentials info
      <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" mb={1}>
          <strong>Thông tin đăng nhập nhóm:</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Mã SV: 2124801030179 - Nguyễn Duy Dũng<br/>
          Mã SV: 2124801030036 - Lương Nguyễn Khôi<br/>
          Mã SV: 2124801030180 - Nguyễn Tiến Dũng<br/>
          Mã SV: 2124801030076 - Trương Bồ Quốc Thắng<br/>
          Mã SV: 2124801030233 - Trần Lê Thảo<br/>
          Mã SV: 2124801030017 - Nguyễn Minh Khôi<br/>
          <em>Mật khẩu là chính mã số sinh viên</em>
        </Typography>
      </Box> */}
    </AuthLayout>
  );
} 