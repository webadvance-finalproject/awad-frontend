import React, {useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button } from '@mui/material';
import { useStore } from '../store'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const Profile = () => {
    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }

    return (
        <>
            {user ? (
                <>
                    <Typography variant='h1'>Profile</Typography>
                    {user && <Typography variant='h5'>Welcome {user.email}</Typography>}
                    <Button variant='contained' color='error' sx={{mt: '15px'}} onClick={handleLogout}>Logout</Button>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </>
    )
}

export default Profile