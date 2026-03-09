import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let onStart = () => { };
let onFinish = () => { };

export const setApiCallbacks = (start, finish) => {
    onStart = start;
    onFinish = finish;
};

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
    (config) => {
        onStart();
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        onFinish(false);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        onFinish(true);
        return response;
    },
    (error) => {
        onFinish(false);
        return Promise.reject(error);
    }
);

export default api;
