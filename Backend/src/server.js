require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        // 2. Connect to Redis (used for Token Blacklisting)
        await connectRedis();

        // 3. Start Express App
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
