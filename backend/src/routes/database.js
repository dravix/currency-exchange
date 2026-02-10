const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/databaseController');

/**
 * @route   GET /api/database/status
 * @desc    Check database status (tables, counts)
 * @access  Public
 */
router.get('/status', databaseController.getDatabaseStatus);

/**
 * @route   POST /api/database/initialize
 * @desc    Initialize database with schema.sql
 * @access  Public (should be protected in production)
 */
router.post('/initialize', databaseController.initializeDatabase);

/**
 * @route   POST /api/database/reset
 * @desc    Reset database (drop and recreate all tables)
 * @access  Public (should be protected in production)
 * @warning This deletes all data!
 */
router.post('/reset', databaseController.resetDatabase);


router.post('/sync', databaseController.syncFromAPI);
module.exports = router;
