import axios from 'axios';
import { toast } from 'react-toastify';
import authService from '~/services/authService';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_SSO_URL,
    withCredentials: true,
});

httpRequest.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
httpRequest.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    },
    function (error) {
        // Do something with response error
        if (error?.response?.status !== 410) {
            toast.error(error?.response?.data?.message);
        }

        if (error?.response?.status === 410) {
            authService.refreshToken().catch((err) => {
                return Promise.reject(err);
            });
            // return error.
        }

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

export default httpRequest;
