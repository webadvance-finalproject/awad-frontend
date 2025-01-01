import React, { useState } from 'react'
import { auth } from '../../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { TextField, Button, Card, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  });

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await validationSchema.validate({ email });
      await sendPasswordResetEmail(auth, email);
      setError('Email reset mật khẩu đã được gửi thành công. Vui lòng kiểm tra email của bạn');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <Card variant='outlined' sx={{ width: '500px', marginTop: '30px', padding: '30px' }}>
      <Typography variant='h3' fontWeight="bold">Forgot Password</Typography>
      <Box sx={{marginTop: '40px'}}>
        <Typography variant='subtitle1' sx={{ marginBottom: '10px', marginLeft: '10px' }}>Vui lòng nhập email để cập nhập lại mật khẩu</Typography>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: '25px' }}
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Xác nhận'}
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth 
          sx={{ mt: '15px' }}
          onClick={handleCancel}
        >
          Hủy
        </Button>
      </Box>
    </Card>
  )
}

export default ForgotPassword