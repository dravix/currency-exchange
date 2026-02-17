import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ratesService } from '../services/api';
import './HistoricalChart.css';

const HistoricalChart = ({ currencyCode, currencyName, onBack }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [daysAgo, setDaysAgo] = useState(30);

    useEffect(() => {
        fetchHistoricalData();
    }, [currencyCode, daysAgo]);

    const fetchHistoricalData = async () => {
        try {
            setLoading(true);
            setError(null);

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);

            const params = {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            };

            const response = await ratesService.getCurrencyRates(currencyCode, params);
            const ratesData = response.data || response;

            if (Array.isArray(ratesData)) {
                // Transform data for recharts
                const chartData = ratesData
                    .map(rate => ({
                        date: new Date(rate.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        }),
                        fullDate: rate.date,
                        rate: parseFloat(rate.exchange_rate),
                        currency: rate.currency_code,
                    }))
                    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

                setData(chartData);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            console.error('Error fetching historical data:', err);
            setError(err.response?.data?.error || err.message || 'Failed to load historical data');
        } finally {
            setLoading(false);
        }
    };

    const handleDaysChange = (days) => {
        setDaysAgo(days);
    };

    const getMinMax = () => {
        if (data.length === 0) return { min: 0, max: 0 };
        const rates = data.map(d => d.rate);
        const min = Math.min(...rates);
        const max = Math.max(...rates);
        const padding = (max - min) * 0.1;
        return {
            min: (min - padding).toFixed(4),
            max: (max + padding).toFixed(4),
        };
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-date">{payload[0].payload.fullDate}</p>
                    <p className="tooltip-rate">
                        Rate: <strong>{payload[0].value.toFixed(6)} MXN</strong>
                    </p>
                </div>
            );
        }
        return null;
    };

    const { min, max } = getMinMax();

    return (
        <div className="historical-chart">
            <div className="chart-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Dashboard
                </button>
                <div className="chart-title">
                    <h2>{currencyName} ({currencyCode}) Historical Rates</h2>
                    <p className="chart-subtitle">Exchange rate vs Mexican Peso (MXN)</p>
                </div>
            </div>

            <div className="chart-controls">
                <div className="time-range-buttons">
                    <button
                        className={daysAgo === 7 ? 'active' : ''}
                        onClick={() => handleDaysChange(7)}
                    >
                        7 Days
                    </button>
                    <button
                        className={daysAgo === 30 ? 'active' : ''}
                        onClick={() => handleDaysChange(30)}
                    >
                        30 Days
                    </button>
                    <button
                        className={daysAgo === 90 ? 'active' : ''}
                        onClick={() => handleDaysChange(90)}
                    >
                        90 Days
                    </button>
                    <button
                        className={daysAgo === 180 ? 'active' : ''}
                        onClick={() => handleDaysChange(180)}
                    >
                        6 Months
                    </button>
                    <button
                        className={daysAgo === 365 ? 'active' : ''}
                        onClick={() => handleDaysChange(365)}
                    >
                        1 Year
                    </button>
                </div>

                <div className="custom-range">
                    <label htmlFor="custom-days">Custom days: </label>
                    <input
                        id="custom-days"
                        type="number"
                        min="1"
                        max="730"
                        value={daysAgo}
                        onChange={(e) => handleDaysChange(parseInt(e.target.value) || 30)}
                    />
                </div>
            </div>

            {loading && (
                <div className="chart-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading historical data...</p>
                </div>
            )}

            {error && (
                <div className="chart-error">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {!loading && !error && data.length === 0 && (
                <div className="chart-empty">
                    <p>No historical data available for this currency.</p>
                </div>
            )}

            {!loading && !error && data.length > 0 && (
                <div className="chart-container">
                    <div className="chart-stats">
                        <div className="stat">
                            <span className="stat-label">Latest Rate:</span>
                            <span className="stat-value">
                                {data[data.length - 1]?.rate.toFixed(6)} MXN
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Highest:</span>
                            <span className="stat-value">
                                {Math.max(...data.map(d => d.rate)).toFixed(6)} MXN
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Lowest:</span>
                            <span className="stat-value">
                                {Math.min(...data.map(d => d.rate)).toFixed(6)} MXN
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Data Points:</span>
                            <span className="stat-value">{data.length}</span>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={400} >
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="date"
                                stroke="#666"
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#666"
                                tick={{ fontSize: 12 }}
                                domain={[min, max]}
                                tickFormatter={(value) => value.toFixed(4)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#001ac4"
                                strokeWidth={2}
                                dot={{ fill: '#66eaba', r: 3 }}
                                activeDot={{ r: 6 }}
                                name="Exchange Rate (MXN)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="chart-footer">
                        <p style={{ fontWeight: 'bold' }}>Average rate [{data.length} days]: {(data.reduce((acc, d) => acc + d.rate, 0) / data.length).toFixed(6)} MXN</p>
                        <p>Data source: Banxico API | Last updated: {data[data.length - 1]?.fullDate}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoricalChart;
