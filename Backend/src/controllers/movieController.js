const asyncHandler = require('../utils/asyncHandler');
const tmdbService = require('../services/tmdbService');

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const data = await tmdbService.getTrendingMovies('day', page);

    res.status(200).json({
        success: true,
        data,
        message: 'Trending movies fetched successfully',
    });
});

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const data = await tmdbService.getPopularMovies(page);

    res.status(200).json({
        success: true,
        data,
        message: 'Popular movies fetched successfully',
    });
});

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = asyncHandler(async (req, res) => {
    const { query, page = 1, year } = req.query;

    if (!query && !req.query.genre) {
        res.status(400);
        throw new Error('Search query or genre is required');
    }

    let data;
    if (query) {
        data = await tmdbService.searchMovies(query, page, year);
        // Manual genre filtering if genre is provided since TMDB search doesn't support it
        if (req.query.genre && data.results) {
            const genreId = parseInt(req.query.genre);
            data.results = data.results.filter(movie =>
                movie.genre_ids && movie.genre_ids.includes(genreId)
            );
            data.total_results = data.results.length;
        }
    } else if (req.query.genre) {
        // Use discover if only genre is provided
        // We'll need to add getMoviesByGenre to tmdbService or use a generic discover method
        data = await tmdbService.getPopularMovies(page); // Fallback for now, could be discovered
    }

    res.status(200).json({
        success: true,
        data,
        message: 'Movies search results fetched successfully',
    });
});

// @desc    Get all movie genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
    const data = await tmdbService.getMovieGenres();
    res.status(200).json({
        success: true,
        data: data.genres,
        message: 'Genres fetched successfully',
    });
});

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400);
        throw new Error('Movie ID is required');
    }

    const data = await tmdbService.getMovieDetails(id);

    res.status(200).json({
        success: true,
        data,
        message: 'Movie details fetched successfully',
    });
});

// @desc    Get trending TV shows
// @route   GET /api/movies/trending/tv
// @access  Public
const getTrendingTV = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const data = await tmdbService.getTrendingTV('day', page);

    res.status(200).json({
        success: true,
        data,
        message: 'Trending TV shows fetched successfully',
    });
});

// @desc    Get popular TV shows
// @route   GET /api/movies/popular/tv
// @access  Public
const getPopularTV = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const data = await tmdbService.getPopularTV(page);

    res.status(200).json({
        success: true,
        data,
        message: 'Popular TV shows fetched successfully',
    });
});

module.exports = {
    getTrendingMovies,
    getPopularMovies,
    searchMovies,
    getMovieDetails,
    getTrendingTV,
    getPopularTV,
    getGenres,
    getTVDetails: asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            throw new Error('TV Show ID is required');
        }
        const data = await tmdbService.getTVDetails(id);
        res.status(200).json({
            success: true,
            data,
            message: 'TV show details fetched successfully',
        });
    }),
};
