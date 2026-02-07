const Currency = require('../models/Currency');

class CurrencyController {
    /**
     * Get all active currencies
     */
    async getAll(req, res) {
        try {
            const currencies = await Currency.findAll();

            res.json({
                success: true,
                data: currencies,
                count: currencies.length,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * Get currency by code
     */
    async getByCode(req, res) {
        try {
            const { currencyCode } = req.params;
            const currency = await Currency.findByCode(currencyCode.toUpperCase());

            if (!currency) {
                return res.status(404).json({
                    success: false,
                    error: 'Currency not found',
                });
            }

            res.json({
                success: true,
                data: currency,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * Create or update currency
     */
    async upsert(req, res) {
        try {
            const { currency_code, currency_name, series_id, is_active } = req.body;

            if (!currency_code || !currency_name || !series_id) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: currency_code, currency_name, series_id',
                });
            }

            const result = await Currency.upsert({
                currency_code: currency_code.toUpperCase(),
                currency_name,
                series_id,
                is_active,
            });

            res.json({
                success: true,
                message: 'Currency saved successfully',
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
}

module.exports = new CurrencyController();
