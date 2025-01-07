import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utils/Api";
const USER_URL ="/user";

export const addFavoriteMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.POST, `${USER_URL}/favorite`, {movieID}, true, token);
}

export const removeFavoriteMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.DELETE, `${USER_URL}/favorite/${movieID}`, null, true, token);
}
export const getFavoriteMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/favorite/${movieID}`, null, true, token);
}

export const addWatchlistMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.POST, `${USER_URL}/watchlist`, {movieID}, true, token);
}

export const removeWatchlistMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.DELETE, `${USER_URL}/watchlist/${movieID}`, null, true, token);
}

export const getWatchlistMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/watchlist/${movieID}`, null, true, token);
}

export const addRatingMovie = async ({token, movieID, rating}) => {
    return makeRequest(HTTP_METHOD.POST, `${USER_URL}/rating`, {movieID, rating}, true, token);
}

export const getRatings = async ({ token }) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/rating`, null, true, token);
}

export const getRatingMovie = async ({token, movieID}) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/rating/${movieID}`, null, true, token);
}

export const addReviewMovie = async ({token, movieID, review}) => {
    return makeRequest(HTTP_METHOD.POST, `${USER_URL}/review`, {movieID, review}, true, token);
}

export const getReviewMovie = async ({token = '', movieID}) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/review/${movieID}`, null, true, token);
}

export const getSimilarMovies = async ({token = '', movieID}) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/similar/${movieID}`, null, true, token);
}

export const getRecommendMovies = async({token}) => {
    return makeRequest(HTTP_METHOD.GET, `${USER_URL}/similar`, null, true, token);
}