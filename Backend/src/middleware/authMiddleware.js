const User = require('../models/User');
const { verifyToken } = require('../utils/token');
const asyncHandler = require('../utils/asyncHandler');
const { redisClient } = require('../config/redis');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized to access this route. Token missing.');
    }

    try {
        // Check if token is blacklisted in Redis
        if (redisClient.isOpen) {
            const isBlacklisted = await redisClient.get(`bl_token:${token}`);
            if (isBlacklisted) {
                res.status(401);
                throw new Error('Token is blacklisted. Please login again.');
            }
        }

        // Verify token
        const decoded = verifyToken(token);

        // Get user from the token but exclude password
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401);
            throw new Error('User not found.');
        }

        if (user.isBanned) {
            res.status(403);
            throw new Error('User is banned from the platform.');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401);
        throw new Error('Not authorized to access this route. Invalid token.');
    }
});

module.exports = { protect };
