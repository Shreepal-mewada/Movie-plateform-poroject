const User = require('../models/User');
const Movie = require('../models/Movie');
const asyncHandler = require('../utils/asyncHandler');
const tmdbService = require('../services/tmdbService');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
        success: true,
        data: user.favorites,
        message: 'Favorites fetched successfully',
    });
});

// @desc    Add a movie to favorites
// @route   POST /api/favorites/add
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
    const { movieId } = req.body;

    if (!movieId) {
        res.status(400);
        throw new Error('Movie ID is required');
    }

    // Check if movie exists in local DB. If not, fetch from TMDB and cache it.
    let movie = await Movie.findOne({ tmdbId: movieId });

    if (!movie) {
        try {
            const tmdbData = await tmdbService.getMovieDetails(movieId);
            movie = await Movie.create({
                title: tmdbData.title,
                posterUrl: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80',
                description: tmdbData.overview || 'No description available',
                tmdbId: movieId,
                releaseDate: tmdbData.release_date,
                genre: tmdbData.genres?.map(g => g.name) || [],
                rating: tmdbData.vote_average
            });
        } catch (error) {
            console.error('TMDB Fetch Error:', error);
            res.status(404);
            throw new Error('Movie not found on TMDB and missing locally.');
        }
    }

    const user = await User.findById(req.user._id);

    // Check if already in favorites (storing local _id)
    if (user.favorites.includes(movie._id)) {
        res.status(400);
        throw new Error('Movie already in favorites');
    }

    user.favorites.push(movie._id);
    await user.save();

    res.status(200).json({
        success: true,
        data: user.favorites,
        message: 'Movie added to favorites',
    });
});

// @desc    Remove a movie from favorites
// @route   DELETE /api/favorites/remove
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
    const { movieId } = req.body;

    if (!movieId) {
        res.status(400);
        throw new Error('Movie ID is required');
    }

    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== movieId
    );

    await user.save();

    res.status(200).json({
        success: true,
        data: user.favorites,
        message: 'Movie removed from favorites',
    });
});

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
};
