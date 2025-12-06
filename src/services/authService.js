import simpleClient from '../api/simpleClient';

const authService = {
    register: async (userData) => {
        try {
            const response = await simpleClient.post('/users/register', userData);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

   login: async (credentials) => {
        try {
            const response = await simpleClient.post('/users/login', credentials);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    }
};

export default authService;