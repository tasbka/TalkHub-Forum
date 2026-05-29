// src/components/EditTopicPage.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Code, HelpCircle, MessageSquare } from 'lucide-react';
import { Layout } from './Layout';
import sectionService from '../services/sectionService';

const sectionColors = {
    'C++': 'from-blue-300 to-cyan-400',
    'C#': 'from-purple-300 to-violet-400',
    'Web': 'from-pink-300 to-rose-400'
};

const typeColors = {
    'Вопросы': 'from-orange-300 to-amber-400',
    'Обсуждения': 'from-green-300 to-emerald-400'
};

export function EditTopicPage({ 
    onBack, 
    onSubmit, 
    currentUser, 
    topicId, 
    initialData,
    onLogout,
    onProfileClick,
    onContactsClick,
    onInstructionClick,
    onSearch,
    onShowAuth,
    onAdminPanelClick
}) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        sectionId: initialData?.sectionId || '',
        categoryType: initialData?.categoryType || ''
    });

    const types = [
        { name: 'Вопросы', icon: HelpCircle },
        { name: 'Обсуждения', icon: MessageSquare }
    ];

    // Обработчики для навигации через хедер
    const handleProfileClickNav = () => {
        if (onProfileClick) {
            onProfileClick();
        } else {
            window.location.href = '/profile';
        }
    };

    const handleContactsClickNav = () => {
        if (onContactsClick) {
            onContactsClick();
        } else {
            window.location.href = '/contacts';
        }
    };

    const handleInstructionClickNav = () => {
        if (onInstructionClick) {
            onInstructionClick();
        } else {
            window.location.href = '/instruction';
        }
    };

    useEffect(() => {
        const loadSections = async () => {
            try {
                setLoading(true);
                const data = await sectionService.getAllSections();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        
        if (!formData.title.trim()) {
            setError('Введите заголовок темы');
            setSaving(false);
            return;
        }
        
        if (!formData.content.trim()) {
            setError('Введите содержание темы');
            setSaving(false);
            return;
        }
        
        try {
            await onSubmit(topicId, {
                title: formData.title.trim(),
                content: formData.content.trim()
            });
        } catch (error) {
            setError(error.message || 'Ошибка при сохранении');
            setSaving(false);
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

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.location.href = '/';
        }
    };

    if (loading) {
        return (
            <Layout 
                currentUser={currentUser}
                onLogout={onLogout}
                onProfileClick={handleProfileClickNav}
                onContactsClick={handleContactsClickNav}
                onInstructionClick={handleInstructionClickNav}
                onSearch={onSearch}
                onShowAuth={onShowAuth}
                onAdminPanelClick={onAdminPanelClick}
            >
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Загрузка...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const selectedSection = sections.find(s => s.id === formData.sectionId);
    const selectedType = types.find(t => t.name === formData.categoryType);

    return (
        <Layout 
            currentUser={currentUser}
            onLogout={onLogout}
            onProfileClick={handleProfileClickNav}
            onContactsClick={handleContactsClickNav}
            onInstructionClick={handleInstructionClickNav}
            onSearch={onSearch}
            onShowAuth={onShowAuth}
            onAdminPanelClick={onAdminPanelClick}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 mb-4 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Вернуться</span>
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Редактировать тему
                    </h1>
                    <p className="text-gray-600">
                        Внесите изменения в вашу тему
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Заголовок темы
                        </label>
                        <input
                            name="title"
    type="text"
    maxLength={60}
    placeholder="Введите заголовок вашей темы..."
    value={formData.title}
    onChange={handleChange}
    className="w-full h-12 px-4 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl"
/>
<p className="text-xs text-gray-500 mt-1">
    {formData.title.length}/60 символов
</p>
                    </div>

                  {/* Раздел - только для информации */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
    <label className="block text-gray-700 mb-2 font-medium">
        Раздел (не редактируется)
    </label>
    <div className="p-3 bg-purple-50 rounded-xl text-gray-600">
        {(() => {
            const sectionId = initialData?.sectionId || formData.sectionId;
            if (sectionId === '11111111-1111-1111-1111-111111111111') return 'C++';
            if (sectionId === '22222222-2222-2222-2222-222222222222') return 'C#';
            if (sectionId === '33333333-3333-3333-3333-333333333333') return 'Web';
            return initialData?.sectionName || initialData?.section || 'Не выбран';
        })()}
    </div>
</div>

                {/* Тип публикации - только для информации */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                    <label className="block text-gray-700 mb-2 font-medium">
                        Тип публикации (не редактируется)
                    </label>
                    <div className="p-3 bg-purple-50 rounded-xl text-gray-600">
                        {initialData?.categoryTypeName || initialData?.categoryType || 
                         (formData.categoryType === 'Вопросы' ? 'Вопросы' : 
                          formData.categoryType === 'Обсуждения' ? 'Обсуждения' : 'Не выбран')}
                    </div>
                </div>

                    {/* Content */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Контент
                        </label>
                        <textarea
                            name="content"
                            placeholder="Опишите вашу тему подробно..."
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full min-h-[300px] px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl resize-y"
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 rounded-xl transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50"
                        >
                            <Send className="h-5 w-5 mr-2" strokeWidth={2.5} />
                            {saving ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}