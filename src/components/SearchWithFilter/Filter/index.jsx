import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../../store';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Autocomplete,
    TextField,
    Box,
    Typography,
    Checkbox, FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import debounce from 'lodash.debounce';
import { getGenresByIDs, getAllGenre, searchActor, getActorsByIDs } from '../../../service/MovieService';

const Filter = ({ defaultValue, onFilterChange }) => {
    const [actors, setActors] = useState([]);
    const [actorOptions, setActorOptions] = useState([]);
    const [genres, setGenres] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);
    const [minRating, setMinRating] = useState(defaultValue.minRating);
    const [maxRating, setMaxRating] = useState(defaultValue.maxRating);
    const [minYear, setMinYear] = useState(defaultValue.minYear);
    const [llm, setLlm] = useState(defaultValue.llm);
    const [loading, setLoading] = useState(false);
    const user = useStore((state) => state.user);

    const labelStyles = {
        marginBottom: '1rem',
        fontWeight: 'bold',
    }

    const handleUseAIChange = async (event) =>
    {
        setLlm(event.target.checked)
    }
    const handleSearchActor = async (value) => {
        setLoading(true);
        const token = await user.getIdToken();
        if (value !== '') {
            searchActor({ keyword: value, token, page: 1, limit: 10 })
                .then((data) => {
                    setActorOptions(data.results);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }
    const debounceActor = useCallback(debounce((value) => handleSearchActor(value), 500), []);
    const handleActorInputChange = async (value) => {
        debounceActor(value);
    }


    const handleRatingChange = (type) => (event) => {
        const value = event.target.value;
        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
            if (type === 'min') {
                setMinRating(value);
            } else if (type === 'max') {
                setMaxRating(value);
            }
        }
    };

    const handleYearChange = (event) => {
        const value = event.target.value;
        setMinYear(value);
    };

    useEffect(() => {
        const getAllGenreForFilter = async () => {
            const token = await user.getIdToken();
            const rs = await getAllGenre({ token });
            setGenreOptions(rs)
        }
        getAllGenreForFilter();

        const getCurrentGenre = async () => {
            if (defaultValue.genres.length > 0) {
                const token = await user.getIdToken();
                const rs = await getGenresByIDs({ arrID: defaultValue.genres, token })
                setGenres(rs);
            }
        }
        getCurrentGenre();

        const getCurrentActor = async () => {
            if (defaultValue.actors.length > 0) {
                const token = await user.getIdToken();
                const rs = await getActorsByIDs({ arrID: defaultValue.actors, token })
                console.log(rs);
                setActors(rs);
            }
        }
        getCurrentActor();
    }, [])

    useEffect(() => {
        onFilterChange({ actors: actors.map(actor => actor.id), genres: genres.map(genre => genre.id), minRating: minRating, maxRating: maxRating, minYear: minYear, llm });
    }, [actors, genres, minRating, maxRating, minYear, llm]);

    return (
        <Accordion
            sx={{
                boxShadow: 'none',
                '&:before': {
                    display: 'none',
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    padding: 0,
                    '& .MuiAccordionSummary-content': {
                        margin: 1,
                    },
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        marginLeft: 3,
                    },
                }}
            >
                <Typography sx={{textDecoration: 'underline', textUnderlineOffset: '4px'}}>Tìm kiếm nâng cao</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={4}>
                    <Grid item size={{ sm: 12, md: 2 }}>
                        <Typography sx={labelStyles}>
                            Tên diễn viên
                        </Typography>
                        <Autocomplete
                            fullWidth
                            multiple={true}
                            filterSelectedOptions
                            options={actorOptions}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} placeholder="Chọn diễn viên" />}
                            renderOption={(props, option) => (
                                <li {...props} key={option}>
                                    <img src={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${option.profile_path}`} alt={option.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                    {option.name}
                                </li>
                            )}
                            value={actors}
                            onChange={(_, newValue) => {
                                setActors(newValue)
                            }}
                            onInputChange={(_, newValue) => handleActorInputChange(newValue)}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item size={{ sm: 12, md: 2 }}>
                        <Typography sx={labelStyles}>
                            Thể loại
                        </Typography>
                        <Autocomplete
                            fullWidth
                            multiple
                            options={genreOptions}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} placeholder="Chọn thể loại" />}
                            value={genres}
                            onChange={(_, newValue) => setGenres(newValue)}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />
                    </Grid>
                    <Grid item >
                        <Typography sx={labelStyles}>
                            Đánh giá (0-10)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Min"
                                value={minRating}
                                onChange={handleRatingChange('min')}
                                inputProps={{
                                    step: "0.1",
                                    min: 0,
                                    max: 10
                                }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Max"
                                value={maxRating}
                                onChange={handleRatingChange('max')}
                                inputProps={{
                                    step: "0.1",
                                    min: 0,
                                    max: 10
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item size={{ sm: 12, md: 2 }}>
                        <Typography sx={labelStyles}>
                            Năm phát hành từ
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            placeholder="Từ năm"
                            value={minYear}
                            onChange={handleYearChange}
                        />
                    </Grid>
                    <Grid item size={{ sm: 12, md: 2 }}>
                        <FormControlLabel
                            label="Sử dụng AI"
                            control={<Checkbox checked={llm} onChange={handleUseAIChange} />}
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default Filter;