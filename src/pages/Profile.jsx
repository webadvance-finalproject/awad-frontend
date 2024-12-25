import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button } from '@mui/material';
import { useStore } from '../store'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from "../components/Header";
import styles from './Profile.module.css';
import SearchBar from '../components/SearchBar';
const Profile = () => {
    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }

    return (
        <div className={styles.container}>
            {user ? (
                <div className={styles.container}> 
                    <Header handleLogout={handleLogout}/>
                    <SearchBar/>
                    <Typography variant='h1' sx={{ textAlign: "center" }} >Profile</Typography>
                    {user && <Typography variant='h5' sx={{ textAlign: "center" }}>Welcome {user.email}</Typography>}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Profile