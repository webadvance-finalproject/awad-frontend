import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  position: 'relative',
  transition: 'transform 0.2s',
  backgroundColor: 'transparent',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
  },
}));

const GradientOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  padding: '20px 10px 10px 10px',
});
import { useNavigate } from 'react-router-dom';
const RecommendationCard = ({ title, rating, imageUrl, id }) => {
  const navigate = useNavigate();
    return (
    <StyledCard elevation={0} >
      <Box sx={{ position: 'relative', paddingTop: '150%' /* 2:3 aspect ratio */ }} onClick={() => navigate(`/movie/${id}`)}>
        <CardMedia
          component="img"
          image={imageUrl || "https://via.placeholder.com/200x300"}
          alt={title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
        <GradientOverlay>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500, flexGrow: 1, mr: 1 }}>
              {title}
            </Typography>
            {rating && (
              <Typography 
                variant="subtitle1" 
                sx={{ color: '#4CAF50', fontWeight: 500 }}
              >
                {rating}%
              </Typography>
            )}
          </Box>
        </GradientOverlay>
      </Box>
    </StyledCard>
  )
}

export default RecommendationCard;