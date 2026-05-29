import { useState, useEffect } from 'react';
import { Bell, User, Menu, MessageCircle, Mail, BookOpen, LogOut, Settings, Sparkles, X, Shield  } from "lucide-react";
import { Button } from "./ui/button";
import { NotificationsPanel } from "./NotificationsPanel";  
import simpleClient from '../api/simpleClient';
import { LogIn } from 'lucide-react';

export function ForumHeader({
  currentUser,
  onLogout,
  onProfileClick,
  onContactsClick,
  onInstructionClick,
  onSettingsClick,
  onNavigateToMessage,
  onShowAuth,
  onAdminPanelClick, 
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const response = await simpleClient.get('/notifications?limit=1');
      if (response.success) {
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Функция для перехода на главную страницу
  const goToHome = () => {
    window.location.href = '/';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin": case "Админ": return "bg-gradient-to-r from-red-400 to-orange-400";
      case "Moderator": return "bg-gradient-to-r from-indigo-400 to-blue-400";
      case "Developer": return "bg-gradient-to-r from-cyan-400 to-blue-400";
      case "Mythic": return "bg-gradient-to-r from-red-500 to-pink-500";
      case "Legend": return "bg-gradient-to-r from-yellow-400 to-orange-400";
      case "Sage": return "bg-gradient-to-r from-orange-400 to-amber-400";
      case "Guru": return "bg-gradient-to-r from-pink-400 to-rose-400";
      case "GrandMaster": return "bg-gradient-to-r from-violet-400 to-purple-400";
      case "Master": return "bg-gradient-to-r from-indigo-400 to-purple-400";
      case "Expert": return "bg-gradient-to-r from-blue-400 to-cyan-400";
      case "Enthusiast": return "bg-gradient-to-r from-green-400 to-lime-400";
      case "Explorer": return "bg-gradient-to-r from-teal-400 to-emerald-400";
      case "Novice": return "bg-gradient-to-r from-gray-400 to-gray-500";
      default: return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

const getRoleName = (role) => {
  switch (role) {
    case "Admin": return "Администратор";
    case "Moderator": return "Модератор";
    case "Developer": return "Разработчик";
    case "Mythic": return "Мифический";
    case "Legend": return "Легенда";
    case "Sage": return "Мудрец";
    case "Guru": return "Гуру";
    case "GrandMaster": return "Гроссмейстер";
    case "Master": return "Мастер";
    case "Expert": return "Эксперт";
    case "Enthusiast": return "Энтузиаст";
    case "Explorer": return "Исследователь";
    case "Novice": return "Новичок";
    default: return role || "Пользователь";
  }
};

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-200/80 via-pink-200/80 to-purple-200/80 backdrop-blur-md border-b-2 border-white/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Левая часть - Логотип (теперь кликабельный) */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={goToHome}>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-purple-700 hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <MessageCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-purple-800 text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    TalkHub
                  </h1>
                  <p className="text-purple-500 text-sm -mt-0.5 font-medium">
                    Сообщество разработчиков
                  </p>
                </div>
              </div>
            </div>

            {/* Пустое место для выравнивания */}
            <div className="flex-1"></div>

            {/* Правая часть - Иконки и пользователь */}
            <div className="flex items-center gap-3">
              {/* Инструкция */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex hover:bg-white/30 text-purple-700 hover:text-purple-900 transition-all"
                onClick={onInstructionClick}
                title="Инструкция"
              >
                <BookOpen className="h-6 w-6" />
              </Button>

              {/* Контакты */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex hover:bg-white/30 text-purple-700 hover:text-purple-900 transition-all"
                onClick={onContactsClick}
                title="Контакты"
              >
                <Mail className="h-6 w-6" />
              </Button>

              {/* Уведомления */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/30 text-purple-700"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Уведомления"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {/* Профиль пользователя */}
              {currentUser ? (
                <div className="relative group">
                  <div
                    className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-purple-200/50 hover:bg-white/70 hover:border-purple-300/50 transition-all cursor-pointer"
                    onClick={onProfileClick}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <span className="text-purple-800 font-semibold text-sm">
                        {currentUser.username}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full text-white ${getRoleBadge(currentUser.role)}`}>
                          {getRoleName(currentUser.role)}
                        </span>
                        
                      </div>
                    </div>
                  </div>

                  {/* Выпадающее меню */}
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border-2 border-purple-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <button
                        onClick={onProfileClick}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <User className="h-4 w-4 text-purple-500" />
                        Мой профиль
                      </button>

   {/* Кнопка для админа */}
        {currentUser?.role === 'Admin' && (
            <button
                onClick={onAdminPanelClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors text-left"
            >
                <Shield className="h-4 w-4 text-purple-500" />
                Управление пользователями
            </button>
        )}
                      <hr className="my-2 border-purple-200" />
               <button
    onClick={() => {
        if (onLogout) onLogout(); 
    }}
    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
>
    <LogOut className="h-4 w-4" />
    Выйти
</button>
                    </div>
                  </div>
                </div>
        ) : (
  <Button 
    onClick={onShowAuth}
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
  >
    <LogIn className="h-4 w-4 mr-2" />
    Войти
  </Button>
)}
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-b-2 border-purple-200 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={onInstructionClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Инструкция
              </button>
              <button
                onClick={onContactsClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
                Контакты
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Панель уведомлений */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        onNavigateToMessage={onNavigateToMessage} 
      />
    </>
  );
}