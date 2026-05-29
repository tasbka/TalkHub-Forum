import simpleClient from '../api/simpleClient';


const authService = {
    register: async (userData) => {
        try {
            const response = await simpleClient.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

updateUserPostCount: () => {
    const user = authService.getCurrentUser();
    if (user) {
        user.postCount = (user.postCount || 0) + 1;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
    return null;
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
                credentials: 'include'
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || `HTTP error ${response.status}`);
            }
            
            console.log('Login response data:', result.data);
            console.log('Role from backend:', result.data.role, typeof result.data.role);
            
            const userData = {
                id: result.data.id,
                username: result.data.username,
                email: result.data.email,
                role: result.data.role,  
                postCount: result.data.postCount || 0,
                commentCount: result.data.commentCount || 0,
                reputation: result.data.reputation || 0,
                experiencePoints: result.data.experiencePoints || 0,
                createdAt: result.data.createdAt,
                isActive: result.data.isActive ?? true

            };

            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Сохраненный пользователь:', userData);
            return result;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
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
            console.log('getCurrentUser - parsed user:', user);
            return user;
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
        return user?.username;
    },

    getCurrentUserRole: () => {
        const user = authService.getCurrentUser();
        console.log('getCurrentUserRole:', user?.role);
        return user?.role || 'Новичок';  
    },
    
    isAdmin: () => {
        const role = authService.getCurrentUserRole();
        return role === 'Администратор'; 
    },

    updateUserStats: (updates) => {
    const user = authService.getCurrentUser();
    if (user) {
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    }
    return null;
},

incrementPostCount: () => {
    const user = authService.getCurrentUser();
    if (user) {
        user.postCount = (user.postCount || 0) + 1;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
    return null;
}
};

export default authService;