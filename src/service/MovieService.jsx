import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utils/Api";
const MOVIE_URI ="/movie";

export const getTrendingMoviesByDay = async ({token, page}) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/trending/day`, null, true, token, page);
};

export const getTrendingMoviesByWeek = async ({ token, page }) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/trending/week`, null, true, token, page);
}

export const getMovieData = async ({movieID, token}) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/${movieID}`,null,true,token);
};