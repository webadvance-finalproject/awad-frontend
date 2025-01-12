import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import DayWeekSwitch from '../components/DayWeekSwitch';
import MovieList from '../components/MovieList';
import TrailerList from '../components/TrailerList';
import styles from './Profile.module.css';
import { getTrendingMoviesByDay, getTrendingMoviesByWeek, getPopularMovies, getLastestTrailers } from '../service/MovieService';
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
  const [popularMovies, setPopularMovies] = useState({
    movies: [],
    page: 1,
    total_pages: 0,
  });
  const [lastestTrailers, setLastestTrailers] = useState({
    trailers: [],
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

  const handleLastestTrailerPageChange = async (event, value) => {
    const res = await fetchLastestTrailers(value);
    setLastestTrailers(prevState => ({
      ...prevState,
      trailers: res.results,
      page: value,
      total_pages: res.total_pages,
    }));
  };

  const handlePopularPageChange = async (event, value) => {
    const res = await fetchPopularMovies(value);
    setPopularMovies(prevState => ({
      ...prevState,
      movies: res.results,
      page: value,
      total_pages: res.total_pages,
    }));
  }

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

  const fetchLastestTrailers = async (page) => {
    try {
      const token = await user.getIdToken();
      const res = await getLastestTrailers({ token, page });
      //TODO: xử lý mã lỗi trả về từ server
      return res;
    } catch (error) {
      console.error("Error fetching lastest trailers:", error);
    }
  };

  const fetchPopularMovies = async (page) => {
    try {
      const token = await user.getIdToken();
      const res = await getPopularMovies({ token, page });
      // TODO: xử lý mã lỗi trả về từ server
      return res;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
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
    const fetchInitialLastestTrailers = async () => {
      const res = await fetchLastestTrailers(lastestTrailers.page);
      if (res) {
        setLastestTrailers(prevState => ({
          ...prevState,
          trailers: res.results,
          total_pages: res.total_pages,
        }));
      }
    };
    const fetchInitialPopularMovies = async () => {
      const res = await fetchPopularMovies(popularMovies.page);
      if (res) {
        setPopularMovies(prevState => ({
          ...prevState,
          movies: res.results,
          total_pages: res.total_pages,
        }));
      }
    };
    
    fetchInitialTrendingMovies();
    fetchInitialLastestTrailers();
    fetchInitialPopularMovies();
  }, []);

  useEffect(() => {
    console.log('lastestTrailers:', lastestTrailers);
  }, [lastestTrailers]);

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
          {lastestTrailers.trailers ? (
            <TrailerList
              trailers={lastestTrailers.trailers}
              totalPages={lastestTrailers.total_pages}
              page={lastestTrailers.page}
              onPageChange={handleLastestTrailerPageChange}
            />
          ) : (
            <p>No Latest Trailers</p>
          )}
        </Stack>
        <Stack>
          <Typography variant="h5">What&apos;s Popular</Typography>
          {popularMovies.movies ? (
            <MovieList
              movies={popularMovies.movies}
              totalPages={popularMovies.total_pages}
              page={popularMovies.page}
              onPageChange={handlePopularPageChange}
            />
          ) : (
            <p>No Popular Movies</p>
          )}
        </Stack>
      </Stack>
      <Footer />
    </div>
  );
};

export default Home;