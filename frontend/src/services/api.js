import axios from 'axios';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const currencyService = {
    /**
     * Get all active currencies
     */
    getAllCurrencies: async () => {
        const response = await api.get('/currencies');
        return response.data;
    },

    /**
     * Get specific currency by code
     */
    getCurrency: async (currencyCode) => {
        const response = await api.get(`/currencies/${currencyCode}`);
        return response.data;
    },
};

export const ratesService = {
    /**
     * Get latest exchange rates for all currencies
     */
    getLatestRates: async () => {
        const response = await api.get('/rates/latest');
        return response.data;
    },

    /**
     * Get all exchange rates with optional filters
     */
    getAllRates: async (params = {}) => {
        const response = await api.get('/rates', { params });
        return response.data;
    },

    /**
     * Get historical rates for a specific currency
     */
    getCurrencyRates: async (currencyCode, params = {}) => {
        const response = await api.get(`/rates/${currencyCode}`, { params });
        return response.data;
    },
};

export const healthService = {
    /**
     * Check API health status
     */
    checkHealth: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

export default api;
