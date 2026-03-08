const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost:3000'
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow any localhost or 127.0.0.1 origin for development
            const isLocalhost = origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:');

            if (isLocalhost || allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            } else {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Apply basic rate limiting to all requests
app.use('/api/', apiLimiter);

// Setup Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// 404 Route handler
app.use((req, res, next) => {
    res.status(404);
    next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
