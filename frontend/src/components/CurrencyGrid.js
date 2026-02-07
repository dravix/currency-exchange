import React from 'react';
import CurrencyCard from './CurrencyCard';
import './CurrencyGrid.css';

const CurrencyGrid = ({ rates, loading, error }) => {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading exchange rates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Error Loading Data</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!rates || rates.length === 0) {
        return (
            <div className="empty-container">
                <div className="empty-icon">📊</div>
                <h3>No Exchange Rates Available</h3>
                <p>Please check back later or contact support.</p>
            </div>
        );
    }

    return (
        <div className="currency-grid">
            {rates.map((rate) => (
                <CurrencyCard key={rate.id} rate={rate} />
            ))}
        </div>
    );
};

export default CurrencyGrid;
