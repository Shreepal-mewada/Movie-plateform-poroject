const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY
    }
});

// Intercept request to ensure API key is injected even if process.env loads late
tmdbApi.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params.api_key = process.env.TMDB_API_KEY;
    return config;
});

// Intercept response to cleanly format TMDB errors and network timeouts
tmdbApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
            throw new Error('TMDB API connection timed out. If you are located in India or a restricted region, your ISP might be blocking TMDB ("api.themoviedb.org"). Please try using a VPN or an alternative network.');
        }
        if (error.response && error.response.data) {
            throw new Error(`TMDB API Error: ${error.response.data.status_message || error.message}`);
        }
        throw new Error(`TMDB API Network Error: ${error.message}`);
    }
);

const tmdbService = {
    getTrendingMovies: async (timeWindow = 'day', page = 1) => {
        const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
            params: { page }
        });
        return response.data;
    },

    getPopularMovies: async (page = 1) => {
        const response = await tmdbApi.get('/movie/popular', {
            params: { page }
        });
        return response.data;
    },

    getMovieDetails: async (movieId) => {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: { append_to_response: 'videos,credits' }
        });
        return response.data;
    },

    searchMovies: async (query, page = 1, year = null) => {
        const response = await tmdbApi.get('/search/movie', {
            params: { query, page, primary_release_year: year }
        });
        return response.data;
    },

    getMovieGenres: async () => {
        const response = await tmdbApi.get('/genre/movie/list');
        return response.data;
    },

    getTrendingTV: async (timeWindow = 'day', page = 1) => {
        const response = await tmdbApi.get(`/trending/tv/${timeWindow}`, {
            params: { page }
        });
        return response.data;
    },

    getPopularTV: async (page = 1) => {
        const response = await tmdbApi.get('/tv/popular', {
            params: { page }
        });
        return response.data;
    },

    getTVDetails: async (tvId) => {
        const response = await tmdbApi.get(`/tv/${tvId}`, {
            params: { append_to_response: 'videos,credits' }
        });
        return response.data;
    }
};

module.exports = tmdbService;
