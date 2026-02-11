import React from 'react';
import './CurrencyCard.css';

const CurrencyCard = ({ rate, onViewHistory }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatRate = (rate) => {
        return parseFloat(rate).toFixed(6);
    };

    // Get currency symbol or code
    const getCurrencySymbol = (code) => {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
            CAD: 'C$',
            CHF: 'Fr',
        };
        return symbols[code] || code;
    };

    return (
        <div className="currency-card">
            <div className="currency-card-header">
                <div className="currency-symbol">
                    {getCurrencySymbol(rate.currency_code)}
                </div>
                <div className="currency-code">{rate.currency_code}</div>
            </div>

            <div className="currency-card-body">
                <div className="exchange-rate">
                    <span className="rate-label">MXN</span>
                    <span className="rate-value">{formatRate(rate.exchange_rate)}</span>
                </div>

                <div className="currency-name">{rate.currency_name || rate.currency_code}</div>
            </div>

            <div className="currency-card-footer">
                <div className="update-time">
                    <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(rate.updated_at)}</span>
                </div>
                <div className="rate-date">
                    Data: {new Date(rate.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <button 
                className="view-history-btn"
                onClick={() => onViewHistory(rate.currency_code, rate.currency_name)}
                title="View historical data"
            >
                <svg className="chart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View History
            </button>
        </div>
    );
};

export default CurrencyCard;
