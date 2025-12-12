import React, { useState, useEffect } from 'react';
import likeService from '../services/likeService';


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
    currentUserId
}) {

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем, лайкнул ли текущий пользователь тему
    useEffect(() => {
    if (currentUserId && id) {
      // Проверяем сервер
      checkIfLiked();
      
      // А также проверяем localStorage для мгновенного отображения
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
    
    // Обрабатываем оба формата
    if (response.success !== undefined) {
      // Новый формат
      if (response.success) {
        setIsLiked(response.data?.isLiked ?? false);
      }
    } else {
      // Старый формат
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
        
        // Сохраняем в localStorage для кеширования
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
   const handleCommentsClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    if (onCommentsClick) {
      onCommentsClick({ 
        id, title, author, category, views, timestamp, 
        isPinned, isSolved, avatar, replies 
      });
    }
  };

  const handleTopicClick = () => {
  }
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
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