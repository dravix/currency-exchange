const express = require('express');
const router = express.Router();

const exchangeRatesRoutes = require('./exchangeRates');
const currenciesRoutes = require('./currencies');
const healthRoutes = require('./health');
const databaseRoutes = require('./database');

// Mount routes
router.use('/rates', exchangeRatesRoutes);
router.use('/currencies', currenciesRoutes);
router.use('/health', healthRoutes);
router.use('/database', databaseRoutes);

// Root API endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Currency Exchange API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            currencies: '/api/currencies',
            rates: '/api/rates',
            latest: '/api/rates/latest',
            sync: 'POST /api/rates/sync',
            database: {
                status: 'GET /api/database/status',
                initialize: 'POST /api/database/initialize',
                reset: 'POST /api/database/reset'
            }
        },
    });
});

module.exports = router;
