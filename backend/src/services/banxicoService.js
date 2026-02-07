const axios = require('axios');
const config = require('../config/config');

class BanxicoService {
    constructor() {
        this.baseURL = config.banxico.apiUrl;
        this.token = config.banxico.token;
        this.timeout = config.banxico.timeout;
    }

    /**
     * Fetch exchange rate data from Banxico API
     * @param {string} seriesIds - Comma-separated series IDs (e.g., 'SF43718,SF46410')
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Array>} Array of exchange rate data
     */
    async fetchExchangeRates(seriesIds, startDate = null, endDate = null) {
        try {
            // Build URL path
            let url = `${this.baseURL}/${seriesIds}/datos`;

            // Add date range if provided
            if (startDate && endDate) {
                url += `/${startDate}/${endDate}`;
            } else if (startDate) {
                const today = new Date().toISOString().split('T')[0];
                url += `/${startDate}/${today}`;
            }

            // Make API request
            const response = await axios.get(url, {
                headers: {
                    'Bmx-Token': this.token,
                    'Accept': 'application/json',
                },
                timeout: this.timeout,
            });

            // Parse and return data
            if (response.data && response.data.bmx && response.data.bmx.series) {
                return this.parseSeriesData(response.data.bmx.series);
            }

            return [];
        } catch (error) {
            if (error.response) {
                throw new Error(
                    `Banxico API error: ${error.response.status} - ${error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('No response received from Banxico API');
            } else {
                throw new Error(`Error fetching data from Banxico: ${error.message}`);
            }
        }
    }

    /**
     * Fetch latest exchange rates for all configured currencies
     * @param {Array} currencies - Array of currency objects with series_id
     * @returns {Promise<Array>} Array of latest exchange rates
     */
    async fetchLatestRates(currencies) {
        try {
            const seriesIds = currencies.map((c) => c.series_id).join(',');
            const today = new Date().toISOString().split('T')[0];
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];

            return await this.fetchExchangeRates(seriesIds, thirtyDaysAgo, today);
        } catch (error) {
            throw new Error(`Error fetching latest rates: ${error.message}`);
        }
    }

    /**
     * Parse Banxico series data into standardized format
     * @param {Array} series - Array of series data from Banxico
     * @returns {Array} Parsed exchange rate data
     */
    parseSeriesData(series) {
        const results = [];

        series.forEach((serie) => {
            const seriesId = serie.idSerie;
            const seriesTitle = serie.titulo;

            if (serie.datos && serie.datos.length > 0) {
                serie.datos.forEach((dato) => {
                    if (dato.dato && dato.dato !== 'N/E') {
                        results.push({
                            series_id: seriesId,
                            currency_name: seriesTitle,
                            currency_code: this.extractCurrencyCode(seriesId),
                            exchange_rate: parseFloat(dato.dato),
                            date: dato.fecha,
                        });
                    }
                });
            }
        });

        return results;
    }

    /**
     * Extract currency code from series ID or title
     * @param {string} seriesId - Banxico series ID
     * @returns {string} Currency code
     */
    extractCurrencyCode(seriesId) {
        // Map common Banxico series IDs to currency codes
        const seriesMap = {
            SF43718: 'USD',
            SF46410: 'EUR',
            SF46407: 'GBP',
            SF46406: 'JPY',
            SF43728: 'CAD',
        };

        return seriesMap[seriesId] || 'UNKNOWN';
    }

    /**
     * Health check for Banxico API
     * @returns {Promise<boolean>} true if API is accessible
     */
    async healthCheck() {
        try {
            // Try to fetch a single series with minimal data
            const response = await axios.get(`${this.baseURL}/SF43718/datos/oportuno`, {
                headers: {
                    'Bmx-Token': this.token,
                    'Accept': 'application/json',
                },
                timeout: 5000,
            });

            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new BanxicoService();
