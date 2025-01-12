import { useEffect, useState } from 'react';
import {
  Toolbar,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login'
import styles from './Header.module.css';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';

const Header = ({ handleLogout }) => {
  const [activeCategory, setActiveCategory] = useState('Popular');
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <Toolbar sx={{
      all: 'unset',
      margin: '0',
      padding: '0 !important',
      width: '100%',
      height: '20%'
    }} >
      <div className={styles.toolBar}>
        {/* Logo */}
        <div className={styles.category} >
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="Page Icon"
            className={styles.logo}
            onClick={handleLogoClick}
          />
        </div>

        {/* Logout Button */}
        {
          user ?
            <Stack
              direction="row"
              spacing={2}
              sx={
                { marginRight: '1em' }
              }
            >
              <Avatar
                onClick={() => { navigate('/profile') }}
                src={`${user.photoURL}`}
                sx={{ cursor: 'pointer' }}
              />
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </Button>
            </Stack>
          :
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            className={styles.logoutButton}
            sx={
              { marginRight: '1em' }
            }
          >
            Login
          </Button>
        }
      </div>
    </Toolbar>
  );
};

export default Header;