import styles from './Profile.module.css';
import Header from "../components/Header";
import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import React,{ useEffect, useState} from 'react';
import { 
  Card, 
  CardContent, 
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

import { useStore } from '../store'
import { getActorDetail } from '../service/MovieService' // Import 
import { API_STATUS } from "../config/common.jsx";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ActorProfile = () => {
  const [tabValue, setTabValue] = React.useState(0);
    const { id } = useParams(); 
    const user = useStore((state) => state.user);
    const [actor, setActor] = useState({});
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
  useEffect(() => {
          const fetchActorData = async () => {
              if (id) {
                  try {
                        const token = await user.getIdToken();
                        const data = await getActorDetail({ actorID: id, token });
                        if (data && data.status !== API_STATUS.INTERNAL_ERROR) {
                            setActor(data);
                        }                                                                                                                                                                        
                  } catch (error) {
                      console.error('Error fetching movie data:', error);
                  }
              }
          };
  
          fetchActorData();
  
          return () => {
              // Cleanup function (optional)
          };
      }, [id]);
  
const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
}
  return (
    <div className={styles.container}>
      {actor && (<div className={styles.container}> 
              <Header handleLogout={handleLogout}/>
              <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
                {/* Header Section */}
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box
                        component="img"
                        src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${actor.profile_path}`}
                        alt={actor.name}
                        sx={{
                          width: 240,
                          height: 360,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                      <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                          {actor.name}
                        </Typography>
                        <Typography color="text.secondary">
                          Birthday: {new Date(actor.birthday)?.toLocaleDateString('en-GB')}
                        </Typography>
                        <Typography color="text.secondary">
                          Place of Birth: {actor.place_of_birth}
                        </Typography>
                        <Typography color="text.secondary">
                          Known For: {actor.known_for_department}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Tabs Section */}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                      <Tab label="About" />
                      <Tab label="Movies" />
                      <Tab label="Also Known As" />
                    </Tabs>
                  </Box>

                  <TabPanel value={tabValue} index={0}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Biography
                        </Typography>
                        <Typography variant="body1">
                          {actor.biography}
                        </Typography>
                      </CardContent>
                    </Card>
                  </TabPanel>

                  <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                      {actor?.movie_credits?.cast?.map((movie, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper elevation={2} sx={{ p: 2, display: 'flex', gap: 2, cursor: 'pointer' }}
                              onClick={() => navigate(`/movie/${movie.id}`)}
                              >
                            <Box
                              component="img"
                              src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
                              alt={movie.title}
                              sx={{
                                width: 100,
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: 1,
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle1" component="h3">
                                {movie.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {movie.release_date}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                as {movie.character}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>

                  <TabPanel value={tabValue} index={2}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2}>
                          {actor?.also_known_as?.map((alias, index) => (
                            <Grid item xs={12} key={index}>
                              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography>{alias}</Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </TabPanel>
                </Box>
              </Box>
              </div>)}
      </div>
    
  );
};

export default ActorProfile;