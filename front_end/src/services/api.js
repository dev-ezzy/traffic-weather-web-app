// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000'; // Adjust if running on a different port

export const getDashboardData = () => axios.get(`${BASE_URL}/dashboard`);
export const getPrediction = (params) => axios.post(`${BASE_URL}/predict`, params);

// Get historical weather
export const fetchWeatherHistory = (startDate, endDate) =>
    axios.get(`${BASE_URL}/weather-history`, { params: { startDate, endDate } });

  // Get historical traffic
export const fetchTrafficHistory = (startDate, endDate) =>
    axios.get(`${BASE_URL}/traffic-history`, { params: { startDate, endDate } });

