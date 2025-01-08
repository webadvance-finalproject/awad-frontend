import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import Banner from '../components/Banner';
import styles from './Profile.module.css';
import { getTrendingMoviesByDay, getTrendingMoviesByWeek } from '../service/MovieService';
import { Stack, Typography } from '@mui/material';

const Home = () => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

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
  

  return (
    <div className={styles.container}>
      <Header handleLogout={handleLogout} />
      <Banner />
      <Stack spacing={2} sx={{ paddingInline: '20rem', marginTop: '20px' }}>
        <Stack>
          <Typography variant="h5">Trending Movies</Typography>
        </Stack>
        <Stack>
          <Typography variant="h5">Latest Trailers</Typography>
        </Stack>
        <Stack>
          <Typography variant="h5">Popular Movies</Typography>
        </Stack>
      </Stack>
    </div>
  )
}

export default Home