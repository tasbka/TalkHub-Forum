// src/components/InstructionPage.jsx
import { ArrowLeft, MessageSquare, Search, Plus, User, HelpCircle } from 'lucide-react';
import { Layout } from './Layout';

export function InstructionPage({ 
    onBack, 
    currentUser, 
    onLogout, 
    onProfileClick, 
    onContactsClick, 
    onInstructionClick, 
    onSearch,
    onShowAuth,
    onAdminPanelClick
}) {
  // Обработчики для навигации
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
        {/* Back button */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Вернуться</span>
        </button>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Инструкция по использованию форума
        </h1>
        <p className="text-gray-600 mb-8">
          Руководство для работы с TalkHub - вашим сообществом разработчиков
        </p>

        {/* Instructions */}
        <div className="space-y-6">
          {/* Section 1: Навигация */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-purple-800 font-semibold text-lg mb-2">Навигация по форуму</h2>
                <p className="text-gray-600">
                  Форум TalkHub организован по разделам языков программирования
                </p>
              </div>
            </div>
            <div className="space-y-3 pl-16">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-blue-700 mb-2 font-semibold">C++</h3>
                <p className="text-sm text-gray-600">
                  Обсуждение и вопросы по языку C++ и связанным технологиям
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                <h3 className="text-purple-700 mb-2 font-semibold">C#</h3>
                <p className="text-sm text-gray-600">
                  Обсуждение и вопросы по языку C# и платформе .NET
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                <h3 className="text-pink-700 mb-2 font-semibold">Web</h3>
                <p className="text-sm text-gray-600">
                  Обсуждение и вопросы по веб-разработке (HTML, CSS, JavaScript, React и др.)
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Создание постов */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-purple-800 font-semibold text-lg mb-2">Публикация постов</h2>
                <p className="text-gray-600">
                  Как создать и опубликовать новую тему на форуме
                </p>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Нажмите кнопку <span className="font-semibold text-purple-700">"Создать тему"</span> на главной странице форума
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Введите понятный и информативный заголовок вашей темы
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Выберите раздел (C++, C# или Web) и тип поста (Вопрос или Обсуждение)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    Опишите вашу проблему или тему подробно в поле контента
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    5
                  </div>
                  <p className="text-sm text-gray-700">
                    Просмотрите предпросмотр и нажмите <span className="font-semibold text-purple-700">"Опубликовать тему"</span>
                  </p>
                </div>
              </div>
              <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700">
                  <span className="font-semibold">💡 Совет:</span> Используйте четкие заголовки и подробные описания для получения более качественных ответов
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Комментарии */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-purple-800 font-semibold text-lg mb-2">Комментирование</h2>
                <p className="text-gray-600">
                  Как отвечать на посты и участвовать в обсуждениях
                </p>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Нажмите на интересующую вас тему для просмотра деталей
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Прокрутите страницу вниз до формы комментирования
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Напишите ваш комментарий или ответ в текстовом поле
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    Нажмите <span className="font-semibold text-purple-700">"Отправить комментарий"</span>
                  </p>
                </div>
              </div>
              <div className="bg-pink-50/50 rounded-xl p-4 border border-pink-200">
                <p className="text-sm text-pink-700">
                  <span className="font-semibold">💡 Совет:</span> Будьте вежливы и конструктивны в комментариях
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Поиск */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Search className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-purple-800 font-semibold text-lg mb-2">Поиск по форуму</h2>
                <p className="text-gray-600">
                  Как найти нужную информацию на форуме
                </p>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Используйте поисковую строку в верхней части страницы или на главной странице
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Введите ключевые слова, связанные с вашим запросом
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Результаты поиска будут отфильтрованы в реальном времени
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    Используйте фильтры по разделам в левой панели для уточнения поиска
                  </p>
                </div>
              </div>
              <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700">
                  <span className="font-semibold">💡 Совет:</span> Используйте конкретные термины для более точных результатов поиска
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Профиль */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0">
                <User className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-purple-800 font-semibold text-lg mb-2">Профиль пользователя</h2>
                <p className="text-gray-600">
                  Доступ к профилю и настройкам
                </p>
              </div>
            </div>
            <div className="pl-16 space-y-3">
              <p className="text-sm text-gray-700">
                Нажмите на иконку профиля в правом верхнем углу для доступа к:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">•</span>
                  <span>Личной информации и статистике</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">•</span>
                  <span>Вашим публикациям и комментариям</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">•</span>
                  <span>Настройкам учетной записи</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6: Помощь */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-purple-800 font-semibold text-lg mb-2">Нужна помощь?</h2>
                <p className="text-gray-600">
                  Свяжитесь с нами для получения поддержки
                </p>
              </div>
            </div>
            <div className="pl-16">
              <p className="text-sm text-gray-700 mb-3">
                Если у вас возникли вопросы или проблемы, вы можете:
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700 font-semibold mb-2">
                  📧 Связаться с администрацией
                </p>
                <p className="text-sm text-gray-600">
                  Нажмите на иконку "Контакты" в шапке форума для получения контактной информации и связи с нами
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}