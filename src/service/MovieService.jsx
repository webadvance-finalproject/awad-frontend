import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utils/Api";
const MOVIE_URI = "/movie";

// TODO: paramtrize limit
export const getTrendingMoviesByDay = async ({ token, page }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/trending/today`, null, true, token, page);
};

// TODO: paramtrize limit
export const getTrendingMoviesByWeek = async ({ token, page }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/trending/this-week`, null, true, token, page);
}

export const getMovieData = async ({ movieID, token }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/${movieID}`, null, true, token);
};

export const searchMovie = async ({ data, token, page, limit = 20}) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/search`, { ...data, limit }, true, token, page);
}
export const getMovieCast = async ({ movieID, token }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/${movieID}/cast`, null, true, token);
}

export const getActorDetail = async ({ actorID, token }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/actor/${actorID}`, null, true, token);
}

export const searchActor = async ({ keyword, token, page, limit }) => {
    const data = { keyword, limit }
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/actor/search`, data, true, token, page);
}

export const getActorsByIDs = async ({ arrID, token }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/actor/find`, { ids: arrID }, true, token);
}

export const getAllGenre = async ({ token }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/genres`, null, true, token)
}

export const getGenresByIDs = async ({ arrID, token }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/genres/find`, { ids: arrID }, true, token)
}

export const navigateByLlm = async({query, token})=>{
    return makeRequest(HTTP_METHOD.POST, `${MOVIE_URI}/llm`, { query } ,true, token)
}

export const getPopularMovies = async ({ token, page }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/popular`, null, true, token, page);
}