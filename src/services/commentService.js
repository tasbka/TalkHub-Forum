// src/services/commentService.js
import simpleClient from '../api/simpleClient';

const commentService = {
  // Получить комментарии темы
  async getCommentsByNote(noteId) {
    const result = await simpleClient.get(`/comments/note/${noteId}`);
    return result.data; // Возвращаем data из ответа
  },
  
  // Создать комментарий
  async createComment(commentData) {
    const result = await simpleClient.post('/comments', commentData);
    return result.data; 
  },
  
  // Ответить на комментарий
  async replyToComment(parentCommentId, noteId, authorId, content) {
    return this.createComment({
      noteId,
      authorId,
      content,
      parentCommentId
    });
  },
  
  // Обновить комментарий
  async updateComment(commentId, content) {
    const result = await simpleClient.put(`/comments/${commentId}`, { content });
    return result.data;
  },
  
  // Удалить комментарий
 deleteComment: async (commentId) => {
  try {
    const response = await simpleClient.delete(`/comments/${commentId}`);
    return response;
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    throw error;
  }
},
  
  // Получить ответы на комментарий
  async getReplies(commentId) {
    const result = await simpleClient.get(`/comments/${commentId}/replies`);
    return result.data;
  }
};

export default commentService;