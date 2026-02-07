const banxicoService = require('./banxicoService');
const ExchangeRate = require('../models/ExchangeRate');
const Currency = require('../models/Currency');
const SyncLog = require('../models/SyncLog');

class SyncService {
    /**
     * Sync exchange rates from Banxico API to database
     * @param {string} startDate - Optional start date
     * @param {string} endDate - Optional end date
     * @returns {Promise<Object>} Sync results
     */
    async syncExchangeRates(startDate = null, endDate = null) {
        const logId = await SyncLog.create({
            sync_type: 'exchange_rates',
            status: 'running',
        });

        try {
            // Get all active currencies
            const currencies = await Currency.findAll();

            if (currencies.length === 0) {
                throw new Error('No active currencies found in database');
            }

            // Fetch data from Banxico API
            let exchangeRates;
            if (startDate || endDate) {
                const seriesIds = currencies.map((c) => c.series_id).join(',');
                exchangeRates = await banxicoService.fetchExchangeRates(
                    seriesIds,
                    startDate,
                    endDate
                );
            } else {
                exchangeRates = await banxicoService.fetchLatestRates(currencies);
            }

            if (exchangeRates.length === 0) {
                await SyncLog.complete(logId, 'success', 0, 'No new data available');
                return {
                    success: true,
                    message: 'No new data available',
                    recordsProcessed: 0,
                };
            }

            // Bulk insert/update exchange rates
            await ExchangeRate.bulkUpsert(exchangeRates);

            // Update sync log
            await SyncLog.complete(logId, 'success', exchangeRates.length);

            return {
                success: true,
                message: 'Exchange rates synced successfully',
                recordsProcessed: exchangeRates.length,
            };
        } catch (error) {
            await SyncLog.complete(logId, 'failed', 0, error.message);
            throw error;
        }
    }

    /**
     * Get sync history
     * @param {number} limit - Number of records to return
     * @returns {Promise<Array>} Sync logs
     */
    async getSyncHistory(limit = 10) {
        return await SyncLog.findRecent(limit);
    }
}

module.exports = new SyncService();
