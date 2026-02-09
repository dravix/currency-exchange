-- Currency Exchange Database Schema

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS currency_exchange CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE currency_exchange;

-- Table for storing currency exchange rates
CREATE TABLE IF NOT EXISTS exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    series_id VARCHAR(50) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    exchange_rate DECIMAL(15, 6) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_series_date (series_id, date),
    INDEX idx_currency_code (currency_code),
    INDEX idx_date (date),
    INDEX idx_series_id (series_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing API sync logs
CREATE TABLE IF NOT EXISTS sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,
    status ENUM('success', 'failed', 'partial') NOT NULL,
    records_processed INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX idx_sync_type (sync_type),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing currency metadata
CREATE TABLE IF NOT EXISTS currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL UNIQUE,
    currency_name VARCHAR(100) NOT NULL,
    series_id VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_currency_code (currency_code),
    INDEX idx_series_id (series_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default currencies (common exchange rates from Banxico)
INSERT INTO currencies (currency_code, currency_name, series_id) VALUES
('USD', 'US Dollar', 'SF343410'),
('EUR', 'Euro', 'SF346079'),
('GBP', 'British Pound', 'SF346042'),
('JPY', 'Japanese Yen', 'SF346053'),
('CAD', 'Canadian Dollar', 'SF346025')
ON DUPLICATE KEY UPDATE 
    currency_name = VALUES(currency_name),
    series_id = VALUES(series_id);
