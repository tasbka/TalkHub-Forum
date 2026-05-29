// src/services/sectionService.js
import simpleClient from '../api/simpleClient';

const sectionService = {
    getAllSections: async () => {
        try {
            console.log('=== GET ALL SECTIONS ===');
            const response = await simpleClient.get('/sections');
            console.log('Raw response:', response);
            
            if (!response) {
                console.error('Пустой ответ от сервера');
                return [];
            }
            
            if (response.success && Array.isArray(response.data)) {
                console.log('Найдены разделы в success.data:', response.data.length);
                response.data.forEach(section => {
                    console.log(`Section: ${section.name}, TotalTopics: ${section.totalTopics}`);
                    if (section.categories) {
                        section.categories.forEach(cat => {
                            console.log(`  Category: ${cat.name}, PostCount: ${cat.postCount}, CommentCount: ${cat.commentCount}`);
                        });
                    }
                });
                return response.data;
            }
            
            // Если response.data сам массив
            if (Array.isArray(response.data)) {
                console.log('Найдены разделы в data (массив):', response.data.length);
                return response.data;
            }
            
            // Если response сам массив
            if (Array.isArray(response)) {
                console.log('Найдены разделы в response (массив):', response.length);
                return response;
            }
            
            console.error('Неизвестный формат ответа:', response);
            return [];
            
        } catch (error) {
            console.error('Ошибка загрузки разделов:', error);
            return [];
        }
    },
    
    getSectionById: async (id) => {
        try {
            const response = await simpleClient.get(`/sections/${id}`);
            return response?.data || response;
        } catch (error) {
            console.error('Ошибка загрузки раздела:', error);
            return null;
        }
    }
};

export default sectionService;