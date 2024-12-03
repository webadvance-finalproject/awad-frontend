import React, { useState } from 'react'
import Container from '@mui/material/Container'
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google';
import * as yup from 'yup'
import { auth } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import {useNavigate, Link} from 'react-router-dom'
import { useStore } from '../../store'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const user = useStore(state => state.user)

    const validationSchema = yup.object().shape({
        email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await validationSchema.validate({ email, password });
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/')
        } catch (error) {
            // Xử lý lỗi
            console.log(error)
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            navigate('/');
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    }

    return (
        <Card variant='outlined' sx={{ width: '500px', marginTop: '30px', padding: '30px' }} >
            <Typography variant='h3' fontWeight="bold">Log In</Typography>
            <Box >
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                        fullWidth
                        margin="normal"
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: '15px' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </form>
                <Typography variant='subtitle1' sx={{margin: '5px'}}>Chưa có tài khoản?
                    <Link to='/register'>Đăng ký</Link>
                </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: '15px' }}
                onClick={handleGoogleLogin}
                startIcon={<GoogleIcon />}
            >
                Đăng nhập bằng Google
            </Button>
            </Box>
        </Card>
    )
}

export default Login