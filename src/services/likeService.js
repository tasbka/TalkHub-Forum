import simpleClient from '../api/simpleClient';

const likeService = {
  // Поставить лайк
  likeNote: async (noteId, userId) => {
    try {
      const response = await simpleClient.post(`/NoteLike/like`, {
        noteId,
        userId
      });
      return response;
    } catch (error) {
      console.error('Error liking note:', error);
      throw error;
    }
  },

  // Убрать лайк
  unlikeNote: async (noteId, userId) => {
    try {
      const response = await simpleClient.delete(`/NoteLike/unlike`, {
        noteId,
        userId
      });
      return response;
    } catch (error) {
      console.error('Error unliking note:', error);
      throw error;
    }
  },

  // Переключить лайк (основной метод)
toggleLike: async (noteId, userId) => {
  console.log(`Toggle like called: noteId=${noteId}, userId=${userId}`);
  
  try {
    const response = await simpleClient.post('/NoteLike/toggle', {
      noteId: noteId,
      userId: userId
    });
    
    console.log('Toggle like raw response:', response);
    
    // Добавим логирование для диагностики
    if (response.success !== undefined) {
      console.log('New format detected:', response.success);
    } else {
      console.log('Old format detected, has likeCount:', 'likeCount' in response);
    }
    
    return response;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
},

  // Получить количество лайков
  getLikeCount: async (noteId) => {
    try {
      const response = await simpleClient.get(`/NoteLike/${noteId}/count`);
      return response;
    } catch (error) {
      console.error('Error getting like count:', error);
      throw error;
    }
  },

  // Проверить, лайкнул ли пользователь
  checkIfLiked: async (noteId, userId) => {
    try {
      const response = await simpleClient.get(`/NoteLike/${noteId}/check?userId=${userId}`);
      return response;
    } catch (error) {
      console.error('Error checking like status:', error);
      throw error;
    }
  },
/*
  // Получить информацию о лайках
  getLikeInfo: async (noteId, userId = null) => {
    try {
      let url = `/NoteLike/${noteId}/info`;
      if (userId) {
        url += `?userId=${userId}`;
      }
      const response = await simpleClient.get(url);
      return response;
    } catch (error) {
      console.error('Error getting like info:', error);
      throw error;
    }
  },

  // Получить список пользователей, лайкнувших тему
  getLikedByUsers: async (noteId) => {
    try {
      const response = await simpleClient.get(`/NoteLike/${noteId}/users`);
      return response;
    } catch (error) {
      console.error('Error getting liked by users:', error);
      throw error;
    }
  }*/
};

export default likeService;