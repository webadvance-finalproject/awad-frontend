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
  const [trendingMovies, setTrendingMovies] = useState({
    mode: 'day', // day or week
    movies: [],
    page: 1,
    total_pages: 0,
  });

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  }

  const handleTrendingPageChange = async (event, value) => {
    const res = await fetchTrendingMovies(trendingMovies.mode, value);
    setTrendingMovies(prevState => ({
      ...prevState,
      movies: res.results,
      page: value,
      total_pages: res.total_pages,
    }));
  };

  const handleModeChange = async () => {
    const newMode = trendingMovies.mode === 'day' ? 'week' : 'day';
    const newPage = 1;
    const res = await fetchTrendingMovies(newMode, newPage);
    setTrendingMovies(prevState => ({
      ...prevState,
      movies: res.results,
      mode: newMode,
      page: newPage,
      total_pages: res.total_pages,
    }));
  };

  const fetchTrendingMovies = async (mode, page) => {
    try {
      const token = await user.getIdToken();
      const res = mode === 'day'
        ? await getTrendingMoviesByDay({ token, page })
        : await getTrendingMoviesByWeek({ token, page });
      // TODO: xử lý mã lỗi trả về từ server
      return res;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    const fetchInitialTrendingMovies = async () => {
      const res = await fetchTrendingMovies(trendingMovies.mode, trendingMovies.page);
      if (res) {
        setTrendingMovies(prevState => ({
          ...prevState,
          movies: res.results,
          total_pages: res.total_pages,
        }));
      }
    };

    fetchInitialTrendingMovies();
  }, []);

  useEffect(() => {
    console.log('trendingMovies:', trendingMovies);
  }, [trendingMovies]);

  return (
    <div className={styles.container}>
      <Header handleLogout={handleLogout} />
      <Banner />
      <Stack spacing={2} sx={{ paddingInline: '20vh', marginTop: '20px' }}>
        <Stack>
          <Stack spacing={3} direction="row" sx={{ alignItems: 'center' }}>
            <Typography variant="h5">Trending</Typography>
            <DayWeekSwitch onChange={handleModeChange} />
          </Stack>
          {trendingMovies.movies ? (
            <MovieList
              movies={trendingMovies.movies}
              totalPages={trendingMovies.total_pages}
              page={trendingMovies.page}
              onPageChange={handleTrendingPageChange}
            />
          ) : (
            <p>No Movie</p>
          )}
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