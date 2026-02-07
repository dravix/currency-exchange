const { pool } = require('../config/database');

class SyncLog {
    // Create a new sync log entry
    static async create(data) {
        try {
            const query = `
        INSERT INTO sync_logs (sync_type, status, records_processed, error_message, started_at)
        VALUES (?, ?, ?, ?, NOW())
      `;

            const [result] = await pool.execute(query, [
                data.sync_type,
                data.status,
                data.records_processed || 0,
                data.error_message || null,
            ]);

            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating sync log: ${error.message}`);
        }
    }

    // Update sync log when completed
    static async complete(id, status, recordsProcessed, errorMessage = null) {
        try {
            const query = `
        UPDATE sync_logs
        SET status = ?, records_processed = ?, error_message = ?, completed_at = NOW()
        WHERE id = ?
      `;

            const [result] = await pool.execute(query, [
                status,
                recordsProcessed,
                errorMessage,
                id,
            ]);

            return result;
        } catch (error) {
            throw new Error(`Error updating sync log: ${error.message}`);
        }
    }

    // Get recent sync logs
    static async findRecent(limit = 10) {
        try {
            const query = `
        SELECT * FROM sync_logs
        ORDER BY started_at DESC
        LIMIT ?
      `;

            const [rows] = await pool.execute(query, [limit]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching sync logs: ${error.message}`);
        }
    }
}

module.exports = SyncLog;
