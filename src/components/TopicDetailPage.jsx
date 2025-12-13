// src/components/TopicDetailPage.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Pin, Eye, MessageSquare, AlertCircle } from 'lucide-react';
import { Comment } from './Comment';
import { ForumHeader } from './ForumHeader';
import commentService from '../services/commentService';

export function TopicDetailPage({ topic, onBack, onAddComment, onLogout, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [authError, setAuthError] = useState('');
  
  useEffect(() => {
    loadComments();
  }, [topic.id]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getCommentsByNote(topic.id);
      console.log('Загруженные комментарии:', commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCheck = () => {
    if (!currentUser) {
      setAuthError('Для этого действия необходимо войти в аккаунт');
      return false;
    }
    setAuthError('');
    return true;
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!currentUser) { // Проверяем currentUser из пропсов
      setAuthError('Для этого действия необходимо войти в аккаунт');
      return;
    }

    console.log('Текущий пользователь:', currentUser);
    console.log('ID пользователя:', currentUser?.id);
    console.log('Имя пользователя:', currentUser?.username);


    try {
      const commentData = {
        noteId: topic.id,
        authorId: currentUser.id,
        authorName: currentUser.username,
        authorAvatar: currentUser.avatar || '👤',
        content: newComment.trim(),
        parentCommentId: null
      };

       console.log('Отправляемые данные комментария:', commentData);
      const createdComment = await commentService.createComment(commentData);
      
      //новый комментарий в список
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
      
      // счетчик комментариев в родительском компоненте
      if (onAddComment) {
        onAddComment(createdComment);
      }
      
    } catch (error) {
      console.error('Ошибка создания комментария:', error);
      alert('Не удалось отправить комментарий: ' + (error.message || error));
    }
  };

  const handleSubmitReply = async (parentComment) => {
    if (!replyContent.trim()) return;
    
    if (!handleAuthCheck()) return;

    try {
      const replyData = {
        noteId: topic.id,
        authorId: currentUser.id,
        authorName: currentUser.username,
        authorAvatar: currentUser.avatar || '👤',
        content: replyContent.trim(),
        parentCommentId: parentComment.id
      };

      const reply = await commentService.createComment(replyData);
      await loadComments();
      setReplyingTo(null);
      setReplyContent('');
      
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
    }
  };

  const handleReply = (comment) => {
    if (!currentUser) {
      setAuthError('Для ответа на комментарий необходимо войти в аккаунт');
      return;
    }
    setAuthError('');
    setReplyingTo(comment);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;
    
    if (!currentUser) {
      setAuthError('Для удаления комментария необходимо войти в аккаунт');
      return;
    }
    
    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleNavigateToAuth = () => {

    setAuthError('Пожалуйста, войдите в систему для выполнения этого действия');

  };

  // Функция для отображения вложенных комментариев
  const renderComments = (commentList, level = 0) => {
    return commentList.map(comment => {
      const isCurrentUserAuthor = currentUser && currentUser.id === comment.authorId;
      
      return (
        <div key={comment.id} className={level > 0 ? 'ml-8 mt-2 border-l-2 border-purple-100 pl-4' : ''}>
          <Comment
            author={comment.authorName}
            content={comment.content}
            timestamp={formatTime(comment.createdAt)}
            avatar={comment.authorAvatar}
            isAuthor={isCurrentUserAuthor}
            onReply={() => handleReply(comment)}
            onDelete={isCurrentUserAuthor ? () => handleDeleteComment(comment.id) : null}
          />
          
          {}
          {replyingTo?.id === comment.id && (
            <div className="ml-8 mt-2 bg-purple-50 rounded-lg p-4">
              <textarea
                placeholder={`Ответить ${comment.authorName}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-purple-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmitReply(comment)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Отправить ответ
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setAuthError('');
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
          
          {}
          {comment.replies && comment.replies.length > 0 && (
            renderComments(comment.replies, level + 1)
          )}
        </div>
      );
    });
  };

  // Форматирование времени
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} минут назад`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} часов назад`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <ForumHeader onLogout={onLogout} currentUser={currentUser} /> {/* Передаем currentUser */}
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-purple-600">Загрузка комментариев...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <ForumHeader onLogout={onLogout} currentUser={currentUser} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center mb-6 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Вернуться к темам
        </button>

        {/* Заголовок темы */}
        <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-400 flex items-center justify-center shadow-md ring-2 ring-white">
                <span className="text-xl">{topic.avatar || '👤'}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-3">
                {topic.isPinned && (
                  <Pin className="h-5 w-5 text-pink-500 flex-shrink-0 mt-1" fill="currentColor" />
                )}
                <h1 className="flex-1 text-gray-800 text-xl font-semibold">{topic.title}</h1>
              </div>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-sm text-gray-600">
                  Автор: <span className="text-gray-800 font-medium">{topic.author}</span>
                </span>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">{topic.timestamp}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 rounded-full text-sm border border-purple-300 shadow-sm">
                  {topic.category}
                </span>
                {topic.isSolved && (
                  <span className="px-3 py-1 bg-gradient-to-r from-green-200 to-emerald-200 text-green-700 rounded-full text-sm border border-green-300 shadow-sm">
                    ✓ Решено
                  </span>
                )}
              </div>
            </div>
          </div>

          {topic.content && (
            <div className="mt-4 pt-4 border-t-2 border-purple-100">
              <p className="text-gray-700 whitespace-pre-wrap">{topic.content}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t-2 border-purple-100 flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{/*topic.views*/} {/*  просмотров*/}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span>{comments.length} {/*  комментариев*/}</span>
            </div>
          </div>
        </div>

        {authError && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{authError}</span>
              <button
                onClick={handleNavigateToAuth}
                className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Войти
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-purple-700 font-semibold mb-4">
            Комментарии ({comments.length})
          </h2>
          
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white/50 rounded-xl border-2 border-dashed border-purple-200">
              <MessageSquare className="h-12 w-12 text-purple-300 mx-auto mb-3" />
              <p>Пока нет комментариев. Будьте первым!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderComments(comments)}
            </div>
          )}
        </div>

        {currentUser ? (
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <h3 className="text-gray-800 font-medium mb-4">
              Добавить комментарий (вы вошли как {currentUser.username})
            </h3>
            <form onSubmit={handleSubmitComment}>
              <textarea
                placeholder="Напишите ваш комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl resize-y mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5 mr-2" strokeWidth={2.5} />
                  Отправить комментарий
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Только для авторизованных пользователей
              </h3>
              <p className="text-gray-600 mb-4">
                Чтобы оставлять комментарии, необходимо войти в аккаунт
              </p>
              <button
                onClick={handleNavigateToAuth}
                className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Войти в аккаунт
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}