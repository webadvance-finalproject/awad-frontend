import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utils/Api";
const MOVIE_URI ="/movie";

export const getMovieData = async ({movieID, token}) => {
    return makeRequest(HTTP_METHOD.GET, `${MOVIE_URI}/${movieID}`,null,true,token);
};