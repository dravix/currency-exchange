const ExchangeRate = require('../models/ExchangeRate');
const syncService = require('../services/syncService');

class ExchangeRateController {
    /**
     * Get all exchange rates with optional filters
     */
    async getAll(req, res) {
        try {
            const { currencyCode, startDate, endDate, limit } = req.query;

            const filters = {
                currencyCode,
                startDate,
                endDate,
                limit: limit || 100,
            };

            const rates = await ExchangeRate.findAll(filters);

            res.json({
                success: true,
                data: rates,
                count: rates.length,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * Get latest exchange rates for all currencies
     */
    async getLatest(req, res) {
        try {
            const rates = await ExchangeRate.findLatest();

            res.json({
                success: true,
                data: rates,
                count: rates.length,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * Trigger manual sync from Banxico API
     */
    async syncFromAPI(req, res) {
        try {
            const { startDate, endDate } = req.body;

            const result = await syncService.syncExchangeRates(startDate, endDate);

            res.json({
                success: true,
                message: result.message,
                recordsProcessed: result.recordsProcessed,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * Get historical data for specific currency
     */
    async getHistoricalData(req, res) {
        try {
            const { currencyCode } = req.params;
            const { startDate, endDate, limit } = req.query;

            const filters = {
                currencyCode: currencyCode.toUpperCase(),
                startDate,
                endDate,
                limit: limit || 365,
            };

            const rates = await ExchangeRate.findAll(filters);

            if (rates.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'No data found for the specified currency',
                });
            }

            res.json({
                success: true,
                data: rates,
                count: rates.length,
                currency: currencyCode.toUpperCase(),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
}

module.exports = new ExchangeRateController();
