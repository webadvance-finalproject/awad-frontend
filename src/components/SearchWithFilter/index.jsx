import { useState } from 'react'
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
        minRating: searchParams.get('minRating') || '',
        maxRating: searchParams.get('maxRating') || '',
        minYear: searchParams.get('minYear') || '',
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
                const data = await navigateByLlm({
                    query: keyword,
                    token: null
                });
                if(data && data.statusCode === 200)
                {
                    const searchByLlmData = data?.data?.searchByLlmData?.data;
                    if(!searchByLlmData)
                    {
                        setIsLoading(false);
                        navigate(`/search?${queryParams.toString()}`);
                    }
                    switch (searchByLlmData.route)
                    {
                        case "CAST_PAGE":
                            {
                                const movieID = searchByLlmData?.params?.movie_ids[0];
                                if(movieID)
                                {
                                    setIsLoading(false);
                                    navigate(`/movie/cast/${movieID}`);
                                }
                                else
                                {
                                    setIsLoading(false);
                                    navigate(`/search?${queryParams.toString()}`);
                                }
                                break;
                            }
                        case "MOVIE_PAGE":
                            {
                                const movieID = searchByLlmData.params?.movie_ids[0];
                                if(movieID)
                                {
                                    setIsLoading(false);
                                    navigate(`/movie/${movieID}`);
                                }
                                else
                                {
                                    setIsLoading(false);
                                    navigate(`/search?${queryParams.toString()}`);
                                }
                                break;
                            }
                        case "GENRE_PAGE":
                            {
                                setIsLoading(false);
                                navigate(`/search?${queryParams.toString()}`);
                                break;
                            }
                        case "SEARCH_PAGE":
                            {
                                setIsLoading(false);
                                navigate(`/search?${queryParams.toString()}`);
                                break;
                            }
                        case "PROFILE_PAGE":
                            {
                                setIsLoading(false);
                                navigate(`/search?${queryParams.toString()}`);
                                break;
                            }
                        case "HOME_PAGE":
                            {
                                setIsLoading(false);
                                navigate(`/`);
                                break;
                            }
                        default:{
                            setIsLoading(false);
                            navigate(`/search?${queryParams.toString()}`);
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