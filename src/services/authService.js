import apiClient from '../api/client';

const authService = {
    register: async (userData) => {
        try {
            const response = await apiClient.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/users/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default authService;