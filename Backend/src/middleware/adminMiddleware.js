const asyncHandler = require('../utils/asyncHandler');

const authorizeAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin.');
    }
});

module.exports = { authorizeAdmin };
