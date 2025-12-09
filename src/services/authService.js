import simpleClient from '../api/simpleClient';

const authService = {
    register: async (userData) => {
        try {
            const response = await simpleClient.post('/users/register', userData);
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

   login: async (credentials) => {
        try {
            const response = await simpleClient.post('/users/login', credentials);
            localStorage.setItem('user', JSON.stringify(response.data.data));
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
        if (!userStr) return null;
        
        try {
            const user = JSON.parse(userStr);

            if (user.id) {
                return user;
            } else if (user.userId) {
                return { ...user, id: user.userId };
            } else if (user.user && user.user.id) {
                return user.user;
            } else if (user.data && user.data.id) {
                return user.data;
            }
            
            console.warn('Не удалось найти id пользователя:', user);
            return null;
        } catch (e) {
            console.error('Ошибка парсинга пользователя:', e);
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    },

        getCurrentUserId: () => {
        const user = authService.getCurrentUser();
        return user?.id;
    },

    getCurrentUsername: () => {
        const user = authService.getCurrentUser();
        return user?.username || user?.userName || user?.name;
    }
};

export default authService;