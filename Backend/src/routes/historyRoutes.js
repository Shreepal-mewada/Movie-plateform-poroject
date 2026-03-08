const express = require('express');
const { getHistory, addHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getHistory);
router.post('/add', addHistory);

module.exports = router;
