const { pool } = require('../config/database');

class Currency {
    // Get all active currencies
    static async findAll() {
        try {
            const query = `
        SELECT * FROM currencies
        WHERE is_active = true
        ORDER BY currency_code
      `;

            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching currencies: ${error.message}`);
        }
    }

    // Get currency by code
    static async findByCode(currencyCode) {
        try {
            const query = `
        SELECT * FROM currencies
        WHERE currency_code = ? AND is_active = true
      `;

            const [rows] = await pool.execute(query, [currencyCode]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching currency: ${error.message}`);
        }
    }

    // Create or update currency
    static async upsert(data) {
        try {
            const query = `
        INSERT INTO currencies (currency_code, currency_name, series_id, is_active)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          currency_name = VALUES(currency_name),
          series_id = VALUES(series_id),
          is_active = VALUES(is_active),
          updated_at = CURRENT_TIMESTAMP
      `;

            const [result] = await pool.execute(query, [
                data.currency_code,
                data.currency_name,
                data.series_id,
                data.is_active !== undefined ? data.is_active : true,
            ]);

            return result;
        } catch (error) {
            throw new Error(`Error upserting currency: ${error.message}`);
        }
    }
}

module.exports = Currency;
