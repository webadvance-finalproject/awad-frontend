import React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useNavigate } from 'react-router-dom';

const MovieItem = ({ item }) => {
  const navigate = useNavigate();

  return (
    <ImageListItem
      key={`${Math.random().toString(36)}-${item.id}`}
      sx={{
        width: '10rem',
        margin: 'auto',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/movie/${item.id}`)}
    >
      <img
        src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${item.poster_path}`}
        alt={item.title}
        loading="lazy"
      />
      <ImageListItemBar
        title={item.title}
        position="below"
      />
    </ImageListItem>
  );
}

export default MovieItem;
