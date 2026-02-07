const app = require('./app');
const config = require('./config/config');
const { testConnection } = require('./config/database');

const PORT = config.server.port;

// Start server
const startServer = async () => {
    try {
        // Test database connection
        console.log('Testing database connection...');
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('Failed to connect to database. Please check your configuration.');
            process.exit(1);
        }

        // Start listening
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`✓ Currency Exchange API Server`);
            console.log(`✓ Environment: ${config.server.env}`);
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ API documentation: http://localhost:${PORT}/api`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

// Start the server
startServer();
