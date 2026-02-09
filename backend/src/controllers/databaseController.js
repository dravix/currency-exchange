const databaseService = require('../services/databaseService');

/**
 * Initialize the database with schema.sql
 * POST /api/database/initialize
 */
const initializeDatabase = async (req, res) => {
    try {
        const result = await databaseService.initializeDatabase();

        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                statementsExecuted: result.statementsExecuted,
                totalStatements: result.totalStatements
            }
        });
    } catch (error) {
        console.error('Database initialization failed:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to initialize database',
            error: error.error || error.message
        });
    }
};

/**
 * Check database status
 * GET /api/database/status
 */
const getDatabaseStatus = async (req, res) => {
    try {
        const status = await databaseService.checkDatabaseStatus();

        res.status(200).json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Failed to get database status:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get database status',
            error: error.error || error.message
        });
    }
};

/**
 * Reset the database (drop and recreate)
 * WARNING: This deletes all data!
 * POST /api/database/reset
 */
const resetDatabase = async (req, res) => {
    try {
        // Require confirmation parameter
        const { confirm } = req.body;

        if (confirm !== 'YES_DELETE_ALL_DATA') {
            return res.status(400).json({
                success: false,
                message: 'Reset requires confirmation. Send { "confirm": "YES_DELETE_ALL_DATA" } in request body'
            });
        }

        const result = await databaseService.resetDatabase();

        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                statementsExecuted: result.statementsExecuted,
                totalStatements: result.totalStatements
            }
        });
    } catch (error) {
        console.error('Database reset failed:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reset database',
            error: error.error || error.message
        });
    }
};

module.exports = {
    initializeDatabase,
    getDatabaseStatus,
    resetDatabase
};
