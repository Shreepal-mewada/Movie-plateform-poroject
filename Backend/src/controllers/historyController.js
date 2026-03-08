const User = require('../models/User');
const Movie = require('../models/Movie');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user watch history
// @route   GET /api/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('watchHistory.movieId');

    res.status(200).json({
        success: true,
        data: user.watchHistory,
        message: 'Watch history fetched successfully',
    });
});

// @desc    Add movie to watch history
// @route   POST /api/history/add
// @access  Private
const addHistory = asyncHandler(async (req, res) => {
    const { movieId } = req.body;

    if (!movieId) {
        res.status(400);
        throw new Error('Movie ID is required');
    }

    // Ensure movie exists locally
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

    // Optional: Update timestamp if already in history, or remove old and push new
    const existingIndex = user.watchHistory.findIndex(
        (item) => item.movieId.toString() === movie._id.toString()
    );

    if (existingIndex !== -1) {
        // Bring to top by updating timestamp (or removing and repushing)
        user.watchHistory[existingIndex].watchedAt = Date.now();
    } else {
        user.watchHistory.push({ movieId: movie._id, watchedAt: Date.now() });
    }

    await user.save();

    res.status(200).json({
        success: true,
        data: user.watchHistory,
        message: 'Movie added to watch history',
    });
});

module.exports = {
    getHistory,
    addHistory,
};
