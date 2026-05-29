// src/components/CreateTopicPage.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Code, HelpCircle, MessageSquare, Paperclip, X, FileText, Image, AlertCircle } from 'lucide-react';
import { Layout } from './Layout';
import sectionService from '../services/sectionService';
import attachmentService from '../services/attachmentService';


const sectionColors = {
    'C++': 'from-blue-300 to-cyan-400',
    'C#': 'from-purple-300 to-violet-400',
    'Web': 'from-pink-300 to-rose-400'
};

const typeColors = {
    'Вопросы': 'from-orange-300 to-amber-400',
    'Обсуждения': 'from-green-300 to-emerald-400'
};

export function CreateTopicPage({ 
    onBack, 
    onSubmit, 
    currentUser,
    onLogout,
    onProfileClick,
    onContactsClick,
    onInstructionClick,
    onSearch 
}) {

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        sectionId: '',
        categoryType: ''
    });
const [isSubmitting, setIsSubmitting] = useState(false);
    const types = [
        { name: 'Вопросы', icon: HelpCircle },
        { name: 'Обсуждения', icon: MessageSquare }
    ];

    useEffect(() => {
        const loadSections = async () => {
            try {
                setLoading(true);
                const data = await sectionService.getAllSections();
                console.log('Загруженные разделы:', data);
                setSections(data);
            } catch (error) {
                console.error('Ошибка загрузки разделов:', error);
                setError('Не удалось загрузить разделы');
            } finally {
                setLoading(false);
            }
        };
        loadSections();
    }, []);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        setUploading(true);
        
        for (const file of files) {
            if (file.size > 25 * 1024 * 1024) {
                setError(`Файл ${file.name} слишком большой. Максимальный размер 25 MB`);
                continue;
            }
            
            try {
                const response = await attachmentService.uploadFile(file);
                if (response.success) {
                    setUploadedFiles(prev => [...prev, response.data]);
                } else {
                    setError(`Ошибка загрузки ${file.name}: ${response.message}`);
                }
            } catch (error) {
                console.error('Upload error:', error);
                setError(`Ошибка загрузки ${file.name}`);
            }
        }
        
        setUploading(false);
        e.target.value = '';
    };
    
    const removeFile = async (fileId) => {
        try {
            await attachmentService.deleteAttachment(fileId);
            setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
            console.error('Ошибка удаления файла:', error);
            setError('Не удалось удалить файл');
        }
    };
    
    const getFileIcon = (contentType) => {
        if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
        return <FileText className="h-4 w-4" />;
    };

    const handleSubmit = async (e) => {
   e.preventDefault();
    
  
    if (isSubmitting) return;
    
    setError('');
    
    // Проверка на блокировку
    if (currentUser?.isActive === false) {
        setError('Ваш аккаунт заблокирован. Вы не можете создавать темы.');
        return;
    }
    
    if (!formData.title.trim()) {
        setError('Введите заголовок темы');
        return;
    }
    
    if (!formData.content.trim()) {
        setError('Введите содержание темы');
        return;
    }
    
    if (!formData.sectionId) {
        setError('Выберите раздел');
        return;
    }
    
    if (!formData.categoryType) {
        setError('Выберите тип публикации');
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        const topicData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            sectionId: formData.sectionId,
            categoryType: formData.categoryType,
            userId: currentUser?.id,
            attachmentIds: uploadedFiles.map(f => f.id) 
        };
        
        console.log('Отправка темы:', topicData);
        await onSubmit(topicData);
    } catch (error) {
        console.error('Ошибка:', error);
        setError(error.message || 'Ошибка при создании темы');
        setIsSubmitting(false);
    }
};

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const getSectionIcon = (name) => {
        switch(name) {
            case 'C++':
            case 'C#':
            case 'Web':
                return Code;
            default:
                return Code;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка разделов...</p>
                </div>
            </div>
        );
    }

    const selectedSection = sections.find(s => s.id === formData.sectionId);
    const selectedType = types.find(t => t.name === formData.categoryType);

    return (
        <Layout 
            currentUser={currentUser}
            onLogout={onLogout}
            onProfileClick={onProfileClick}
            onContactsClick={onContactsClick}
            onInstructionClick={onInstructionClick}
            onSearch={onSearch}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center mb-4 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Вернуться к форуму
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        Создать новый пост
                    </h1>
                    <p className="text-gray-600">
                        Поделитесь своим вопросом или идеей с сообществом TalkHub
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {/* Uploading indicator */}
                {uploading && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        Загрузка файлов...
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label htmlFor="title" className="block text-gray-700 mb-2 font-medium">
                            Заголовок темы
                        </label>
                        <input
                            id="title"
  name="title"
  type="text"
  placeholder="Введите заголовок вашей темы..."
  value={formData.title}
  onChange={handleChange}
  maxLength={60}
  className="w-full h-12 px-4 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl"
/>
                     <p className="text-xs text-gray-500 mt-2">
  {formData.title.length}/60 символов
</p>
                    </div>

                    {/* Section Selection */}
                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label className="block text-gray-700 mb-4 font-medium">
                            Выберите раздел (язык программирования)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {sections.map((section) => {
                                const Icon = getSectionIcon(section.name);
                                const isSelected = formData.sectionId === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, sectionId: section.id })}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 border-purple-400 shadow-md scale-[1.02]'
                                                : 'bg-white/50 border-purple-200 hover:border-purple-300 hover:shadow-md hover:scale-[1.01]'
                                        }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sectionColors[section.name] || 'from-gray-300 to-gray-400'} flex items-center justify-center shadow-md`}
                                        >
                                            <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className={isSelected ? 'text-purple-700 font-semibold' : 'text-gray-700'}>
                                            {section.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {!formData.sectionId && (
                            <p className="text-xs text-gray-500 mt-3">
                                Пожалуйста, выберите раздел для вашей темы
                            </p>
                        )}
                    </div>

                    {/* Type Selection */}
                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label className="block text-gray-700 mb-4 font-medium">
                            Тип публикации
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {types.map((type) => {
                                const Icon = type.icon;
                                const isSelected = formData.categoryType === type.name;
                                return (
                                    <button
                                        key={type.name}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, categoryType: type.name })}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 border-purple-400 shadow-md scale-[1.02]'
                                                : 'bg-white/50 border-purple-200 hover:border-purple-300 hover:shadow-md hover:scale-[1.01]'
                                        }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeColors[type.name]} flex items-center justify-center shadow-md`}
                                        >
                                            <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className={isSelected ? 'text-purple-700 font-semibold' : 'text-gray-700'}>
                                            {type.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label htmlFor="content" className="block text-gray-700 mb-2 font-medium">
                            Контент
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Опишите вашу тему подробно..."
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full min-h-[300px] px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl resize-y"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Добавьте все необходимые детали, чтобы другие могли лучше понять вашу тему
                        </p>
                    </div>

                    {/* File Upload */}
                    <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Вложения
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept="image/*,text/plain,.txt,.md,.pdf"
                                />
                                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                                    <Paperclip className="h-4 w-4" />
                                    <span>Выбрать файлы</span>
                                </div>
                            </label>
                            <span className="text-xs text-gray-500">
                                Максимальный размер: 25 MB. Поддерживаются: изображения, .txt, .pdf
                            </span>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">Загруженные файлы:</p>
                                {uploadedFiles.map(file => (
                                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {getFileIcon(file.contentType)}
                                            <span className="text-sm text-gray-700">{file.fileName}</span>
                                            <span className="text-xs text-gray-400">({file.fileSizeFormatted})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Preview Card */}
                    {formData.title && formData.sectionId && formData.categoryType && (
                        <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                            <h3 className="text-purple-700 font-semibold mb-4">Предпросмотр</h3>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                                <div className="flex items-start gap-2 mb-2">
                                    <h4 className="flex-1 text-gray-800 font-medium">{formData.title}</h4>
                                </div>
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-700 shadow-sm">
                                        <Code className="h-3 w-3" />
                                        {selectedSection?.name}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                                        formData.categoryType === 'Вопросы' 
                                            ? 'bg-gradient-to-r from-orange-200 to-amber-200 text-orange-700'
                                            : 'bg-gradient-to-r from-green-200 to-emerald-200 text-green-700'
                                    }`}>
                                        {formData.categoryType === 'Вопросы' 
                                            ? <HelpCircle className="h-3 w-3" />
                                            : <MessageSquare className="h-3 w-3" />
                                        }
                                        {formData.categoryType}
                                    </span>
                                </div>
                                {formData.content && (
                                    <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
                                        {formData.content}
                                    </p>
                                )}
                                {uploadedFiles.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-purple-200">
                                        <p className="text-xs text-gray-500">
                                            📎 {uploadedFiles.length} файл(ов) будет прикреплено
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 rounded-xl transition-colors"
                        >
                            Отмена
                        </button>
                       <button
    type="submit"
    disabled={!formData.title || !formData.content || !formData.sectionId || !formData.categoryType || uploading || isSubmitting}
    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
>
    <Send className="h-5 w-5 mr-2" strokeWidth={2.5} />
    {isSubmitting ? 'Публикация...' : 'Опубликовать тему'}
</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}