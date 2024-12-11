import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import styles from './Profile.module.css';
const Home = () => {
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
          <Header handleLogout={handleLogout} />
          <Typography variant='h1' sx={{ textAlign: "center" }} >Homepage</Typography>
          {user &&
            <p>popular movie list with toggle</p>
          }
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Home