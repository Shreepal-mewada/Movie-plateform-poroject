const express = require('express');
const {
    getFavorites,
    addFavorite,
    removeFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getFavorites);
router.post('/add', addFavorite);
router.delete('/remove', removeFavorite);

module.exports = router;
