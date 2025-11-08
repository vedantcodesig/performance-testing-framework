import axios from 'axios';

// Use absolute URL for development
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Please start the backend server on port 5000.');
    }
    
    return Promise.reject(error);
  }
);

// Dashboard endpoints
export const getDashboardStats = () => api.get('/dashboard/stats');

// Performance testing endpoints
export const getPerformanceTests = () => api.get('/performance/tests');
export const startPerformanceTest = (config) => api.post('/performance/start', config);
export const stopPerformanceTest = () => api.post('/performance/stop');
export const getTestResults = (testId) => api.get(`/performance/results/${testId}`);

// Test prioritization endpoints
export const getPrioritizationData = () => api.get('/prioritization/data');
export const getTestPlan = () => api.get('/prioritization/test-plan');

// Resource optimization endpoints
export const getOptimizationData = () => api.get('/optimization/data');

// Pipeline endpoints
export const getPipelineStatus = () => api.get('/pipeline/status');

// Health check
export const healthCheck = () => api.get('/health');

export default api;