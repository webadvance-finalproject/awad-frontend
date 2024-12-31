import { 
  Box, 
  Typography, 
  Container,
  Stack
} from '@mui/material';
import RecommendationCard from '../RecommendationCard';
const Recommendations = ({recommendations, title}) => {
    return (
      <Box sx={{ bgcolor: 'background.default', py: 3 }}>
        <Container>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          {title}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              overflowX: 'auto',
              pb: 2,
              '::-webkit-scrollbar': {
                height: 8,
              },
              '::-webkit-scrollbar-track': {
                bgcolor: 'rgba(0,0,0,0.1)',
                borderRadius: 4,
              },
              '::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(255,255,255,0.3)',
                borderRadius: 4,
              },
            }}
          >
            {recommendations?.map((item, index) => (
              <RecommendationCard
                key={index}
                title={item.original_title}
                rating={Math.round(item.vote_average * 10)}
                imageUrl={item.poster_path ? `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${item.poster_path}` : 'https://via.placeholder.com/200x300'}
                id = {item.tmdb_id}
              />
            ))}
          </Stack>
        </Container>
      </Box>
    );
  };
  
  export default Recommendations;