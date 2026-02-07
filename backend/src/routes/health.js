const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /api/health - Health check endpoint
router.get('/', healthController.healthCheck);

// GET /api/health/sync-history - Get sync history
router.get('/sync-history', healthController.getSyncHistory);

module.exports = router;
