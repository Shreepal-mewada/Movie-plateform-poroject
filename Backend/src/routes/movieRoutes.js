const express = require('express');
const {
    getTrendingMovies,
    getPopularMovies,
    searchMovies,
    getMovieDetails,
    getTrendingTV,
    getPopularTV,
    getGenres,
    getTVDetails,
} = require('../controllers/movieController');

const router = express.Router();

router.get('/trending', getTrendingMovies);
router.get('/popular', getPopularMovies);
router.get('/trending/tv', getTrendingTV);
router.get('/popular/tv', getPopularTV);
router.get('/genres', getGenres);
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);
router.get('/tv/:id', getTVDetails);

module.exports = router;
