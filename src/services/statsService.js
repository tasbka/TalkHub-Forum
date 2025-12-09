// src/services/statsService.js
import simpleClient from '../api/simpleClient';

const statsService = {
  async getForumStats() {
    try {
      const response = await simpleClient.get('/stats/forum');
      // Проверяем все уровни вложенности
      const data = response?.data?.data || response?.data || response;
      
      return {
        totalUsers: data?.totalUsers || data?.total_users || 0,
        totalTopics: data?.totalTopics || data?.total_topics || 0,
        totalReplies: data?.totalReplies || data?.total_replies || 0,
        todayTopics: data?.todayTopics || data?.today_topics || 0,
        todayUsers: data?.todayUsers || data?.today_users || 0
      };
    } catch (error) {
      console.error('Error fetching forum stats:', error);
      return {
        totalUsers: 0,
        totalTopics: 0,
        totalReplies: 0,
        todayTopics: 0,
        todayUsers: 0
      };
    }
  },

  async getActiveUsers(count = 4) {
    try {
      const response = await simpleClient.get(`/stats/active-users?count=${count}`);
      
      // Проверяем все возможные структуры ответа
      const data = response?.data?.data || response?.data || response;
      
      // Убеждаемся, что это массив
      if (Array.isArray(data)) {
        return data.map(user => ({
          id: user?.id || Math.random().toString(36).substr(2, 9),
          username: user?.username || user?.userName || user?.name || 'Пользователь',
          role: user?.role || 'Участник',
          avatar: user?.avatar || '👤',
          postCount: user?.postCount || user?.post_count || user?.posts || 0,
          reputation: user?.reputation || user?.score || 0
        }));
      }
      
      // Если не массив, возвращаем пустой массив
      console.warn('Ответ не является массивом:', data);
      return [];
      
    } catch (error) {
      console.error('Error fetching active users:', error);
      // Возвращаем mock данные как fallback
      return [
        { 
          id: '1', 
          username: 'Админ Таисия С.', 
          role: 'Админ', 
          avatar: '👑',
          postCount: 42,
          reputation: 150
        },
        { 
          id: '2', 
          username: 'Александра К.', 
          role: 'Модератор', 
          avatar: '👩‍💻',
          postCount: 28,
          reputation: 98
        },
        { 
          id: '3', 
          username: 'Иван М.', 
          role: 'Разработчик', 
          avatar: '👨‍💼',
          postCount: 35,
          reputation: 120
        },
        { 
          id: '4', 
          username: 'Мария С.', 
          role: 'Админ', 
          avatar: '🧑‍💻',
          postCount: 31,
          reputation: 110
        }
      ];
    }
  },

  async getCategoryStats() {
    try {
      const response = await simpleClient.get('/stats/categories');
      // Проверяем все уровни вложенности
      const data = response?.data?.data || response?.data || response;
      
      // Убеждаемся, что это массив
      if (Array.isArray(data)) {
        return data;
      }
      
      // Если не массив, возвращаем mock данные
      console.warn('Ответ категорий не является массивом:', data);
      return [
        { name: 'API Docs', topicCount: 45, description: 'Обсуждения web API' },
        { name: 'Обсуждения', topicCount: 23, description: 'Общие обсуждения' },
        { name: 'Вопросы', topicCount: 67, description: 'Задавайте вопросы' },
        { name: 'Идеи', topicCount: 12, description: 'Предложения и идеи' }
      ];
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return [
        { name: 'API Docs', topicCount: 45, description: 'Обсуждения web API' },
        { name: 'Обсуждения', topicCount: 23, description: 'Общие обсуждения' },
        { name: 'Вопросы', topicCount: 67, description: 'Задавайте вопросы' },
        { name: 'Идеи', topicCount: 12, description: 'Предложения и идеи' }
      ];
    }
  }
};

export default statsService;