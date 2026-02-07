const { pool } = require('../config/database');

class ExchangeRate {
    // Get all exchange rates with optional filters
    static async findAll(filters = {}) {
        try {
            let query = `
        SELECT 
          er.*,
          c.currency_name,
          c.currency_code
        FROM exchange_rates er
        LEFT JOIN currencies c ON er.series_id = c.series_id
      `;
            const params = [];

            if (filters.currencyCode) {
                query += ' AND er.currency_code = ?';
                params.push(filters.currencyCode);
            }

            if (filters.startDate) {
                query += ' AND er.date >= ?';
                params.push(filters.startDate);
            }

            if (filters.endDate) {
                query += ' AND er.date <= ?';
                params.push(filters.endDate);
            }

            query += ' ORDER BY er.date DESC';

            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(parseInt(filters.limit));
            }
            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching exchange rates: ${error.message}`);
        }
    }

    // Get latest exchange rates for all currencies
    static async findLatest() {
        try {
            const query = `
        SELECT 
          er.*,
          c.currency_name,
          c.currency_code
        FROM exchange_rates er
        INNER JOIN (
          SELECT currency_code, MAX(date) as max_date
          FROM exchange_rates
          GROUP BY currency_code
        ) latest ON er.currency_code = latest.currency_code AND er.date = latest.max_date
        LEFT JOIN currencies c ON er.series_id = c.series_id
        ORDER BY er.currency_code
      `;

            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching latest exchange rates: ${error.message}`);
        }
    }

    // Create or update exchange rate
    static async upsert(data) {
        try {
            const query = `
        INSERT INTO exchange_rates (series_id, currency_code, exchange_rate, date)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          exchange_rate = VALUES(exchange_rate),
          updated_at = CURRENT_TIMESTAMP
      `;

            const [result] = await pool.execute(query, [
                data.series_id,
                data.currency_code,
                data.exchange_rate,
                data.date,
            ]);

            return result;
        } catch (error) {
            throw new Error(`Error upserting exchange rate: ${error.message}`);
        }
    }

    // Bulk insert exchange rates
    static async bulkUpsert(dataArray) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const data of dataArray) {
                const query = `
          INSERT INTO exchange_rates (series_id, currency_code, exchange_rate, date)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            exchange_rate = VALUES(exchange_rate),
            updated_at = CURRENT_TIMESTAMP
        `;

                await connection.execute(query, [
                    data.series_id,
                    data.currency_code,
                    data.exchange_rate,
                    data.date,
                ]);
            }

            await connection.commit();
            return { inserted: dataArray.length };
        } catch (error) {
            await connection.rollback();
            throw new Error(`Error bulk upserting exchange rates: ${error.message}`);
        } finally {
            connection.release();
        }
    }
}

module.exports = ExchangeRate;
