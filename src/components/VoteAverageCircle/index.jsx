import React from 'react';
import { Box, CircularProgress, Typography, Tooltip } from '@mui/material';

import styles from './VoteAverageCircle.module.scss';

const VoteAverageCircle = ({ voteAverage }) => {
    // Convert 0-10 scale to 0-100
    const percentage = Math.round(voteAverage * 10);
    
    return (
      <Box
      sx={{
        position: 'relative',
        width: '100%', // Chiếm toàn bộ chiều rộng màn hình
        display: 'flex',
        justifyContent: 'flex-start', // Đẩy nội dung sang phải
        margin:'2rem'
      }}
    >
      {/* Vòng tròn và phần trăm */}
      <Box
        className="relative w-12 h-12"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Vòng tròn nền */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={48}
          thickness={3}
          sx={{
            color: 'rgba(255,255,255,0.1)',
            position: 'absolute',
          }}
        />
        {/* Vòng tròn tiến độ */}
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={48}
          thickness={3}
          sx={{
            position: 'absolute',
            color: '#d2d531',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {/* Phần trăm */}
        <Typography
          sx={{
            position: 'absolute',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {percentage}
          <span style={{ fontSize: '8px', marginLeft: '2px' }}>%</span>
        </Typography>
      </Box>
    </Box>
    );
  };

export default VoteAverageCircle;