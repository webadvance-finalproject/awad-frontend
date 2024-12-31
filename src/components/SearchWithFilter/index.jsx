import React, { useState } from 'react'
import Filter from './Filter'
import SearchBar from './SearchBar'
import { useNavigate } from 'react-router-dom'

const SearchWithFilter = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const [localState, setLocalState] = useState({
        keyword: searchParams.get('keyword') || '',
        actors: searchParams.get('actors') ? searchParams.get('actors').split(',') : [],
        genres: searchParams.get('genres') || '',
        minRating: searchParams.get('minRating') || null,
        maxRating: searchParams.get('maxRating') || null,
        minYear: searchParams.get('minYear') || null,
    });

    const onInputChange = (value) => {
        setLocalState(prev => ({
            ...prev,
            ...value,
        }));
    }

    const handleSearchSubmit = () => {
        const queryParams = new URLSearchParams();
        if (localState.keyword) queryParams.append('keyword', localState.keyword);
        if (localState.actors.length > 0) queryParams.append('actors', localState.actors.join(','));
        if (localState.genres) queryParams.append('genres', localState.genres);
        if (localState.minRating) queryParams.append('minRating', localState.minRating);
        if (localState.maxRating) queryParams.append('maxRating', localState.maxRating);
        if (localState.minYear) queryParams.append('minYear', localState.minYear);
        navigate(`/search?${queryParams.toString()}`);
    }

    return (
        <>
            <SearchBar defaultValue={localState.keyword} onSearchChange={onInputChange} handleSubmit={handleSearchSubmit} />
            <Filter defaultValue={localState} onFilterChange={onInputChange}/>
        </>
    )
}

export default SearchWithFilter