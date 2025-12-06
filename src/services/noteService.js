// src/services/noteService.js
import simpleClient from '../api/simpleClient';

const noteService = {
    // Получить все заметки
    getAllNotes: async () => {
        try {
            const response = await simpleClient.get('/note');
            console.log('Ответ от сервера (заметки):', response.data);
            return response.data.data || [];
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