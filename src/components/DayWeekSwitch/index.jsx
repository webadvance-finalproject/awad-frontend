import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const DayWeekSwitch = ({ onChange }) => {
  const [alignment, setAlignment] = React.useState('day');

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      onChange(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="day week switch"
      sx={{
        borderRadius: '50px',
        overflow: 'hidden',
        border: '1px solid #ccc',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        height: '20px',
      }}
    >
      <ToggleButton value="day" aria-label="day" sx={{ textTransform: 'none' }}>
        Day
      </ToggleButton>
      <ToggleButton value="week" aria-label="week" sx={{ textTransform: 'none' }}>
        Week
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
DayWeekSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default DayWeekSwitch;