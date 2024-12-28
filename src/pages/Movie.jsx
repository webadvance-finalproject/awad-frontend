import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, Card, CardMedia, CardContent, Grid, Chip, Avatar } from '@mui/material'; // Import Avatar
import { useStore } from '../store'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from "../components/Header";
import styles from './Profile.module.css';
import { getMovieData } from '../service/MovieService'
import { API_STATUS } from "../config/common.jsx";

const Movie = () => {
    const { id } = useParams(); // Lấy ID từ URL param
    const user = useStore((state) => state.user);
    const navigate = useNavigate();
    const [movie, setMovie] = useState({})
    const [cast, setCast] = useState([]); // State for cast

    useEffect(() => {
        const fetchMovieData = async () => {
            if (id) {
                try {
                    const token = await user.getIdToken();
                    const data = await getMovieData({ movieID: id, token });
                    if (data && data.status !== API_STATUS.INTERNAL_ERROR) {
                        console.log(data);
                        setMovie(data);
                        setCast(data?.credits?.cast);
                    }
                } catch (error) {
                    console.error('Error fetching movie data:', error);
                }
            }
        };

        fetchMovieData();

        return () => {
            // Cleanup function (optional)
        };
    }, [id]);

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }
    
    return (
        <div className={styles.container}>
            {user && movie ? (
                <div className={styles.container}>
                    <Header handleLogout={handleLogout} />
                    {user && movie && (
                        <Box sx={{
                            padding: 4,
                            backgroundColor: '#121212',
                            color: 'white',
                            backgroundImage: `
                            linear-gradient(to right, rgba(31.5, 10.5, 10.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 10.5, 10.5, 0.84) 50%, rgba(31.5, 10.5, 10.5, 0.84) 100%),
                              url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}')
                            `,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            width: '1928',
                            height: '800',
                            margin: 0,
                        }}>
                            <Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ width: 300, height: 450 }}>
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                image={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
                                                alt={movie.title}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Card sx={{ backgroundColor: "transparent", border: "none", boxShadow: 'none' }}>
                                            <CardContent>
                                                <Typography variant="h3" sx={{ color: 'white' }}>
                                                    {movie.title} ({new Date(movie.release_date).getFullYear()})
                                                </Typography>
                                                <Typography variant="h6" color="textSecondary" sx={{ color: 'white' }} paragraph>
                                                    Release Date: {movie.release_date}
                                                </Typography>
                                                <Typography variant="h6" color="textSecondary" sx={{ color: 'white' }}>
                                                    Rating: {movie.vote_average} / 10
                                                </Typography>
                                                <Box sx={{ marginTop: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>Genres:</Typography>
                                                    <Box>
                                                        {movie?.genres?.map((genre) => (
                                                            <Chip
                                                                key={genre.id}
                                                                label={genre.name}
                                                                color="primary"
                                                                sx={{ marginRight: 1, marginBottom: 1 }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                                <Box sx={{ marginTop: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>Overview</Typography>
                                                    <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                                                        {movie.overview}
                                                    </Typography>
                                                </Box>
                                                {/* Cast */}
                                                <Box sx={{ marginTop: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>Cast:</Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        {cast.map((actor, index) => (
                                                            <Box key={index} sx={{ marginRight: 2, marginBottom: 2, display: 'flex', alignItems: 'center', cursor:"pointer" }} onClick={() => navigate(`/actor/${actor.id}`)}>
                                                                <Avatar src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} sx={{ width: 30, height: 30, marginRight: 1 }} />
                                                                <Typography variant="body2" sx={{ color: 'white' }}>{actor.name}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    )}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Movie