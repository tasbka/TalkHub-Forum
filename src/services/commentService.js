import simpleClient from '../api/simpleClient';

const commentService = {
  // Получить комментарии темы
  async getCommentsByNote(noteId) {
    const response = await simpleClient.get(`/comments/note/${noteId}`);
    return response.data.data;
  },
  
  // Создать комментарий
  async createComment(commentData) {
    const response = await simpleClient.post('/comments', commentData);
    return response.data.data;
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
    const response = await simpleClient.put(`/comments/${commentId}`, { content });
    return response.data.data;
  },
  
  // Удалить комментарий
  async deleteComment(commentId) {
    const response = await simpleClient.delete(`/comments/${commentId}`);
    return response.data.success;
  },
  
  // Получить ответы на комментарий
  async getReplies(commentId) {
    const response = await simpleClient.get(`/comments/${commentId}/replies`);
    return response.data.data;
  }
};

export default commentService;