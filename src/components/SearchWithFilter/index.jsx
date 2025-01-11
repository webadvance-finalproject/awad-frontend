import React, { useState } from 'react'
import Filter from './Filter'
import SearchBar from './SearchBar'
import { useNavigate } from 'react-router-dom'
import { navigateByLlm } from '../../service/MovieService'
import { useStore } from '../../store'
const SearchWithFilter = ({setIsLoading}) => {
    const navigate = useNavigate();
    const user = useStore((state) => state.user);
    const searchParams = new URLSearchParams(window.location.search);
    const [localState, setLocalState] = useState({
        keyword: searchParams.get('keyword') || '',
        actors: searchParams.get('actors') ? searchParams.get('actors').split(',') : [],
        genres: searchParams.get('genres') || '',
        minRating: searchParams.get('minRating') || null,
        maxRating: searchParams.get('maxRating') || null,
        minYear: searchParams.get('minYear') || null,
        llm: searchParams.get('llm') || false,
    });

    const onInputChange = (value) => {
        setLocalState(prev => ({
            ...prev,
            ...value,
        }));
    }

    const handleSearchSubmit = async () => {
        const queryParams = new URLSearchParams();
        if (localState.keyword) queryParams.append('keyword', localState.keyword);
        if (localState.actors.length > 0) queryParams.append('actors', localState.actors.join(','));
        if (localState.genres) queryParams.append('genres', localState.genres);
        if (localState.minRating) queryParams.append('minRating', localState.minRating);
        if (localState.maxRating) queryParams.append('maxRating', localState.maxRating);
        if (localState.minYear) queryParams.append('minYear', localState.minYear);
        if(localState.llm)
        {
            setIsLoading(true);
            const keyword = localState.keyword;
            if(keyword)
            {
                const token = await user.getIdToken();
                const data = await navigateByLlm({
                    query: keyword,
                    token: token
                });
                if(data && data.statusCode === 200)
                {
                    const searchByLlmData = data?.data?.searchByLlmData?.data;
                    if(!searchByLlmData)
                    {
                        navigate(`/search?${queryParams.toString()}`);
                    }
                    switch (searchByLlmData.route)
                    {
                        case "CAST_PAGE":
                            {
                                const movieID = searchByLlmData?.params?.movie_ids[0];
                                if(movieID)
                                {
                                    navigate(`/movie/cast/${movieID}`);
                                }
                                else
                                {
                                    navigate(`/search?${queryParams.toString()}`);
                                }
                                break;
                            }
                        case "MOVIE_PAGE":
                            {
                                const movieID = searchByLlmData.params?.movie_ids[0];
                                if(movieID)
                                {
                                    navigate(`/movie/${movieID}`);
                                }
                                else
                                {
                                    navigate(`/search?${queryParams.toString()}`);
                                }
                                break;
                            }
                        case "GENRE_PAGE":
                            {
                                navigate(`/search?${queryParams.toString()}`);
                                break;
                            }
                        case "SEARCH_PAGE":
                            {
                                navigate(`/search?${queryParams.toString()}`);
                                break;
                            }
                        case "PROFILE_PAGE":
                            {
                                navigate(`/search?${queryParams.toString()}`);
                                break;
                            }
                        case "HOME_PAGE":
                            {
                                navigate(`/`);
                                break;
                            }
                        default:{
                            navigate(`/`);
                            break;
                        }
                    }
                }
            }
        }
        else
        {
            navigate(`/search?${queryParams.toString()}`);
        }
    }

    return (
        <>
            <SearchBar defaultValue={localState.keyword} onSearchChange={onInputChange} handleSubmit={handleSearchSubmit} />
            <Filter defaultValue={localState} onFilterChange={onInputChange}/>
        </>
    )
}

export default SearchWithFilter