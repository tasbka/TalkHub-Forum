// src/components/UserProfileViewPage.jsx
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Mail, Calendar, MessageCircle, Award, Trophy, 
  Star, TrendingUp, ThumbsUp, Eye, Crown, Zap, BookOpen, Heart, Clock, Sparkles 
} from 'lucide-react';
import { Button } from './ui/button';
import { Layout } from './Layout';
import noteService from '../services/noteService';
import authService from '../services/authService';

export function UserProfileViewPage({ 
  userId, 
  onBack, 
  currentUser, 
  onSendMessage,
  onLogout,
  onProfileClick,
  onContactsClick,
  onInstructionClick,
  onSearch,
  onShowAuth,
  onAdminPanelClick
}) {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocking, setBlocking] = useState(false);
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Администратор';

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

  // Обработчик кнопки "Назад"
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const isTopicHidden = (note) => {
    return note.status === 'Hidden' || note.status === 2 || note.status === '2' || note.isHidden === true;
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5234/api/users/${userId}`, {
        headers: { 'X-User-Id': authService.getCurrentUserId() || '' }
      });
      const result = await response.json();
      
      if (result.success) {
        setUser(result.data);
        
        const allNotes = await noteService.getAllNotes();
        const userNotes = allNotes.filter(note => 
          note.authorId === userId && !isTopicHidden(note)
        );
        setUserPosts(userNotes);
      } else {
        setError(result.message || 'Пользователь не найден');
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      setError('Не удалось загрузить профиль пользователя');
    } finally {
      setLoading(false);
    }
  };

  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalReplies = userPosts.reduce((sum, post) => sum + (post.replies || 0), 0);
  const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  
  const experience = totalPosts * 10 + totalLikes * 2;
  const level = Math.floor(experience / 100) + 1;
  const progressToNextLevel = experience % 100;
  const expNeeded = 100 - progressToNextLevel;

  const getRoleColor = (role) => {
    const roleColors = {
      'Novice': 'from-emerald-400 to-teal-500',
      'Explorer': 'from-cyan-400 to-blue-500',
      'Enthusiast': 'from-blue-400 to-indigo-500',
      'Expert': 'from-indigo-400 to-purple-500',
      'Master': 'from-purple-400 to-fuchsia-500',
      'GrandMaster': 'from-fuchsia-400 to-pink-500',
      'Guru': 'from-pink-400 to-rose-500',
      'Sage': 'from-amber-400 to-orange-500',
      'Legend': 'from-orange-400 to-red-500',
      'Mythic': 'from-red-400 to-rose-600',
      'Developer': 'from-slate-500 to-gray-700',
      'Moderator': 'from-violet-500 to-purple-700',
      'Admin': 'from-rose-500 to-red-700'
    };
    return roleColors[role] || 'from-purple-400 to-pink-500';
  };

  const getRoleIcon = (role) => {
    const icons = {
      'Admin': '👑',
      'Moderator': '⚔️',
      'Developer': '💻',
      'Mythic': '🌌',
      'Legend': '🌟',
      'Sage': '📖',
      'Guru': '🧘',
      'GrandMaster': '⚡',
      'Master': '🏅',
      'Expert': '🎯',
      'Enthusiast': '💫',
      'Explorer': '🗺️',
      'Novice': '🌱'
    };
    return icons[role] || '👤';
  };

  const getRoleDisplayName = (role) => {
    const roleMapping = {
      'Novice': 'Новичок',
      'Explorer': 'Исследователь',
      'Enthusiast': 'Энтузиаст',
      'Expert': 'Эксперт',
      'Master': 'Мастер',
      'GrandMaster': 'Гроссмейстер',
      'Guru': 'Гуру',
      'Sage': 'Мудрец',
      'Legend': 'Легенда',
      'Mythic': 'Мифический',
      'Developer': 'Разработчик',
      'Moderator': 'Модератор',
      'Admin': 'Администратор'
    };
    return roleMapping[role] || role;
  };

  const getSectionColor = (sec) => {
    switch(sec) {
      case 'C++': return 'from-blue-500 to-cyan-500';
      case 'C#': return 'from-purple-500 to-violet-500';
      case 'Web': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const handleBlockUser = async () => {
    if (!window.confirm(`Вы уверены, что хотите заблокировать пользователя ${user?.username}?`)) return;
    
    setBlocking(true);
    try {
      const response = await fetch(`http://localhost:5234/api/users/${userId}/block`, {
        method: 'POST',
        headers: { 'X-User-Id': currentUser?.id }
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Пользователь заблокирован');
        await loadUserData();
      } else {
        alert(data.message || 'Ошибка блокировки');
      }
    } catch (error) {
      console.error('Ошибка блокировки:', error);
      alert('Не удалось заблокировать пользователя');
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!window.confirm(`Вы уверены, что хотите разблокировать пользователя ${user?.username}?`)) return;
    
    setBlocking(true);
    try {
      const response = await fetch(`http://localhost:5234/api/users/${userId}/unblock`, {
        method: 'POST',
        headers: { 'X-User-Id': currentUser?.id }
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Пользователь разблокирован');
        await loadUserData();
      } else {
        alert(data.message || 'Ошибка разблокировки');
      }
    } catch (error) {
      console.error('Ошибка разблокировки:', error);
      alert('Не удалось разблокировать пользователя');
    } finally {
      setBlocking(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Недавно';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} ч назад`;
    if (diffMins < 10080) return `${Math.floor(diffMins / 1440)} дн назад`;
    return date.toLocaleDateString();
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
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500">Загрузка профиля...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !user) {
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
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-gray-500">{error || 'Пользователь не найден'}</p>
            <Button onClick={handleBack} className="mt-4 bg-purple-500 text-white">Вернуться</Button>
          </div>
        </div>
      </Layout>
    );
  }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <button onClick={handleBack} className="group flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Вернуться</span>
          </button>

          {/* Profile Header Card */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-purple-100 overflow-hidden shadow-xl">
              <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]"></div>
              </div>
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-purple-100">
                    <User className="h-16 w-16 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 pt-16 sm:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                          
                          {/* Плашка "Заблокирован" */}
                          {user?.isActive === false && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-sm rounded-full text-red-200 text-sm">
                              <span className="text-lg">⚠️</span>
                              Аккаунт заблокирован
                            </div>
                          )}
                        </div>

                        {/* Роль и уровень */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${getRoleColor(user.role)} text-white shadow-lg`}>
                            {getRoleIcon(user.role)}
                            {getRoleDisplayName(user.role)}
                          </span>
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 rounded-full">
                            <Sparkles className="h-3 w-3 text-yellow-600" />
                            <span className="text-xs font-medium text-yellow-700">Уровень {level}</span>
                          </div>
                        </div>

                        {/* Кнопки для админа */}
                        {isAdmin && (
                          <div className="flex gap-3 mb-3">
                            {!user.isActive ? (
                              <button onClick={handleUnblockUser} disabled={blocking} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50">
                                {blocking ? 'Загрузка...' : 'Разблокировать'}
                              </button>
                            ) : (
                              <button onClick={handleBlockUser} disabled={blocking} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50">
                                {blocking ? 'Загрузка...' : 'Заблокировать'}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Email и дата регистрации */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-purple-400" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-pink-400" />
                            <span>С {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-purple-400" />
                            <span>Активен сегодня</span>
                          </div>
                        </div>

                        {/* Кнопка "Написать сообщение" */}
                        <Button onClick={() => onSendMessage?.(user.id, user.username, user.avatar)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Написать сообщение
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Level Progress Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-purple-800 font-semibold">Прогресс</h3>
                    <p className="text-xs text-gray-400">Путь к мастерству</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">До следующего уровня</span>
                    <span className="font-semibold text-purple-600">{expNeeded} XP осталось</span>
                  </div>
                  <div className="relative h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 rounded-full" style={{ width: `${progressToNextLevel}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="pt-3 text-center">
                    <div className="text-4xl font-bold text-purple-700">{experience}</div>
                    <div className="text-xs text-gray-400 mt-1">Всего опыта</div>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-purple-800 font-semibold">Статистика</h3>
                    <p className="text-xs text-gray-400">Активность пользователя</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={<BookOpen className="h-4 w-4" />} label="Тем создано" value={totalPosts} />
                  <StatCard icon={<MessageCircle className="h-4 w-4" />} label="Комментариев" value={totalReplies} />
                  <StatCard icon={<ThumbsUp className="h-4 w-4" />} label="Лайков" value={totalLikes} />
                  <StatCard icon={<Eye className="h-4 w-4" />} label="Просмотров" value={totalViews} />
                  <StatCard icon={<Heart className="h-4 w-4" />} label="Рейтинг" value={Math.floor(totalLikes / 2)} />
                </div>
              </div>
            </div>

            {/* Main Content - Posts History */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-purple-100 shadow-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-purple-800 font-semibold">Темы пользователя</h3>
                        <p className="text-sm text-gray-400">Все темы, созданные {user.username}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      {userPosts.length} {userPosts.length === 1 ? 'пост' : userPosts.length >= 2 && userPosts.length <= 4 ? 'поста' : 'постов'}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <div key={post.id} className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer" onClick={() => window.location.href = `/topic/${post.id}`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="flex-1 text-gray-800 font-semibold group-hover:text-purple-600 transition-colors line-clamp-2">{post.title}</h4>
                          {post.isSolved && <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-sm">✓ Решено</span>}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSectionColor(post.section)} text-white shadow-sm`}>{post.section}</span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 border border-purple-200">{post.type === 'Вопросы' ? 'Вопрос' : 'Обсуждение'}</span>
                          <span className="text-xs text-gray-400">{post.timestamp || formatDate(post.created)}</span>
                        </div>

                        <div className="flex items-center gap-5 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-purple-400" /><span>{post.replies || 0}</span></div>
                          <div className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-pink-400" /><span>{post.views || 0}</span></div>
                          <div className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4 text-purple-400" /><span>{post.likes || 0}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {userPosts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4 border-2 border-purple-200">
                        <MessageCircle className="h-10 w-10 text-purple-500" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 mb-1">Нет тем</h4>
                      <p className="text-gray-400 text-sm mb-4">У пользователя пока нет созданных тем</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl p-3 text-center hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-center gap-1 mb-1">
        <div className="text-purple-500">{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-xl font-bold text-purple-700">{value}</div>
    </div>
  );
}