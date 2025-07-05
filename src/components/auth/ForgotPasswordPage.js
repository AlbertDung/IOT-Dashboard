import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import AuthLayout from './AuthLayout';
import { authService } from '../../services/userService';

export default function ForgotPasswordPage() {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.forgotPassword(studentId, email);
      setSuccess('Thông tin tài khoản đã được xác nhận. Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.');
    } catch (err) {
      setError('Không tìm thấy tài khoản với thông tin đã nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" mb={2} align="center" fontWeight={700}>
        Quên mật khẩu
      </Typography>
      <form onSubmit={handleForgot} autoComplete="on">
        <TextField
          label="Mã số sinh viên"
          fullWidth
          margin="normal"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Gửi email đặt lại mật khẩu'}
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