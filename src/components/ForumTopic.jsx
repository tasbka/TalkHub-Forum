import React, { useState, useEffect } from 'react';
import likeService from '../services/likeService';
import noteService from '../services/noteService';

export function ForumTopic({
  id,
  title,
  author,
  category,
  replies,
  views,
  likes: initialLikes,
  timestamp,
  isPinned,
  isSolved,
  avatar,
  onCommentsClick,
  currentUserId,
  currentUserRole,
  onDeleteTopic,

}) {

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
 

 const isAdmin = currentUserRole === 'Admin' || currentUserRole === 'Moderator';
  
 // лайкнул ли текущий пользователь тему
    useEffect(() => {
    if (currentUserId && id) {
      checkIfLiked();
      
      const cachedLikeCount = localStorage.getItem(`topic_${id}_likes`);
      const cachedIsLiked = localStorage.getItem(`topic_${id}_user_${currentUserId}_liked`);
      
      if (cachedLikeCount) {
        setLikeCount(parseInt(cachedLikeCount));
      }
      if (cachedIsLiked) {
        setIsLiked(cachedIsLiked === 'true');
      }
    }
  }, [id, currentUserId]);

  const checkIfLiked = async () => {
  if (!currentUserId) return;
  
  try {
    const response = await likeService.checkIfLiked(id, currentUserId);
    
    if (response.success !== undefined) {
      if (response.success) {
        setIsLiked(response.data?.isLiked ?? false);
      }
    } else {
      setIsLiked(response.isLiked ?? false);
    }
  } catch (error) {
    console.error('Error checking like status:', error);
  }
};

const handleLikeToggle = async (e) => {
  e.stopPropagation();
  
  if (!currentUserId) {
    alert('Для оценки темы необходимо авторизоваться');
    return;
  }

  if (!id) {
    console.error('Note ID is missing');
    return;
  }

  setIsLoading(true);
  try {
    const response = await likeService.toggleLike(id, currentUserId);
    
    console.log('Full toggle response:', response);
    if (response.success !== undefined) {
      const isLikedNow = response.data.isLikedByCurrentUser;
        const newLikeCount = response.data.likeCount;
        
        setIsLiked(isLikedNow);
        setLikeCount(newLikeCount);
        
        localStorage.setItem(`topic_${id}_likes`, newLikeCount.toString());
        localStorage.setItem(`topic_${id}_user_${currentUserId}_liked`, isLikedNow.toString());
        
    } else {
      // Старый формат (прямой DTO)
      setIsLiked(response.isLikedByCurrentUser ?? response.IsLikedByCurrentUser ?? false);
      setLikeCount(response.likeCount ?? response.LikeCount ?? 0);
      console.log('Used old format response');
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    alert('Ошибка соединения с сервером');
  } finally {
    setIsLoading(false);
  }
};


 const handleDeleteTopic = async (e) => {
   e.stopPropagation();

    if (!window.confirm(`Вы уверены, что хотите удалить тему "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await noteService.deleteNote(id);
      
      if (response.success) {
        alert('Тема успешно удалена');
        if (onDeleteTopic) {
          onDeleteTopic(id);
        }
      } else {
        alert('Ошибка при удалении темы: ' + (response.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Ошибка при удалении темы: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

    const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleCommentsClick = (e) => {
    e.stopPropagation();
    if (onCommentsClick) {
      onCommentsClick({ 
        id, title, author, category, views, timestamp, 
        isPinned, isSolved, avatar, replies 
      });
    }
  };

 const handleTopicClick = (e) => {
     if (e.target.closest('.admin-controls')) {
      return;
     }
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border relative">
      {/* Кнопки для админов - ВНЕШНИЙ КОНТЕЙНЕР */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {/* Кнопка удаления */}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
              <button
                onClick={handleDeleteTopic}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
              >
                Отмена
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Удалить тему"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="text-2xl">{avatar}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isPinned && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                📌 Закреплено
              </span>
            )}
            {isSolved && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                ✅ Решено
              </span>
            )}
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
              {category}
            </span>
            {isAdmin && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                👑 Админ
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-foreground mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>👤 {author}</span>
              <span>🕒 {timestamp}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCommentsClick}
                className="flex items-center gap-1 hover:text-purple-700 transition-colors focus:outline-none"
                title="Перейти к комментариям"
              >
                <span className="text-lg">💬</span>
                <span>{replies}</span>
              </button>

              <button 
                onClick={handleLikeToggle}
                disabled={isLoading || !currentUserId}
                className={`flex items-center gap-1 transition-colors focus:outline-none ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'hover:text-red-400'
                } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={currentUserId ? "Оценить тему" : "Авторизуйтесь для оценки"}
              >
                <span className="text-lg">
                  {isLiked ? '❤️' : '🤍'}
                </span>
                <span>{likeCount}</span>
                {isLoading && <span className="ml-1 text-xs">...</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}