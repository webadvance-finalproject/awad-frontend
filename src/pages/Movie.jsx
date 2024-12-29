import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, Card, CardMedia, CardContent, Grid, Chip, Avatar, IconButton, Tooltip, Button  } from '@mui/material'; // Import 
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InfoIcon from '@mui/icons-material/Info';
import { useStore } from '../store'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from "../components/Header";
import styles from './Profile.module.css';
import { getMovieData } from '../service/MovieService'
import { API_STATUS } from "../config/common.jsx";
import VoteAverageCircle from '../components/VoteAverageCircle/index.jsx';
import RatingDialog from '../components/RatingDialog/index.jsx';
import {addFavoriteMovie, removeFavoriteMovie, getFavoriteMovie, addWatchlistMovie, removeWatchlistMovie, getWatchlistMovie } from '../service/UserService';
const Movie = () => {
    const { id } = useParams(); // Lấy ID từ URL param
    const user = useStore((state) => state.user);
    const navigate = useNavigate();
    const [movie, setMovie] = useState({})
    const [cast, setCast] = useState([]); // State for cast
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatchlist, setIsWatchlist] = useState(false);
    const [openRatingDialog, setOpenRatingDialog] = useState(false);
    const [rating, setRating] = useState(0);
    const handleOpen = () => setOpenRatingDialog(true);
    const handleClose = () => setOpenRatingDialog(false);
    useEffect(() => {
        const fetchMovieData = async () => {
            if (id) {
                try {
                    const token = await user.getIdToken();
                    const data = await getMovieData({ movieID: id, token });
                    if (data && data.status !== API_STATUS.INTERNAL_ERROR) {
                        setMovie(data);
                        setCast(data?.credits?.cast);
                        setRating(data?.vote_average);
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
    useEffect(() => {
        const checkFavorite = async () => {
            if (user) { 
                const token = await user.getIdToken();
                const response = await getFavoriteMovie({ token, movieID: id });
                if (response && response.statusCode === 200 && response.data?.isFavorite) {
                    setIsFavorite(true);
                }
                else {
                    setIsFavorite(false);
                }
            }
        }
        checkFavorite();
    }, [id, user]);
    
    useEffect(() => {
        const checkWatchlist = async () => {
            if (user) { 
                const token = await user.getIdToken();
                const response = await getWatchlistMovie({ token, movieID: id });
                if (response && response.statusCode === 200 && response.data?.isWatchlist) {
                    setIsWatchlist(true);
                }
                else {
                    setIsWatchlist(false);
                }
            }
        }
        checkWatchlist();
    }, [id, user]);

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }
    const handleAddFavorite = async () => {
        if (user && movie) {
            const token = await user.getIdToken();
            const res = await addFavoriteMovie({ token, movieID: movie.id });
            if(res && res.statusCode === 201){
                setIsFavorite(true);
            }
        }
    }
    const handleRemoveFavorite = async () => {
        if (user && movie) {
            const token = await user.getIdToken();
            const res = await removeFavoriteMovie({ token, movieID: movie.id });
            if(res && res.statusCode === 200){
                setIsFavorite(false);
            } 
        }
    }

    const handleAddWatchlist = async () => {
        if (user && movie) {
            const token = await user.getIdToken();
            const res = await addWatchlistMovie({ token, movieID: movie.id });
            if(res && res.statusCode === 201){
                setIsWatchlist(true);
            }
        }
    }
    const handleRemoveWatchlist = async () => {
        if (user && movie) {
            const token = await user.getIdToken();
            const res = await removeWatchlistMovie({ token, movieID: movie.id });
            if(res && res.statusCode === 200){
                setIsWatchlist(false);
            } 
        }
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
                                            <Box className="p-6 bg-gray-900 text-white">
                                                {/* Title Section */}
                                                <Box className="mb-4">
                                                    <Typography variant="h4" component="h1" className="font-bold mb-2"  sx={{ color: 'white' }}>
                                                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                                                    </Typography>
                                                    <Box className="flex items-center gap-2 mb-2">
                                                    
                                                    <Typography variant="body2">
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
                                                    </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Rating and Actions Section */}
                                                <Box className="flex items-center gap-6 mb-6">
                                                    {/* Score Circle */}
                                                    <Box className="relative w-16 h-16 flex items-center justify-center rounded-full bg-green-500">
                                                    <Typography variant="h5" className="font-bold"  sx={{ color: 'white' }}>
                                                    <Box className="bg-gray-800 p-4">
                                                        <VoteAverageCircle voteAverage={rating} />
                                                    </Box>
                                                    </Typography>
                                                    <Button
                                                        endIcon={<InfoIcon />}
                                                        sx={{
                                                            backgroundColor: 'common.black',
                                                            color: 'common.white',
                                                            borderRadius: '50px',
                                                            padding: '8px 16px',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                              backgroundColor: '#333',
                                                            }
                                                          }}
                                                          disabled={!user}
                                                          onClick={user && handleOpen}
                                                    >
                                                        {"What's your Vibe?"}
                                                    </Button>
                                                    <RatingDialog 
                                                        open={openRatingDialog}
                                                        onClose={handleClose}
                                                        title={`What did you think of ${movie.title}?`}
                                                        movieID={movie.id}
                                                        setRating = {setRating}
                                                    />
                                                    </Box>

                                                    {/* Action Buttons */}
                                                    <Box className="flex gap-2" sx={{ marginTop: '2rem' }}>


                                                    <Tooltip title={user ? 'Add to list' : 'Login to create and edit custom lists'}>
                                                        <span>
                                                        <IconButton className="bg-gray-800 text-white hover:bg-gray-700" disabled={!user}
                                                       >
                                                            <FormatListBulletedIcon  sx={{ color:'white'}}/>
                                                        </IconButton>
                                                        </span>
                                                        </Tooltip>
                                                    <Tooltip title={user ? 'Mark as favorite' : 'Login to add this movie to your favorite list'}>
                                                        <span>
                                                        <IconButton className="bg-gray-800 text-white hover:bg-gray-700"  disabled={!user}
                                                         onClick={ user && !isFavorite ? async() => handleAddFavorite()
                                                         : async() => handleRemoveFavorite() }>
                                                        <FavoriteIcon  sx={{ color: user && isFavorite ? 'red' : 'white'}}/>
                                                    </IconButton> 
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title={ user ? 'Add to your watchlist' : 'Login to add this movie to your watchlist'}>
                                                        <span>
                                                        <IconButton className="bg-gray-800 text-white hover:bg-gray-700"  disabled={!user}
                                                         onClick={ user && !isWatchlist ? async() => handleAddWatchlist()
                                                            : async() => handleRemoveWatchlist() }>
                                                        <BookmarkIcon sx={{ color: user && isWatchlist ? 'red' : 'white' }}/>
                                                    </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                   
                                                  
                                                   
                                                    {/* <Button
                                                        variant="contained"
                                                        startIcon={<PlayArrowIcon />}
                                                        className="bg-gray-800 text-white hover:bg-gray-700"
                                                    >
                                                    </Button>
                                                     */}
                                                    </Box>
                                                </Box>

                                                {/* Overview Section */}
                                                <Box>
                                                    <Typography variant="h6" className="mb-2"  sx={{ color: 'white' }}>
                                                    Overview
                                                    </Typography>
                                                    <Typography variant="body1"  sx={{ color: 'white' }}>
                                                    {movie.overview}
                                                    </Typography>
                                                </Box>
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