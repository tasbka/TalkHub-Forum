// src/services/noteService.js
import simpleClient from '../api/simpleClient';

const noteService = {
    // Получить все заметки
    getAllNotes: async () => {
        try {
            const response = await simpleClient.get('/note');
            console.log('Ответ от сервера (заметки):', response.data);

            const responseData = response?.data;
            
            if (!responseData) {
                console.error('Пустой ответ от сервера');
                return [];
            }
            
            // Если ответ не массив, возможно это объект с notes внутри
          if (responseData.success && Array.isArray(responseData.data)) {
                console.log('Найдены заметки в формате success/data:', responseData.data.length);
                
                // Преобразуем в нужный формат для фронтенда
                const formattedNotes = responseData.data.map(note => {
                    console.log('Обработка заметки:', {
                        id: note.id,
                        title: note.title,
                        replies: note.replies, // ← ЭТО CommentCount!
                        commentCount: note.commentCount, // Проверим разные варианты
                        rawNote: note
                    });
                    
                    return {
                        id: note.id,
                        title: note.title,
                        content: note.content || '',
                        category: note.category || 'Без категории',
                        author: note.author || 'Аноним',
                        authorId: note.authorId,
                        categoryId: note.categoryId,
                        // Берем replies из ответа сервера (это CommentCount)
                        replies: note.replies || note.commentCount || note.CommentCount || 0,
                        views: note.views || 0,
                        likes: note.likes || note.likeCount || 0,
                        timestamp: note.timestamp || note.created || 'Недавно',
                        isPinned: note.isPinned || false,
                        isSolved: note.isSolved || false,
                    };
                });
                
                return formattedNotes;
            }
            
            // Структура 2: Прямой массив [массив]
            if (Array.isArray(responseData)) {
                console.log('Найден прямой массив заметок:', responseData.length);
                return responseData.map(note => ({
                    id: note.id || note.Id,
                    title: note.title || note.Title,
                    content: note.content || note.Content || '',
                    category: note.category || note.CategoryName || 'Без категории',
                    author: note.author || note.AuthorName || 'Аноним',
                    authorId: note.authorId || note.AuthorId,
                    replies: note.replies || note.commentCount || note.CommentCount || 0,
                    views: note.views || note.ViewCount || 0,
                    likes: note.likes || note.likeCount || note.LikeCount || 0,
                    timestamp: note.timestamp || note.created || note.Created || 'Недавно',
                    isPinned: note.isPinned || note.IsPinned || false,
                    isSolved: note.isSolved || note.IsSolved || false,
                }));
            }
            
            // Структура 3: Объект с полем data/notes
            if (responseData.data && Array.isArray(responseData.data)) {
                return responseData.data.map(note => ({
                   id: note.id || note.Id,
                    title: note.title || note.Title,
                    content: note.content || note.Content || '',
                    category: note.category || note.CategoryName || 'Без категории',
                    author: note.author || note.AuthorName || 'Аноним',
                    authorId: note.authorId || note.AuthorId,
                    replies: note.replies || note.commentCount || note.CommentCount || 0,
                    views: note.views || note.ViewCount || 0,
                    likes: note.likes || note.likeCount || note.LikeCount || 0,
                    timestamp: note.timestamp || note.created || note.Created || 'Недавно',
                    isPinned: note.isPinned || note.IsPinned || false,
                    isSolved: note.isSolved || note.IsSolved || false,
                }));
            }
            
            console.error('Неизвестный формат ответа:', responseData);
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
            
            // success: true, data: { id: ..., username: ... } }
            if (user.data && user.data.id) {
                userId = user.data.id;
                console.log('ID из user.data.id:', userId);
            }
            // id: username
            else if (user.id) {
                userId = user.id;
                console.log('ID из user.id:', userId);
            }
            // userid:
            else if (user.user && user.user.id) {
                userId = user.user.id;
                console.log('ID из user.user.id:', userId);
            }
            else {
                console.error('Не могу найти ID пользователя в:', user);
            }
            
            if (!userId) {
                throw new Error('ID пользователя не найден');
            }
            
            console.log('Найден User ID:', userId);
            
            const categoryMapping = {
                'API Docs': 'cb257c7d-aeb3-4233-a3ce-0fe419f956e0',
        'Обсуждения': 'fa709d13-5856-47c3-a557-3f2949fe7608',
        'Вопросы': 'f9768b23-71a9-493f-a04e-5e5f7db54fb3',
        'Идеи': 'de026b5f-230b-4ef4-b318-a2bef0bcbdc2'
            };
            
            const requestData = {
                userId: userId,
                categoryId: categoryMapping[noteData.category] || categoryMapping['Обсуждения'],
                title: noteData.title,
                content: noteData.content
            };
            
            console.log('Отправка данных на сервер:', requestData);
            
            const response = await simpleClient.post('/note', requestData);
            return response.data;
            
        } catch (error) {
            console.error('Ошибка создания заметки:', error);
            throw error.message || error;
        }
    },
    
    getNoteById: async (id) => {
        try {
            const response = await simpleClient.get(`/note/${id}`);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Ошибка загрузки заметки:', error);
            return null;
        }
    }
};
export default noteService;