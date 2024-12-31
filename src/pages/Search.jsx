import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import { searchMovie } from '../service/MovieService';
import { Box, CircularProgress, ImageList, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieItem from '../components/MovieItem';
import SearchWithFilter from '../components/SearchWithFilter';

const Search = () => {
  const user = useStore((state) => state.user);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams()
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  }

  const getSearchMovie = async (page) => {
    const token = await user.getIdToken();
    const paramsData = {
      keyword: searchParams.get('keyword'),
      actors: searchParams.get('actors') ? searchParams.get('actors').split(',') : [],
      genres: searchParams.get('genres'),
      minRating: searchParams.get('minRating'),
      maxRating: searchParams.get('maxRating'),
      minYear: searchParams.get('minYear'),
    }
    return await searchMovie({ data: paramsData, token, page });
  }

  const fetchMoreData = async () => {
    try {
      const data = await getSearchMovie(page + 1);
      setMovies(prev => ([...prev, ...data.results]));
      if (data.total_pages <= page) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    setPage(1);
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const data = await getSearchMovie(1);
        setMovies(data.results);
        if (data.total_pages <= page) {
          setHasMore(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchParams])

  return (
    <div className={styles.container}>
      <Header handleLogout={handleLogout} />
      <div style={{ padding: "0 40px" }}>
        <SearchWithFilter />
      </div>
      {!isLoading ?
        <div style={{ margin: '40px' }}>
          <InfiniteScroll
            dataLength={movies && movies.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Typography>No more movies</Typography>
              </Box>
            }
          >
            <ImageList cols={7} sx={{ justifyContent: 'center', margin: '0' }}>
              {movies && movies.map((item) => (
                <MovieItem key={item.id} item={item} />
              ))}
            </ImageList>
          </InfiniteScroll>
        </div>
        :
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircularProgress />
        </Box>
      }
    </div>
  )
}

export default Search