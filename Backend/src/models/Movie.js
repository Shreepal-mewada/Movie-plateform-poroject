const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        posterUrl: {
            type: String,
            required: [true, 'Poster URL is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        tmdbId: {
            type: Number,
            unique: true,
            sparse: true,
        },
        releaseDate: {
            type: Date,
        },
        trailerUrl: {
            type: String,
        },
        genre: [
            {
                type: String,
            },
        ],
        category: {
            type: String,
            default: 'General',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Movie', movieSchema);
