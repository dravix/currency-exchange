const express = require('express');
const router = express.Router();

const exchangeRatesRoutes = require('./exchangeRates');
const currenciesRoutes = require('./currencies');
const healthRoutes = require('./health');

// Mount routes
router.use('/rates', exchangeRatesRoutes);
router.use('/currencies', currenciesRoutes);
router.use('/health', healthRoutes);

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
        },
    });
});

module.exports = router;
