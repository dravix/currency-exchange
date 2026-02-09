const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/database');

/**
 * Initialize the database by executing schema.sql
 * @returns {Promise<Object>} Result of the initialization
 */
const initializeDatabase = async () => {
    const connection = await pool.getConnection();

    try {
        // Read the schema.sql file
        const schemaPath = path.join(__dirname, '../', 'db', 'schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');

        // Split into individual statements
        const statements = schemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        let executedStatements = 0;
        const results = [];

        // Execute each statement
        for (const statement of statements) {
            try {
                const [result] = await connection.query(statement);
                executedStatements++;
                results.push({
                    statement: statement.substring(0, 100) + '...',
                    success: true
                });
            } catch (error) {
                // Log but continue for some errors (like table already exists)
                if (error.code === 'ER_TABLE_EXISTS_ERROR' ||
                    error.code === 'ER_DUP_KEYNAME') {
                    results.push({
                        statement: statement.substring(0, 100) + '...',
                        success: true,
                        warning: error.message
                    });
                    executedStatements++;
                } else {
                    throw error;
                }
            }
        }

        return {
            success: true,
            message: 'Database initialized successfully',
            statementsExecuted: executedStatements,
            totalStatements: statements.length,
            details: results
        };

    } catch (error) {
        console.error('Database initialization error:', error);
        throw {
            success: false,
            message: 'Failed to initialize database',
            error: error.message,
            code: error.code
        };
    } finally {
        connection.release();
    }
};

/**
 * Check if database tables exist
 * @returns {Promise<Object>} Status of database tables
 */
const checkDatabaseStatus = async () => {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);

        // Check for required tables
        const requiredTables = ['currencies', 'exchange_rates', 'sync_logs'];
        const existingTables = requiredTables.filter(table =>
            tableNames.includes(table)
        );
        const missingTables = requiredTables.filter(table =>
            !tableNames.includes(table)
        );

        // Get row counts for existing tables
        const tableCounts = {};
        for (const table of existingTables) {
            const [result] = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
            tableCounts[table] = result[0].count;
        }

        return {
            initialized: missingTables.length === 0,
            totalTables: tableNames.length,
            requiredTables: {
                existing: existingTables,
                missing: missingTables
            },
            tableCounts,
            allTables: tableNames
        };
    } catch (error) {
        throw {
            success: false,
            message: 'Failed to check database status',
            error: error.message
        };
    }
};

/**
 * Reset the database (drop and recreate tables)
 * WARNING: This will delete all data!
 * @returns {Promise<Object>} Result of the reset
 */
const resetDatabase = async () => {
    const connection = await pool.getConnection();

    try {
        // Drop tables in reverse order to respect foreign keys
        const tables = ['sync_logs', 'exchange_rates', 'currencies'];

        for (const table of tables) {
            try {
                await connection.query(`DROP TABLE IF EXISTS ${table}`);
            } catch (error) {
                console.error(`Error dropping table ${table}:`, error.message);
            }
        }

        // Now initialize with fresh schema
        const initResult = await initializeDatabase();

        return {
            success: true,
            message: 'Database reset and reinitialized successfully',
            ...initResult
        };

    } catch (error) {
        throw {
            success: false,
            message: 'Failed to reset database',
            error: error.message
        };
    } finally {
        connection.release();
    }
};

module.exports = {
    initializeDatabase,
    checkDatabaseStatus,
    resetDatabase
};
