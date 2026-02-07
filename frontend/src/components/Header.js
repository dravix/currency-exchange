import React from 'react';
import './Header.css';

const Header = ({ onRefresh, lastUpdated, refreshing }) => {
    const formatLastUpdated = (date) => {
        if (!date) return 'Never';

        const now = new Date();
        const updated = new Date(date);
        const diffMs = now - updated;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);

        if (diffSecs < 60) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

        return updated.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="app-title">
                        <span className="currency-icon">💱</span>
                        Currency Exchange
                    </h1>
                    <p className="app-subtitle">Real-time exchange rates from Banxico</p>
                </div>

                <div className="header-right">
                    <div className="last-updated">
                        <span className="update-label">Last updated:</span>
                        <span className="update-time">{formatLastUpdated(lastUpdated)}</span>
                    </div>

                    <button
                        className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
                        onClick={onRefresh}
                        disabled={refreshing}
                        aria-label="Refresh rates"
                    >
                        <svg
                            className="refresh-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span className="refresh-text">Refresh</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
