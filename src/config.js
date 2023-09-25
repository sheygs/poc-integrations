require('dotenv/config');

const REDIS_CONNECTOR = {
        host: process.env.HOST ?? 'localhost',
        port: process.env.REDIS_PORT ?? 6379,
        password: '',
        tls: false,
};

const REMOVE_CONFIGS = {
        removeOnComplete: {
                age: 3600,
        },
        removeOnFail: {
                age: 24 * 3600,
        },
};

module.exports = {
        REDIS_CONNECTOR,
        REMOVE_CONFIGS,
};
