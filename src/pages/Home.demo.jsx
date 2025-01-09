import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import Banner from '../components/Banner';
import DayWeekSwitch from '../components/DayWeekSwitch';
import MovieList from '../components/MovieList';
import styles from './Profile.module.css';
import { getTrendingMoviesByDay, getTrendingMoviesByWeek } from '../service/MovieService';
import { Stack, Typography } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [mode, setMode] = useState('day'); // day or week
  const [trendingMovies, setTrendingMovies] = useState({
    movies: [],
    page: 1,
    total_pages: 0,
  });

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  }
  
  const handleModeChange = () => {
    const newMode = mode === 'day' ? 'week' : 'day';
    setTrendingMovies({
      movies: [],
      page: 1,
      total_pages: 0,
    });
    setMode(newMode);
  };
  
  const fetchTrendingMovies = async (mode, page) => { 
    try {
      const token = await user.getIdToken();
      if (mode === 'day') {
        const res = await getTrendingMoviesByDay({ token, page });
        console.log(res);
        setTrendingMovies({
          movies: res.results,
          total_pages: res.total_pages,
        });
        return res;
      } else if (mode === 'week') {
        const res = await getTrendingMoviesByWeek({ token, page });
        console.log(res);
        setTrendingMovies({
          movies: res.results,
          total_pages: res.total_pages,
        });
      }
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };
  
  useEffect(() => {
    fetchTrendingMovies(mode, trendingMovies.page); 
  }, [mode]);

  return (
    <div className={styles.container}>
      <Header handleLogout={handleLogout} />
      <Banner />
      <Stack spacing={2} sx={{ paddingInline: '20vh', marginTop: '20px' }}>
        <Stack>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">Trending</Typography>
            <DayWeekSwitch onChange={() => { handleModeChange }} />
          </Stack>
          <MovieList 
            movies={trendingMovies.movies} 
            totalPages={trendingMovies.total_pages} 
            page={trendingMovies.page} 
            onPageChange={(event, value) => {setTrendingMovies({ ...trendingMovies, page: value })}} 
          />
        </Stack>
        <Stack>
          <Typography variant="h5">Latest Trailers</Typography>
        </Stack>
        <Stack>
          <Typography variant="h5">What&apos;s Popular</Typography>
        </Stack>
      </Stack>
    </div>
  );
};

export default Home;