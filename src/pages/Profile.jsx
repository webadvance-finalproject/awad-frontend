import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import PropTypes from 'prop-types';

// service
import { getWatchlists, getFavorites, getRatings } from '../service/UserService';

// components
import {
    Avatar,
    Stack,
    Typography,
    Box,
    Tabs,
    Tab,
    ImageList,
} from '@mui/material';
import styles from './Profile.module.css';
import Header from "../components/Header";
import VoteAverageCircle from '../components/VoteAverageCircle';
import MovieItem from '../components/MovieItem';

// tabs
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: '1.875rem' }}>{children}</Box>}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Profile = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }

    // user
    const user = useStore((state) => state.user);
    const [tab, setTab] = useState(0);
    const [watchlists, setWatchlists] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [error, setError] = useState(null);

    
    // tabs watchlists, favorites, ratings
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    // fetch watchlists, favorites, ratings 
    const fetchWatchlists = async () => {
        const res = await getWatchlists({ token: user.accessToken });
        if (res.statusCode !== 200) {
            setError(res.message);
            return;
        }
        if (res) {
            setWatchlists(res.data.watchlists);
        }
    };
    const fetchFavorites = async () => {
        const res = await getFavorites({ token: user.accessToken });
        if (res.statusCode !== 200) {
            setError(res.message);
            return;
        }
        if (res) {
            setFavorites(res.data.favorites);
        }
    };
    const fetchRatings = async () => {
        const res = await getRatings({ token: user.accessToken });
        if (res.statusCode !== 200) {
            setError(res.message);
            return;
        }
        if (res) {
            setRatings(res.data.ratings);
        }
        return res.data.ratings;
    };

    // fetch watchlists, favorites, ratings when tab changes
    useEffect(() => {
        setError(null);
        if (tab === 0) {
            fetchWatchlists();
        } else if (tab === 1) {
            fetchFavorites();
        } else if (tab === 2) {
            fetchRatings();
        }
    }, [tab]);

    // fetch ratings on first render to calculate average rating
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            fetchRatings();
        }
    }, [firstRender]);
    // calculate average rating
    useEffect(() => {
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
            setAverageRating(totalRating / ratings.length / 10);
        }
    }, [ratings]);

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
                            padding: '3.125rem 6.25rem',
                            borderRadius: '0 0 0.625rem 0.625rem',
                            boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
                            color: '#bcbcc2',
                        }}
                    >
                        <Stack>
                            <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: '9.375rem', height: '9.375rem', border: '0.125rem solid white' }} />
                        </Stack>
                        <Stack
                            spacing={2}
                            sx={{
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                            }}
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
                                <Typography> Member since {new Date(user.metadata.creationTime).toLocaleString('default', { month: 'long', year: 'numeric' })}</Typography>
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
                                        Average rating
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Box sx={{ width: '100%' }}>

                        <Box sx={{ borderBottom: '0.0625rem', borderColor: 'divider', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                                <Tab label="Watchlist" {...a11yProps(0)} />
                                <Tab label="Favorites" {...a11yProps(1)} />
                                <Tab label="Ratings" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        
                        <Box
                            sx={{
                                paddingInline: '6.25rem',
                            }}
                        >
                            <CustomTabPanel value={tab} index={0}>
                                <ImageList cols={7} sx={{ justifyContent: 'center', margin: '0' }}>
                                    {watchlists.map((item) => (
                                        <MovieItem key={item.movie._id} item={item.movie} />
                                    ))}
                                </ImageList>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1}>
                                <ImageList cols={7} sx={{ justifyContent: 'center', margin: '0' }}>
                                    {favorites.map((item) => (
                                        <MovieItem key={item.movie._id} item={item.movie} />
                                    ))}
                                </ImageList>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={2}>
                                <ImageList cols={7} sx={{ justifyContent: 'center', margin: '0' }}>
                                    {ratings.map((item) => (
                                        <MovieItem key={item.movie._id} item={item.movie} />
                                    ))}
                                </ImageList>
                            </CustomTabPanel>
                        </Box>

                        {error &&
                            <Typography
                                color="error"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}
                            >
                                {error}
                            </Typography>
                        }
                    </Box>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Profile