const Movie = require('../models/Movie');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Add a new movie
// @route   POST /api/admin/movie
// @access  Private/Admin
const addMovie = asyncHandler(async (req, res) => {
    const {
        title,
        posterUrl,
        description,
        tmdbId,
        releaseDate,
        trailerUrl,
        genre,
        category,
    } = req.body;

    const movie = await Movie.create({
        title,
        posterUrl,
        description,
        tmdbId,
        releaseDate,
        trailerUrl,
        genre,
        category,
    });

    res.status(201).json({
        success: true,
        data: movie,
        message: 'Movie added successfully',
    });
});

// @desc    Edit a movie
// @route   PUT /api/admin/movie/:id
// @access  Private/Admin
const editMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let movie = await Movie.findById(id);

    if (!movie) {
        res.status(404);
        throw new Error('Movie not found');
    }

    movie = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: movie,
        message: 'Movie updated successfully',
    });
});

// @desc    Delete a movie
// @route   DELETE /api/admin/movie/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
        res.status(404);
        throw new Error('Movie not found');
    }

    await movie.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
        message: 'Movie deleted successfully',
    });
});

module.exports = {
    addMovie,
    editMovie,
    deleteMovie,
};
