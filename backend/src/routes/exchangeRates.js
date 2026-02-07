const express = require('express');
const router = express.Router();
const exchangeRateController = require('../controllers/exchangeRateController');

// GET /api/rates - Get all exchange rates with optional filters
router.get('/', exchangeRateController.getAll);

// GET /api/rates/latest - Get latest exchange rates for all currencies
router.get('/latest', exchangeRateController.getLatest);

// GET /api/rates/:currencyCode - Get historical data for specific currency
router.get('/:currencyCode', exchangeRateController.getHistoricalData);

// POST /api/rates/sync - Trigger manual sync from Banxico API
router.post('/sync', exchangeRateController.syncFromAPI);

module.exports = router;
