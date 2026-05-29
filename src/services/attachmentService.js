import simpleClient from '../api/simpleClient';

const attachmentService = {
    // Загрузить файл
    uploadFile: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('http://localhost:5234/api/attachments/upload', {
                method: 'POST',
                headers: {
                    'X-User-Id': JSON.parse(localStorage.getItem('user'))?.id
                },
                body: formData
            });
            
            const result = await response.json();
            console.log('Upload response:', result);
            return result;
        } catch (error) {
            console.error('Ошибка загрузки файла:', error);
            throw error;
        }
    },
    
    // Получить файлы поста
    getAttachmentsByNote: async (noteId) => {
        try {
            const response = await simpleClient.get(`/attachments/note/${noteId}`);
            return response.data || [];
        } catch (error) {
            console.error('Ошибка получения файлов:', error);
            return [];
        }
    },
    
    // Удалить файл
    deleteAttachment: async (attachmentId) => {
         try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`http://localhost:5234/api/attachments/${attachmentId}`, {
            method: 'DELETE',
            headers: {
                'X-User-Id': user.id
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Ошибка удаления файла:', error);
        throw error;
    }
    },
    
    // Скачать файл
   downloadFile: (attachmentId, fileName) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    window.open(`http://localhost:5234/api/attachments/${attachmentId}/download?X-User-Id=${user.id}`, '_blank');
},

downloadFileAsAttachment: (attachmentId, fileName) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    window.open(`http://localhost:5234/api/attachments/${attachmentId}/download?download=true&X-User-Id=${user.id}`, '_blank');
}
};

export default attachmentService;