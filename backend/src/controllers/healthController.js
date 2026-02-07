const syncService = require('../services/syncService');
const banxicoService = require('../services/banxicoService');
const { testConnection } = require('../config/database');

class HealthController {
    /**
     * Health check endpoint
     */
    async healthCheck(req, res) {
        try {
            const dbHealthy = await testConnection();
            const apiHealthy = await banxicoService.healthCheck();

            const health = {
                status: dbHealthy && apiHealthy ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString(),
                services: {
                    database: dbHealthy ? 'up' : 'down',
                    banxicoAPI: apiHealthy ? 'up' : 'down',
                },
            };

            const statusCode = health.status === 'healthy' ? 200 : 503;

            res.status(statusCode).json(health);
        } catch (error) {
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
            });
        }
    }

    /**
     * Get sync history
     */
    async getSyncHistory(req, res) {
        try {
            const { limit } = req.query;
            const history = await syncService.getSyncHistory(
                limit ? parseInt(limit) : 10
            );

            res.json({
                success: true,
                data: history,
                count: history.length,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
}

module.exports = new HealthController();
