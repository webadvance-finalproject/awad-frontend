import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Toolbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom'
import styles from './Profile.module.css';
import Header from "../components/Header";
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getMovieCast } from '../service/MovieService';
import { organizeDepartments } from '../utils/Helper';
const Cast = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [participant, setParticipant] = useState({});
    const [movie, setMovie] = useState({})
    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    }
    useEffect(()=>{
        const fetchCast = async()=>{
            if(id)
            {
                try {
                    const data = await getMovieCast({ movieID: id });
                    if (data && data.id) {
                        setMovie({
                            original_title: data.original_title,
                            poster_path: data.poster_path,
                        })
                        const org = organizeDepartments(data.credits);
                        setParticipant(org);
                    }
                } catch (error) {
                    setParticipant({})
                    console.error('Error fetching reviews:', error);
                }
            }
        }
        fetchCast();
    },[id])

  return (
    <div className={styles.container}>
         <Header handleLogout={handleLogout} />
<Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundImage: `
                            linear-gradient(to right, rgba(31.5, 10.5, 10.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 10.5, 10.5, 0.84) 50%, rgba(31.5, 10.5, 10.5, 0.84) 100%),
                              url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${movie?.backdrop_path}')
                            `, boxShadow: 'none' }}>
        <Container>
          <Toolbar sx={{ padding: '16px 0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="back"
                sx={{ mr: 2 }}
                onClick={()=>navigate(`/movie/${id}`)}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={movie.poster_path ?`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`: "/api/placeholder/48/48"}
                  alt="Movie Poster"
                  sx={{ width: 48, height: 48, marginRight: 2 }}
                />
                <Typography variant="h6" component="div">
                  {movie && movie.original_title ? movie.original_title: ""}
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Content */}
      <Container sx={{ mt: 4 }}>
      <Grid container spacing={6}>
        {Object.keys(participant).map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {key} <Typography component="span" color="text.secondary">{participant[key].length}</Typography>
            </Typography>
            <Box>
              {participant[key].map((member) => (
                <Card key={member.id} sx={{ mb: 2, boxShadow: 'none', backgroundColor: 'transparent' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', padding: '8px 0' }} onClick={() => navigate(`/actor/${member.id}`)}>
                    <Avatar
                      src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : '/default-avatar.png'}
                      alt={member.name}
                      sx={{ width: 60, height: 60, marginRight: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" component="div">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Box>
    </div>
    
  );
};

export default Cast;