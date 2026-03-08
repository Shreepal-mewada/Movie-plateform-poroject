const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => {
    console.warn(`[Redis] Connection failed: ${err.message}. Authentication token blacklisting will be disabled.`);
});
redisClient.on('connect', () => console.log('[Redis] Client Connected successfully.'));

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect().catch(err => {
                console.warn('[Redis] Failed to establish initial connection. App will start without Redis.');
            });
        }
    } catch (err) {
        console.warn(`[Redis] Initialization Error: ${err.message}`);
    }
};

module.exports = {
    redisClient,
    connectRedis,
};
