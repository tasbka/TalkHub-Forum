import simpleClient from '../api/simpleClient';

const authService = {
    register: async (userData) => {
        try {
            const response = await simpleClient.post('/users/register', userData);
           localStorage.setItem('user', JSON.stringify(response.data.data || response.data));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

   login: async (credentials) => {
        try {
              const response = await fetch('http://localhost:5234/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include' // ВАЖНО: для отправки cookies
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || `HTTP error ${response.status}`);
            }
            
            localStorage.setItem('user', JSON.stringify(result.data));
            return result;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            // Также с credentials для logout
            await fetch('http://localhost:5234/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } finally {
            localStorage.removeItem('user');
        }
    },
    
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        try {
            const user = JSON.parse(userStr);

            let userData = {};

            if (user.id) {
                return user;
            } else if (user.userId) {
                return { ...user, id: user.userId };
            } else if (user.user && user.user.id) {
                return user.user;
            } else if (user.data && user.data.id) {
                return user.data;
            }

               if (!userData.role) {
                userData.role = 'Novice'; // Значение по умолчанию
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
    },

       getCurrentUserRole: () => {
        const user = authService.getCurrentUser();
        return user?.role || 'Novice';
    }
};

export default authService;