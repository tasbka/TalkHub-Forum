// src/services/noteService.js
import simpleClient from '../api/simpleClient';

const noteService = {
    // Получить все заметки
    getAllNotes: async () => {
        try {
            console.log('=== GET ALL NOTES ===');
            const response = await simpleClient.get('/note');
            console.log('Response from simpleClient:', response);
            
            if (!response) {
                console.error('Пустой ответ от сервера');
                return [];
            }
            
            if (response.success && Array.isArray(response.data)) {
                console.log('Найдены заметки в формате success/data:', response.data.length);
                
                // Логируем первую заметку для отладки
                if (response.data.length > 0) {
                    console.log('ПЕРВАЯ ЗАМЕТКА (raw):', response.data[0]);
                }
                
                const formattedNotes = response.data.map(note => {
                    // Получаем секцию из разных возможных полей
                    const sectionValue = note.section || note.sectionName || note.SectionName || '';
                    const categoryValue = note.category || note.categoryName || note.CategoryName || 'Без категории';
                    
                    return {
                        id: note.id,
                        title: note.title,
                        content: note.content || '',
                        category: categoryValue,
                        section: sectionValue,
                        section: note.section || note.sectionName || '',
                        sectionId: note.sectionId, 
                        author: note.author || note.authorName || 'Аноним',
                        authorId: note.authorId,
                        categoryId: note.categoryId,
                        replies: note.commentCount || note.replies || 0,
                        views: note.viewCount || note.views || 0,
                        likes: note.likeCount || note.likes || 0,
                        timestamp: note.created || note.timestamp || 'Недавно',
                        isPinned: note.isPinned || false,
                        isSolved: note.isSolved || false,
                        status: note.status,
                        avatar: getAvatar(note.authorName || note.author)
                    };
                });
                
                return formattedNotes;
            }
            
            if (Array.isArray(response.data)) {
                console.log('Найден прямой массив заметок:', response.data.length);
                return formatNotesArray(response.data);
            }
            
            if (Array.isArray(response)) {
                console.log('Найден прямой массив:', response.length);
                return formatNotesArray(response);
            }
            
            console.error('Неизвестный формат ответа:', response);
            return [];
            
        } catch (error) {
            console.error('Ошибка загрузки заметок:', error);
            return [];
        }
    },
    
    // Создать заметку
    createNote: async (noteData) => {
        try {
            const userStr = localStorage.getItem('user');
            console.log('Пользователь из localStorage:', userStr);
            
            if (!userStr) {
                throw new Error('Вы не авторизованы');
            }
            
            const user = JSON.parse(userStr);
            console.log('Parsed user:', user);
            
            let userId;
            
            if (user.data && user.data.id) {
                userId = user.data.id;
            } else if (user.id) {
                userId = user.id;
            } else if (user.user && user.user.id) {
                userId = user.user.id;
            } else {
                console.error('Не могу найти ID пользователя в:', user);
                throw new Error('ID пользователя не найден');
            }
            
            console.log('Найден User ID:', userId);
            
            // Проверяем обязательные поля
            if (!noteData.sectionId) {
                throw new Error('Не выбран раздел');
            }
            if (!noteData.categoryType) {
                throw new Error('Не выбран тип публикации');
            }
            if (!noteData.title) {
                throw new Error('Не введен заголовок');
            }
            if (!noteData.content) {
                throw new Error('Не введено содержание');
            }
            
            const requestData = {
                userId: userId,
                sectionId: noteData.sectionId,
                categoryType: noteData.categoryType,
                title: noteData.title,
                content: noteData.content,
                attachmentIds: noteData.attachmentIds || []
            };
            
            console.log('Отправка данных на сервер:', requestData);
            
            const response = await simpleClient.post('/note', requestData);
            console.log('Ответ сервера:', response);
            
            return response;
            
        } catch (error) {
            console.error('Ошибка создания заметки:', error);
            throw error;
        }
    },
    
    // Получить заметку по ID
    getNoteById: async (id) => {
        try {
            const response = await simpleClient.get(`/note/${id}`);
            return response?.data || response;
        } catch (error) {
            console.error('Ошибка загрузки заметки:', error);
            return null;
        }
    },
    
    // Скрыть тему (только для админа)
    hideNote: async (noteId) => {
        try {
            console.log('hideNote called with id:', noteId);
            const response = await simpleClient.patch(`/note/${noteId}/hide`);
            console.log('hideNote response:', response);
            return response;
        } catch (error) {
            console.error('Ошибка скрытия темы:', error);
            throw error;
        }
    },

    // Восстановить тему (только для админа)
    restoreNote: async (noteId) => {
        try {
            console.log('restoreNote called with id:', noteId);
            const response = await simpleClient.patch(`/note/${noteId}/restore`);
            console.log('restoreNote response:', response);
            return response;
        } catch (error) {
            console.error('Ошибка восстановления темы:', error);
            throw error;
        }
    },

    // Поиск
    searchNotes: async (searchTerm) => {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return [];
            }
            
            const response = await simpleClient.get(`/note/search?q=${encodeURIComponent(searchTerm)}`);
            console.log('Search results:', response);
            
            if (response.success && Array.isArray(response.data)) {
                return response.data.map(note => ({
                    id: note.id,
                    title: note.title,
                    content: note.content || '',
                    category: note.category || note.categoryName || 'Без категории',
                     section: note.section || note.sectionName || '',
    sectionId: note.sectionId,
                    author: note.author || note.authorName || 'Аноним',
                    authorId: note.authorId,
                    categoryId: note.categoryId,
                    replies: note.replies || note.commentCount || 0,
                    views: note.views || note.viewCount || 0,
                    likes: note.likes || note.likeCount || 0,
                    timestamp: note.timestamp || note.created || 'Недавно',
                    isPinned: note.isPinned || false,
                    isSolved: note.isSolved || false,
                    avatar: getAvatar(note.author || note.authorName)
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Ошибка поиска:', error);
            return [];
        }
    },
    
    // Удалить заметку
    deleteNote: async (noteId) => {
        try {
            console.log('deleteNote called with id:', noteId);
            const response = await simpleClient.delete(`/note/${noteId}`);
            console.log('deleteNote response:', response);
            
            if (response && response.success === undefined) {
                return { success: true, data: response };
            }
            return response;
        } catch (error) {
            console.error('deleteNote error:', error);
            throw error;
        }
    },

    // Закрепить/открепить тему
    togglePinNote: async (noteId, isPinned) => {
        try {
            const response = await simpleClient.patch(`/note/${noteId}/pin`, { isPinned });
            return response;
        } catch (error) {
            console.error('Ошибка закрепления темы:', error);
            throw error;
        }
    },
    
    // Получить статус темы
    getNoteStatus: async (noteId) => {
        try {
            const response = await simpleClient.get(`/note/${noteId}/status`);
            return response;
        } catch (error) {
            console.error('Ошибка получения статуса темы:', error);
            throw error;
        }
    },

    incrementViewCount: async (noteId) => {
    try {
        console.log('incrementViewCount called with id:', noteId);
        const response = await simpleClient.post(`/note/${noteId}/view`);
        console.log('incrementViewCount response:', response);
        return response;
    } catch (error) {
        console.error('Ошибка увеличения просмотров:', error);
        throw error;
    }
},

toggleSolved: async (noteId) => {
    try {
        console.log('toggleSolved called with id:', noteId);
        const response = await simpleClient.patch(`/note/${noteId}/solved`);
        console.log('toggleSolved response:', response);
        return response;
    } catch (error) {
        console.error('Ошибка переключения статуса решено:', error);
        throw error;
    }
},

    // Обновить тему
    updateNote: async (noteId, title, content) => {
        try {
            const response = await simpleClient.put(`/note/${noteId}`, { title, content });
            return response;
        } catch (error) {
            console.error('Ошибка обновления темы:', error);
            throw error;
        }
    }
};

// Вспомогательная функция для форматирования массива заметок
const formatNotesArray = (notes) => {
    return notes.map(note => {
        const sectionValue = note.section || note.sectionName || note.SectionName || '';
        const categoryValue = note.category || note.categoryName || note.CategoryName || 'Без категории';
        
        return {
            id: note.id || note.Id,
            title: note.title || note.Title,
            content: note.content || note.Content || '',
            section: sectionValue,
            category: categoryValue,
             section: note.section || note.sectionName || note.SectionName || '',
            sectionId: note.sectionId || note.SectionId,
            author: note.author || note.authorName || note.AuthorName || 'Аноним',
            authorId: note.authorId || note.AuthorId,
            categoryId: note.categoryId || note.CategoryId,
            replies: note.commentCount || note.replies || note.CommentCount || 0,
            views: note.viewCount || note.views || note.ViewCount || 0,
            likes: note.likeCount || note.likes || note.LikeCount || 0,
            timestamp: note.created || note.timestamp || note.Created || 'Недавно',
            isPinned: note.isPinned || note.IsPinned || false,
            isSolved: note.isSolved || note.IsSolved || false,
            status: note.status,
            avatar: getAvatar(note.authorName || note.author || note.AuthorName)
        };
    });
};

const getAvatar = (username) => {
    if (!username) return '👤';
    const avatars = ['👩‍💻', '👨‍💻', '👤', '🎓', '💻'];
    const index = username.length % avatars.length;
    return avatars[index];
};

export default noteService;