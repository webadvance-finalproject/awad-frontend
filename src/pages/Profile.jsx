import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// service
import { getRatings } from '../service/UserService';

// components
import {
    Avatar,
    Stack,
    Typography,
    Box
} from '@mui/material';
import styles from './Profile.module.css';
import Header from "../components/Header";
import VoteAverageCircle from '../components/VoteAverageCircle';

const Profile = () => {
    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    const [ averageRating, setAverageRating ] = useState(0);
    
    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }

    useEffect(() => {
        const fetchRatings = async () => {
            const res = await getRatings({ token: user.accessToken });
            console.log(res);
            if (res) {
                const ratings = res.data.ratings;
                const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                setAverageRating(totalRating / ratings.length / 10);
            }
        };
        fetchRatings();
    }, [user])

    return (
        <div className={styles.container}>
            {user ? (
                <div className={styles.container}> 
                    <Header handleLogout={handleLogout}/>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            backgroundImage: 'linear-gradient(to bottom, #032541, #5f1339)',
                            padding: '30px',
                            borderRadius: '0px 0px 10px 10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            color: '#bcbcc2',
                        }}
                    >
                        <Stack>
                            <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 110, height: 110, border: '2px solid white' }} />
                        </Stack>
                        <Stack
                            spacing={2}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.displayName}</Typography>
                                <Typography> Thành viên kể từ {new Date(user.metadata.creationTime).toLocaleString('default', { month: 'long', year: 'numeric' })}</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={2}
                            >
                                <Box className="bg-gray-800 p-4">
                                    <VoteAverageCircle voteAverage={averageRating} />
                                </Box>
                                <Box className="bg-gray-800 p-4">
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%'
                                        }}
                                    >
                                        Đánh giá trung bình
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Profile