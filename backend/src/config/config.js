require('dotenv').config();

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    },
    banxico: {
        apiUrl: process.env.BANXICO_API_URL,
        token: process.env.BANXICO_API_TOKEN,
        timeout: process.env.API_TIMEOUT || 30000,
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    },
};
