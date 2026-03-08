const User = require('../models/User');
const { generateTokens } = require('../utils/token');
const asyncHandler = require('../utils/asyncHandler');
const { redisClient } = require('../config/redis');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Check if the user passed the admin secret in the request to register as an admin
    const role = req.body.adminSecret === 'mysecretadmin' ? 'admin' : 'user';

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        const { accessToken, refreshToken } = generateTokens(user._id, user.role);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            token: accessToken,
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: 'User registered successfully',
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data received');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email, importantly select password as it is hidden by default
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    if (user.isBanned) {
        res.status(403);
        throw new Error('Your account is banned. Please contact support.');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        success: true,
        token: accessToken,
        data: {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        message: 'Login successful',
    });
});

// @desc    Logout user / Blacklist token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    const token = req.token; // from authMiddleware

    if (!token) {
        res.status(400);
        throw new Error('No token provided to logout');
    }

    if (redisClient.isOpen) {
        // Add token to blacklist in Redis
        // Set expiry in Redis to match JWT expiry or use a safe upper bound like 7 days
        const EXPIRE_TIME = 7 * 24 * 60 * 60; // 7 days in seconds
        await redisClient.setEx(`bl_token:${token}`, EXPIRE_TIME, 'true');
    }

    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        data: {},
        message: 'User logged out successfully',
    });
});

module.exports = {
    signup,
    login,
    logout,
};
