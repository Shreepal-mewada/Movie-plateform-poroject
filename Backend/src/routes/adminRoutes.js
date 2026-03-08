const express = require('express');
const {
    addMovie,
    editMovie,
    deleteMovie,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Require both valid JWT and Admin role for all routes here
router.use(protect, authorizeAdmin);

router.post('/movie', addMovie);
router.put('/movie/:id', editMovie);
router.delete('/movie/:id', deleteMovie);

module.exports = router;
