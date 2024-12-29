import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import Header from '../components/Header'
import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import { getTrendingMoviesByDay, getTrendingMoviesByWeek } from '../service/MovieService';
import { ImageList } from '@mui/material';
import { ButtonGroup, Button } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBar from '../components/SearchBar';
import MovieItem from '../components/MovieItem';

const Home = () => {
  const user = useStore((state) => state.user);
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('today');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchTrendingMovies(filter, page);
        setMovies(prevMovies => [...prevMovies, ...data.results]);
        if (data.total_pages <= page) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [filter, page])

  const handleFilterChange = (event) => {
    setFilter(event.target.textContent.toLowerCase());
    setMovies([]); // Reset movies when filter changes
    setPage(1); // Reset page to 1 when filter changes
    setHasMore(true); // Reset hasMore to true when filter changes
  }

  const fetchMoreData = async () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={styles.container}>
      <Header handleLogout={handleLogout} />
      <div style={{padding: "0 40px"}}>
        <SearchBar/>
      </div>
      <div style={{ margin: '40px' }}>
        <ButtonGroup exclusive="true" sx={{ marginBlock: '10px' }}>
          <Button onClick={handleFilterChange} variant={filter === 'today' ? 'contained' : 'outlined'}>Today</Button>
          <Button onClick={handleFilterChange} variant={filter === 'this week' ? 'contained' : 'outlined'}>This Week</Button>
        </ButtonGroup>
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

export default Home