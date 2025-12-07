import simpleClient from '../api/simpleClient';

const statsService = {
  async getForumStats() {
    try {
      const response = await simpleClient.get('/stats/forum');
      return response.data.data;
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
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [
        { username: 'Админ Таисия С.', role: 'Админ', avatar: '👑' },
        { username: 'Александра К.', role: 'Модератор', avatar: '👩‍💻' },
        { username: 'Иван М.', role: 'Разработчик', avatar: '👨‍💼' },
        { username: 'Мария С.', role: 'Админ', avatar: '🧑‍💻' }
      ];
    }
  },

  async getCategoryStats() {
    try {
      const response = await simpleClient.get('/stats/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return [
        { name: 'API Docs', topicCount: 45, description: 'Обсуждения web API и разработки' },
        { name: 'Обсуждения', topicCount: 23, description: 'Общие обсуждения' },
        { name: 'Вопросы', topicCount: 67, description: 'Задавайте вопросы' },
        { name: 'Идеи', topicCount: 12, description: 'Предложения и идеи' }
      ];
    }
  }
};

export default statsService;