import React, { useState, useEffect, useRef } from 'react';
import { Pin, Trash2, Edit, Star, MessageSquare, Eye, ThumbsUp, HelpCircle, EyeOff, RefreshCw } from 'lucide-react';
import likeService from '../services/likeService';
import noteService from '../services/noteService';

export function ForumTopic({ 
     id, 
    title, 
    content,
    category, 
    section,
    sectionId,  
    type,
    author, 
    authorId,
    replies, 
    views, 
    likes: initialLikes, 
    timestamp, 
    isPinned, 
    isSolved, 
    avatar,
    currentUserId,
    currentUserRole,
    status,  
    onDeleteTopic,
    onTogglePin,
    onEditTopic,
    onHideTopic,    
    onRestoreTopic, 
    onCommentsClick,
    onAuthorClick,
    onShowAuth
}) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isHidden, setIsHidden] = useState(status === 2 || status === 'Hidden');

    const isProcessingRef = useRef(false);
    const hideProcessingRef = useRef(false);
    const restoreProcessingRef = useRef(false);
    
    const isAuthor = currentUserId === authorId;
    const isAdmin = currentUserRole === 'Admin' || 
                    currentUserRole === 'Администратор' || 
                    currentUserRole === 22 ||
                    currentUserRole === '22';
    const canModerate = isAdmin || isAuthor;

    // Получение цвета для объединенного тега (секция + категория)
    const getCombinedTagColor = (sectionName) => {
        switch(sectionName) {
            case 'C++': return 'from-blue-600 to-cyan-600';
            case 'C#': return 'from-purple-600 to-violet-600';
            case 'Web': return 'from-pink-600 to-rose-600';
            default: return 'from-purple-600 to-pink-600';
        }
    };

    useEffect(() => {
        setIsHidden(status === 2 || status === 'Hidden');
    }, [status]);

    useEffect(() => {
        if (currentUserId && id) {
            checkIfLiked();
            const cachedLikeCount = localStorage.getItem(`topic_${id}_likes`);
            const cachedIsLiked = localStorage.getItem(`topic_${id}_user_${currentUserId}_liked`);
            if (cachedLikeCount) setLikeCount(parseInt(cachedLikeCount));
            if (cachedIsLiked) setIsLiked(cachedIsLiked === 'true');
        }
    }, [id, currentUserId]);

    const checkIfLiked = async () => {
        if (!currentUserId) return;
        try {
            const response = await likeService.checkIfLiked(id, currentUserId);
            if (response.success !== undefined) {
                setIsLiked(response.data?.isLiked ?? false);
            } else {
                setIsLiked(response.isLiked ?? false);
            }
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const handleCardClick = () => {
        onCommentsClick?.({ 
            id, title, author, category, views, timestamp, 
            isPinned, isSolved, avatar, replies 
        });
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        if (onAuthorClick) onAuthorClick(author, authorId); 
    };

    const handleTogglePin = (e) => {
        e.stopPropagation();
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        onTogglePin?.(id, isPinned);
        setTimeout(() => { isProcessingRef.current = false; }, 500);
    };
    
    const handleEdit = (e) => {
        e.stopPropagation();
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        onEditTopic?.({
            id,
            title,
            content,
            sectionId: sectionId,
            categoryType: category 
        });
        setTimeout(() => { isProcessingRef.current = false; }, 500);
    };

    const handleHide = async (e) => {
        e.stopPropagation();
        
        if (hideProcessingRef.current) return;
        hideProcessingRef.current = true;
        
        try {
            const response = await noteService.hideNote(id);
            if (response.success) {
                setIsHidden(true);
                if (onHideTopic) onHideTopic(id);
            }
        } catch (error) {
            console.error('Ошибка скрытия темы:', error);
            if (error.message === 'Тема уже скрыта') {
                setIsHidden(true);
                if (onHideTopic) onHideTopic(id);
            }
        } finally {
            setTimeout(() => { hideProcessingRef.current = false; }, 1000);
        }
    };

    const handleRestore = async (e) => {
        e.stopPropagation();
        
        if (restoreProcessingRef.current) return;
        restoreProcessingRef.current = true;
        
        try {
            const response = await noteService.restoreNote(id);
            if (response.success) {
                setIsHidden(false);
                if (onRestoreTopic) onRestoreTopic(id);
            }
        } catch (error) {
            console.error('Ошибка восстановления темы:', error);
        } finally {
            setTimeout(() => { restoreProcessingRef.current = false; }, 1000);
        }
    };

    const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!currentUserId) {
        if (onShowAuth) onShowAuth();
        return;
    }
    if (currentUserId?.isActive === false) {
    alert('Ваш аккаунт заблокирован. Вы не можете ставить лайки.');
    return;
  }
    if (!currentUserId) {
        alert('Для оценки темы необходимо авторизоваться');
        return;
    }

    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setIsLoading(true);
    try {
        const response = await likeService.toggleLike(id, currentUserId);
        if (response.success !== undefined) {
            const isLikedNow = response.data?.isLikedByCurrentUser ?? response.isLikedByCurrentUser;
            const newLikeCount = response.data?.likeCount ?? response.likeCount;
            setIsLiked(isLikedNow);
            setLikeCount(newLikeCount);
            localStorage.setItem(`topic_${id}_likes`, newLikeCount.toString());
            localStorage.setItem(`topic_${id}_user_${currentUserId}_liked`, isLikedNow.toString());
        } else {
            setIsLiked(response.isLikedByCurrentUser ?? false);
            setLikeCount(response.likeCount ?? 0);
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        // Проверяем сообщение об ошибке
        if (error.message?.includes('Нельзя лайкать свой собственный пост')) {
            alert('Вы не можете оценивать свою собственную тему');
        } else {
            alert('Ошибка соединения с сервером');
        }
    } finally {
        setIsLoading(false);
        setTimeout(() => { isProcessingRef.current = false; }, 500);
    }
};

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (isProcessingRef.current) return;
        setShowDeleteConfirm(true);
    };

    const handleDeleteTopic = async (e) => {
        e.stopPropagation();
        
        if (isProcessingRef.current) return;
        
        if (!window.confirm(`Вы уверены, что хотите навсегда удалить тему "${title}"?`)) {
            setShowDeleteConfirm(false);
            return;
        }

        isProcessingRef.current = true;
        setIsDeleting(true);
        
        try {
            const response = await noteService.deleteNote(id);
            if (response.success) {
                alert('Тема успешно удалена');
                if (onDeleteTopic) onDeleteTopic(id);
            } else {
                alert('Ошибка при удалении темы: ' + (response.message || 'Неизвестная ошибка'));
            }
        } catch (error) {
            console.error('Error deleting topic:', error);
            alert('Ошибка при удалении темы: ' + (error.message || 'Неизвестная ошибка'));
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setTimeout(() => { isProcessingRef.current = false; }, 1000);
        }
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    const handleCommentsClick = (e) => {
        e.stopPropagation();
         if (!currentUserId) {
        if (onShowAuth) onShowAuth();
        return;
    }
        handleCardClick();
    };

    // Возвращаем правильный тип (из category)
    const getCategoryType = () => {
        if (category === 'Вопрос' || category === 'Вопросы') return 'Вопрос';
        if (category === 'Обсуждение' || category === 'Обсуждения') return 'Обсуждение';
        return 'Тема';
    };

    return (
        <div className={`bg-white/80 rounded-xl p-5 border-2 transition-all relative ${
            isHidden ? 'border-gray-300 opacity-60 bg-gray-50' : 'border-purple-200 hover:shadow-xl hover:border-purple-400'
        }`}>
            {/* Кнопки для админа и автора */}
            {canModerate && (
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                    {showDeleteConfirm ? (
                        <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
                            <button
                                onClick={handleDeleteTopic}
                                disabled={isDeleting}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isDeleting ? 'Удаление...' : 'Удалить навсегда'}
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                            >
                                Отмена
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-1">
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={handleTogglePin}
                                        className={`p-1.5 rounded-full transition-colors ${
                                            isPinned 
                                                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                                                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                                        }`}
                                        title={isPinned ? 'Открепить' : 'Закрепить'}
                                    >
                                        <Pin className="h-4 w-4" />
                                    </button>
                                    
                                    {isHidden ? (
                                        <button
                                            onClick={handleRestore}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                            title="Восстановить тему"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleHide}
                                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                            title="Скрыть тему"
                                        >
                                            <EyeOff className="h-4 w-4" />
                                        </button>
                                    )}
                                </>
                            )}
                            <button
                                onClick={handleEdit}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Редактировать"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Удалить навсегда"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {/* Кликабельная область */}
            <div className="flex gap-4 cursor-pointer" onClick={handleCardClick}>
                <div onClick={handleAuthorClick} className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-400 flex items-center justify-center shadow-md ring-2 ring-white hover:ring-purple-400 transition-all cursor-pointer">
                        <span className="text-2xl">{avatar || '👤'}</span>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                        {isPinned && (
                            <Pin className="h-4 w-4 text-pink-500 flex-shrink-0 mt-1" fill="currentColor" />
                        )}
                        <h3 className={`flex-1 text-lg font-medium ${isHidden ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {title}
                            {isHidden && <span className="ml-2 text-xs text-gray-400">(скрыто)</span>}
                        </h3>
                    </div>
                    
                    {/* Только один тег: Секция / Категория (Вопросы/Обсуждения) */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCombinedTagColor(section)} text-white shadow-sm`}>
                            {section === 'C++' && '🔷'}
                            {section === 'C#' && '🟣'}
                            {section === 'Web' && '🌐'}
                            <span>{section}</span>
                            <span className="mx-0.5">/</span>
                            <span>{getCategoryType()}</span>
                        </span>
                        
                        {isSolved && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-200 to-emerald-200 text-green-700 shadow-sm">
                                <Star className="h-3 w-3" />
                                Решено
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span 
                            onClick={handleAuthorClick}
                            className="flex items-center gap-1 hover:text-purple-600 cursor-pointer transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            <span className="font-medium">{author}</span>
                        </span>
                        <span>•</span>
                        <span>{timestamp}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={handleCommentsClick}
                        className="flex items-center gap-1.5 bg-purple-100/80 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors"
                        title="Перейти к комментариям"
                    >
                        <MessageSquare className="h-4 w-4 text-purple-400" />
                        <span>{replies || 0}</span>
                    </button>
                    <div className="flex items-center gap-1.5 bg-pink-100/80 px-3 py-1.5 rounded-full">
                        <Eye className="h-4 w-4 text-pink-400" />
                        <span>{views || 0}</span>
                    </div>
                   {!isAuthor && (  // ← не показывать кнопку лайка для своих постов
    <button 
        onClick={handleLikeToggle}
        disabled={isLoading || !currentUserId}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            isLiked 
                ? 'bg-red-100/80 text-red-500' 
                : 'bg-gray-100/80 hover:bg-gray-200 text-gray-600'
        } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={currentUserId ? "Оценить тему" : "Авторизуйтесь для оценки"}
    >
        <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
        <span>{likeCount}</span>
        {isLoading && <span className="ml-1 text-xs">...</span>}
    </button>
)}
                </div>
            </div>
        </div>
    );
}