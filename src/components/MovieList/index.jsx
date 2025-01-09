import PropTypes from 'prop-types';
import MovieItem from '../MovieItem';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

const MovieList = ({ movies, totalPages, page, onPageChange }) => {
  return (
    <Stack
      spacing={2}
    >
      <Grid container spacing={2}>
        {movies?.map((movie) => (
          <Grid key={movie.id} size={2}>
            <MovieItem item={movie} />
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" justifyContent="flex-end">
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
        />
      </Stack>
    </Stack>
  );
};

MovieList.propTypes = {
  movies: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default MovieList;
