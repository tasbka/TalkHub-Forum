import { useState } from 'react';
import { ArrowLeft, Send, Code, MessageSquare, HelpCircle, Lightbulb } from 'lucide-react';

export function CreateTopicPage({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const categories = [
    { name: 'API Docs', icon: Code, color: 'from-purple-300 to-purple-400' },
    { name: 'Обсуждения', icon: MessageSquare, color: 'from-pink-300 to-pink-400' },
    { name: 'Вопросы', icon: HelpCircle, color: 'from-purple-300 to-pink-300' },
    { name: 'Идеи', icon: Lightbulb, color: 'from-pink-300 to-purple-400' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content && formData.category) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
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
            Создать новую тему
          </h1>
          <p className="text-gray-600">
            Поделитесь своим вопросом или идеей с сообществом TalkHub
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Заголовок темы
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Введите заголовок вашей темы..."
              value={formData.title}
              onChange={handleChange}
              className="w-full h-12 px-4 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Выберите понятный и конкретный заголовок
            </p>
          </div>

          {/* Category Selection */}
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <label className="block text-gray-700 mb-4">
              Выберите категорию
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = formData.category === category.name;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, category: category.name })
                    }
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 border-purple-400 shadow-md scale-[1.02]'
                        : 'bg-white/50 border-purple-200 hover:border-purple-300 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}
                    >
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className={isSelected ? 'text-purple-700' : 'text-gray-700'}>
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {!formData.category && (
              <p className="text-xs text-gray-500 mt-3">
                Пожалуйста, выберите категорию для вашей темы
              </p>
            )}
          </div>

          {/* Content */}
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <label htmlFor="content" className="block text-gray-700 mb-2">
              Контент
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Опишите вашу тему подробно..."
              value={formData.content}
              onChange={handleChange}
              className="w-full min-h-[300px] px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl resize-y"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Добавьте все необходимые детали, чтобы другие могли лучше понять вашу тему
            </p>
          </div>

          {/* Preview Card */}
          {formData.title && formData.category && (
            <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
              <h3 className="text-purple-700 font-semibold mb-4">Предпросмотр</h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="flex-1 font-medium">{formData.title}</h4>
                </div>
                <div className="mb-3">
                  <span className="inline-block bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-300 shadow-sm">
                    {formData.category}
                  </span>
                </div>
                {formData.content && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formData.content}
                  </p>
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
              disabled={!formData.title || !formData.content || !formData.category}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5 mr-2" strokeWidth={2.5} />
              Опубликовать тему
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}