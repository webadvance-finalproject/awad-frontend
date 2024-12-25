import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './Header.module.css';

const Header = ({handleLogout}) => {
  const [activeCategory, setActiveCategory] = useState('Popular');

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <Toolbar sx={{ 
      all: 'unset', 
      margin: '0',
      padding: '0 !important',
      width: '100%',
      height: '20%'
  }} >
      <div className= {styles.toolBar}>
        {/* Logo */}
        <div className= {styles.category} >
        <img 
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
          alt="Page Icon" 
          className={styles.logo}
          onClick={handleLogoClick}
        />

        {/* Navigation Categories */}
        <div className={styles.navigationContainer}>
          <Button
            variant="text"
            className={`${styles.categoryButton} ${activeCategory === 'Popular' ? styles.categoryButtonActive : ''}`}
            onClick={() => handleCategoryClick('Popular')}
          >
            Popular
          </Button>
          <Button
            variant="text"
            className={`${styles.categoryButton} ${activeCategory === 'Top Rating' ? styles.categoryButtonActive : ''}`}
            onClick={() => handleCategoryClick('Top Rating')}
          >
            Top Rating
          </Button>
        </div>
        </div>

        {/* Logout Button */}
        <Button 
          color="inherit" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          className={styles.logoutButton}
          sx={
            {marginRight: '1em'}
          }
        >
          Logout
        </Button>
      </div>
    </Toolbar>
  );
};

export default Header;