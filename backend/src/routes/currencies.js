const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

// GET /api/currencies - Get all active currencies
router.get('/', currencyController.getAll);

// GET /api/currencies/:currencyCode - Get currency by code
router.get('/:currencyCode', currencyController.getByCode);

// POST /api/currencies - Create or update currency
router.post('/', currencyController.upsert);

module.exports = router;
