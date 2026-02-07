const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/config');
const routes = require('./routes');
const { testConnection } = require('./config/database');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors(config.cors)); // CORS configuration
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Currency Exchange Backend API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(config.server.env === 'development' && { stack: err.stack }),
    });
});

module.exports = app;
