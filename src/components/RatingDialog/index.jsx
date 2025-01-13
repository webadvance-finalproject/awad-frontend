import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slider,
  Typography,
  IconButton,
  Button,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import { addRatingMovie, getRatingMovie } from '../../service/UserService';
import { useStore } from '../../store';
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    min-width: 500px;
    padding: 16px;
  }
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
`;

const ClearButton = styled(Button)`
  color: #00A3FF;
  text-transform: none;
  font-size: 14px;
  &:hover {
    background: transparent;
  }
`;

const getTrackBackground = (value) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  return `linear-gradient(90deg, #FFE234 0%, #00A3FF ${percentage}%, #E2E8F0 ${percentage}%)`;
};


const CustomSlider = styled(Slider)(({ value }) => ({
  height: 8,
  '& .MuiSlider-rail': {
    height: 8,
    backgroundColor: '#E2E8F0',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    height: 8,
    border: 'none',
    background: getTrackBackground(value),
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'inherit',
      borderRadius: 'inherit'
    }
  },
  '& .MuiSlider-thumb': {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    border: '2px solid #00A3FF',
    boxShadow: 'none',
    '&:hover, &:focus': {
      boxShadow: 'none',
    }
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#033B2C',
  color: '#fff',
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '50px',
  '&:hover': {
    backgroundColor: '#033B2C',
    opacity: 0.9,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
    marginRight: '8px'
  }
}));

const RatingDialog = ({ open, onClose, title = "What did you think of ...?", movieID, setRating}) => {
  const [value, setValue] = useState(0);
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    if(user){
      const fetchData = async() => {
        const token = await user.getIdToken();
        const rs = await getRatingMovie({token, movieID});
        if(rs && rs.statusCode === 200 && rs.data){
          setValue(rs.data?.rating?.rating || 0);
        }
      }
      fetchData();
    }
  },[user, movieID])
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClear = () => {
    setValue(0);
  };
  const handleDone = async() => {
    if(user){
      const token = await user.getIdToken();
      const rs = await addRatingMovie({token, movieID: movieID, rating: value});
      if(rs && rs.statusCode === 201 && rs.data){
        onClose();
        setRating(rs.data?.createRating);
      }
    }
  }
  return (
    <StyledDialog open={open} onClose={onClose}>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      
      <DialogTitle sx={{ 
        fontWeight: 'bold',
        fontSize: '24px',
        paddingRight: '40px',
        color: '#1e293b'
      }}>
        Rating
      </DialogTitle>

      <DialogContent>
      <Typography
        variant="subtitle1"
        sx={{
          color: '#1e293b',
          marginBottom: 2,
          display: 'flex',
          justifyContent: 'space-between', // Đặt khoảng cách đều giữa các phần tử
          alignItems: 'center',
          fontStyle: 'italic',
          flexWrap: 'nowrap', // Ngăn không cho xuống dòng
          gap: 1, // Khoảng cách giữa các phần tử
        }}
      >
        <span>{title}</span>
        <span>Your score: {value}</span>
      </Typography>


        <Box sx={{ padding: '0 10px', marginBottom: 1 }}>
        <Slider
          aria-label="Small steps"
          defaultValue={0}
          step={10}
          marks
          min={0}
          max={100}
          valueLabelDisplay="auto"
          value={value} // Liên kết giá trị với state
          onChange={handleSliderChange} // Gọi hàm khi giá trị thay đổi
        />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          color: '#94a3b8',
          padding: '0 10px'
        }}>
          <Typography variant="body2">0</Typography>
          <Typography variant="body2">100</Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 2
        }}>
          <ClearButton 
            onClick={handleClear}
            endIcon={<CloseIcon sx={{ fontSize: 16 }} />}
          >
            Clear my rating
          </ClearButton>
          <StyledButton
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleDone}
          >
            {`I'm Done`}
          </StyledButton>
        </Box>
        
      </DialogContent>
    </StyledDialog>
  );
};

export default RatingDialog;