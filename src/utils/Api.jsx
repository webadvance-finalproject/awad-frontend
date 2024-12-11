import { API_STATUS, HTTP_METHOD } from "../config/common.jsx";
import queryString from "query-string";

const API_HOST = import.meta.env.VITE_API_HOST;


export const makeRequest = async (
    method,
    url,
    data = null,
    redirectToLogin = true,
    token,
    page = null
) => {
    let res = null;
    try {
        const query = page ? { ...data, page } : data;
        if (method === HTTP_METHOD.GET || method === HTTP_METHOD.DELETE) {
            res = await (
                await fetch(
                    `${API_HOST}${url}?${queryString.stringify(query)}`,
                    {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " +token,
                        },
                    }
                )
            ).json();
        } else {
            res = await (
                await fetch(`${API_HOST}${url}`, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " +token,
                    },
                    body: JSON.stringify(data || {}),
                })
            ).json();
        }
    } catch (error) {
        console.log("Make resquest error: ", error);
        return {
            status: API_STATUS.INTERNAL_ERROR,
        };
    }

    if (redirectToLogin && res && res.status === API_STATUS.UNAUTHORIZED) {
        window.location.href = `/login?url=${window.location.pathname}${window.location.search}`;
    }
    return res;
};
