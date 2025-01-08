import { Box, Typography } from '@mui/material';
import SearchBar from '../SearchWithFilter/SearchBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const [localState, setLocalState] = useState({
    keyword: searchParams.get('keyword') || '',
    actors: searchParams.get('actors') ? searchParams.get('actors').split(',') : [],
    genres: searchParams.get('genres') || '',
    minRating: searchParams.get('minRating') || '',
    maxRating: searchParams.get('maxRating') || '',
    minYear: searchParams.get('minYear') || '',
  });

  const onInputChange = (value) => {
    setLocalState(prev => ({
      ...prev,
      ...value,
    }));
  }

  const handleSearchSubmit = () => {
    const queryParams = new URLSearchParams();
    if (localState.keyword) queryParams.append('keyword', localState.keyword);
    if (localState.actors.length > 0) queryParams.append('actors', localState.actors.join(','));
    if (localState.genres) queryParams.append('genres', localState.genres);
    if (localState.minRating) queryParams.append('minRating', localState.minRating);
    if (localState.maxRating) queryParams.append('maxRating', localState.maxRating);
    if (localState.minYear) queryParams.append('minYear', localState.minYear);
    navigate(`/search?${queryParams.toString()}`);
  }


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
      height="300px"
      sx={{
        background: 'linear-gradient(90deg, #02a6e7, #016b9e)',
        color: 'white',
        px: '20rem',
      }}
    >
      <Typography variant="h2" component="div" margin={0} gutterBottom>
        Welcome.
      </Typography>
      <Typography variant="h6" component="div">
        Millions of movies, TV shows and people to discover. Explore now.
      </Typography>
      <SearchBar
        defaultValue={localState.keyword}
        onSearchChange={onInputChange}
        handleSubmit={handleSearchSubmit}
      />
    </Box>
  );
};

export default Banner;

