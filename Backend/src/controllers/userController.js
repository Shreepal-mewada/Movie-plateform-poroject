const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');

    res.status(200).json({
        success: true,
        data: users,
        message: 'Users fetched successfully',
    });
});

// @desc    Ban or Unban a user
// @route   PUT /api/users/ban/:id
// @access  Private/Admin
const toggleBanUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prevent admin from banning themselves
    if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot ban yourself');
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
        success: true,
        data: { _id: user._id, isBanned: user.isBanned },
        message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot delete yourself');
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
        message: 'User deleted successfully',
    });
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUsers,
    toggleBanUser,
    deleteUser,
    getMe,
};
