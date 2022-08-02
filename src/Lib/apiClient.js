import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

export const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: { 
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
    },
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
    }
});

//Provisional
export const setJWT = ( jwt ) => {
    axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
}