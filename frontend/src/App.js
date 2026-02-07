import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CurrencyGrid from './components/CurrencyGrid';
import { ratesService } from './services/api';
import './App.css';

function App() {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRates = useCallback(async () => {
        try {
            setError(null);
            const data = await ratesService.getLatestRates();

            // Handle both array and object responses
            const ratesData = data.data || data;

            if (Array.isArray(ratesData)) {
                setRates(ratesData);
                setLastUpdated(new Date());
            } else {
                throw new Error('Invalid data format received from API');
            }
        } catch (err) {
            console.error('Error fetching rates:', err);
            setError(err.response?.data?.error || err.message || 'Failed to load exchange rates');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRates();
    }, [fetchRates]);

    useEffect(() => {
        fetchRates();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchRates, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchRates]);

    return (
        <div className="App">
            <Header
                onRefresh={handleRefresh}
                lastUpdated={lastUpdated}
                refreshing={refreshing}
            />

            <main className="app-main">
                <CurrencyGrid
                    rates={rates}
                    loading={loading}
                    error={error}
                />
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <p>
                        Data provided by Banco de México (Banxico) •
                        Updated {rates.length > 0 && rates[0]?.date
                            ? new Date(rates[0].date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                            : 'regularly'
                        }
                    </p>
                    <p className="footer-disclaimer">
                        Exchange rates are for informational purposes only
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
