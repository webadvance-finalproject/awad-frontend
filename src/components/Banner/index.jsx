import { Box, Typography } from '@mui/material';

const Banner = () => {

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
        px: '20vh',
      }}
    >
      <Typography variant="h2" component="div" margin={0} gutterBottom>
        Welcome.
      </Typography>
      <Typography variant="h6" component="div">
        Millions of movies, TV shows and people to discover. Explore now.
      </Typography>
      
    </Box>
  );
};

export default Banner;

