import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import { searchMovie } from '../service/MovieService';
import { ImageList } from '@mui/material';
import { ButtonGroup, Button } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBar from '../components/SearchBar';
import MovieItem from '../components/MovieItem';

const Search = () => {
  const user = useStore((state) => state.user);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(new URLSearchParams(window.location.search).get('keyword') || '');
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  }

  const getSearchMovie = async (keyword, page) => {
    const token = await user.getIdToken();
    return await searchMovie({ keyword, token, page });
  }

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getSearchMovie(keyword, page);
        setMovies(prevMovies => [...prevMovies, ...data.results]);
        if (data.total_pages <= page) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [keyword, page])

  const fetchMoreData = async () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={styles.container}>
      <Header handleLogout={handleLogout} />
      <div style={{padding: "0 40px"}}>
        <SearchBar initialValue={keyword} />
      </div>
      <div style={{ margin: '40px' }}>
        <InfiniteScroll
          dataLength={movies.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more movies</p>}
        >
          <ImageList cols={7} sx={{ justifyContent: 'center', margin: '0' }}>
            {movies.map((item) => (
              <MovieItem key={item.id} item={item} />
            ))}
          </ImageList>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Search