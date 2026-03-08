const express = require('express');
const {
    getUsers,
    toggleBanUser,
    deleteUser,
    getMe,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/me', protect, getMe);

// Admin only routes
router.use(protect, authorizeAdmin);

router.get('/', getUsers);
router.put('/ban/:id', toggleBanUser);
router.delete('/:id', deleteUser);

module.exports = router;
