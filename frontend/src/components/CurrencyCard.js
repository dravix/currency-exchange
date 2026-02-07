import React from 'react';
import './CurrencyCard.css';

const CurrencyCard = ({ rate }) => {
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
        </div>
    );
};

export default CurrencyCard;
