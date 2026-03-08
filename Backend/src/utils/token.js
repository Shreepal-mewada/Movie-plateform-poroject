const jwt = require('jsonwebtoken');

const generateTokens = (userId, role) => {
    const payload = { id: userId, role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    });

    return { accessToken, refreshToken };
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateTokens,
    verifyToken
};
