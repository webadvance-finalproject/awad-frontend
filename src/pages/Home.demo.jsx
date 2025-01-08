import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import Banner from '../components/Banner';
import DayWeekSwitch from '../components/DayWeekSwitch';
import styles from './Profile.module.css';
import { getTrendingMoviesByDay, getTrendingMoviesByWeek } from '../service/MovieService';
import { Stack, Typography } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [mode, setMode] = useState('day'); // day or week

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  }

  const fetchTrendingMovies = async (filter, page) => {
    const token = await user.getIdToken();
    if (filter === 'today') {
      return await getTrendingMoviesByDay({ token, page });
    } else if (filter === 'this week') {
      return await getTrendingMoviesByWeek({ token, page });
    }
  }
  
  const handleModeChange = (newMode) => {
    setMode(newMode);
    console.log('Old mode:', mode); 
    console.log(`Switched to ${newMode}`); 
  };


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
            <DayWeekSwitch onChange={handleModeChange} />
          </Stack>
          <p>Movie list with pagination</p>
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