// src/components/UserProfilePage.jsx
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Mail, Calendar, MessageCircle, Award, Trophy, Star, 
  TrendingUp, LogOut, Edit, ThumbsUp, Eye, Crown, Zap, BookOpen, Sparkles, 
  Heart, Clock, Plus 
} from 'lucide-react';
import { Button } from './ui/button';
import { Layout } from './Layout';
import noteService from '../services/noteService';
import authService from '../services/authService';

const roleNumberToString = (roleNumber) => {
    const roleMap = {
        1: 'Novice',
        2: 'Explorer',
        3: 'Enthusiast',
        4: 'Expert',
        5: 'Master',
        6: 'GrandMaster',
        7: 'Guru',
        8: 'Sage',
        9: 'Legend',
        10: 'Mythic',
        20: 'Developer',
        21: 'Moderator',
        22: 'Admin'
    };
    return roleMap[roleNumber] || 'Novice';
};

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



const getRoleDisplayName = (role) => {
    const roleMapping = {
        'Novice': '🌱 Новичок',
        'Explorer': '🗺️ Исследователь',
        'Enthusiast': '💫 Энтузиаст',
        'Expert': '🎯 Эксперт',
        'Master': '🏅 Мастер',
        'GrandMaster': '⚡ Гроссмейстер',
        'Guru': '🧘 Гуру',
        'Sage': '📖 Мудрец',
        'Legend': '🌟 Легенда',
        'Mythic': '🌌 Мифический',
        'Developer': '💻 Разработчик',
        'Moderator': '⚔️ Модератор',
        'Admin': '👑 Администратор'
    };
    return roleMapping[role] || role;
};

export function UserProfilePage({ 
    onBack, 
    onLogout, 
    onProfileClick,
    onContactsClick,
    onInstructionClick,
    onSearch,
    onShowAuth,
    onAdminPanelClick 
}) {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
        try {
            setLoading(true);
            const user = authService.getCurrentUser();
            
            if (user && typeof user.role === 'number') {
                user.role = roleNumberToString(user.role);
            }
            
            setCurrentUser(user);
            
            if (user && user.id) {
                const allNotes = await noteService.getAllNotes();
                const userNotes = allNotes.filter(note => note.authorId === user.id);
                setUserPosts(userNotes);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        } finally {
            setLoading(false);
        }
    };
    
    loadUserData();
  }, []);

  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalReplies = userPosts.reduce((sum, post) => sum + (post.replies || 0), 0);
  const solvedQuestions = userPosts.filter(post => post.isSolved).length;
  const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  
  const experience = totalPosts * 10 + totalLikes * 2 + solvedQuestions * 25;
  const level = Math.floor(experience / 100) + 1;
  const progressToNextLevel = experience % 100;
  const expNeeded = 100 - progressToNextLevel;

  const achievements = [
    { id: 1, name: "Первый пост", icon: "🎯", earned: totalPosts >= 1, description: "Создал первую тему" },
   { id: 3, name: "Популярный", icon: "⭐", earned: totalLikes >= 10, description: "10+ лайков" },
    { id: 4, name: "Эксперт", icon: "👨‍🏫", earned: level >= 5, description: "5+ уровень" },
    { id: 5, name: "Мастер", icon: "🏆", earned: level >= 10, description: "10+ уровень" },
    { id: 6, name: "Активный", icon: "🔥", earned: totalPosts >= 5, description: "5+ тем создано" },
    { id: 7, name: "Звезда", icon: "✨", earned: totalLikes >= 25, description: "25+ лайков" },
  ];

  const getSectionColor = (sec) => {
    switch(sec) {
      case 'C++': return 'from-blue-500 to-cyan-500';
      case 'C#': return 'from-purple-500 to-violet-500';
      case 'Web': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    authService.logout();
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    } window.location.href = '/';
  };

  if (loading) {
    return (
      <Layout 
        currentUser={currentUser}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onContactsClick={onContactsClick}
        onInstructionClick={onInstructionClick}
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

  const displayUsername = currentUser?.username || 'Пользователь';
  const userEmail = currentUser?.email || 'email@example.com';
  const createdAt = currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Недавно';

  return (
    <Layout 
      currentUser={currentUser}
      onLogout={onLogout}
      onProfileClick={onProfileClick}
      onContactsClick={onContactsClick}
      onInstructionClick={onInstructionClick}
      onSearch={onSearch}
      onShowAuth={onShowAuth}
      onAdminPanelClick={onAdminPanelClick}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Назад</span>
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h1 className="text-3xl font-bold text-white">
                          {displayUsername}
                        </h1>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${getRoleColor(currentUser?.role)} text-white shadow-md`}>
  
  {getRoleDisplayName(currentUser?.role)}
</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleLogoutClick} 
                      variant="outline" 
                      className="gap-2 border-2 border-red-200 bg-white/80 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <span>{userEmail}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-pink-400" />
                      <span>С {createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span>Уровень {level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
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
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 rounded-full relative"
                    style={{ width: `${progressToNextLevel}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-shimmer"></div>
                  </div>
                </div>
                <div className="pt-3 text-center">
                  <div className="text-4xl font-bold text-purple-700">
                    {experience}
                  </div>
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
                  <p className="text-xs text-gray-400">Ваша активность</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<BookOpen className="h-4 w-4" />} label="Тем создано" value={totalPosts} />
                <StatCard icon={<MessageCircle className="h-4 w-4" />} label="Комментариев" value={totalReplies} />
                <StatCard icon={<ThumbsUp className="h-4 w-4" />} label="Лайков" value={totalLikes} />
                <StatCard icon={<Trophy className="h-4 w-4" />} label="Решено" value={solvedQuestions} />
                <StatCard icon={<Eye className="h-4 w-4" />} label="Просмотров" value={totalViews} />
                <StatCard icon={<Heart className="h-4 w-4" />} label="Рейтинг" value={Math.floor(totalLikes / 2)} />
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-purple-800 font-semibold">Достижения</h3>
                  <p className="text-xs text-gray-400">{achievements.filter(a => a.earned).length} из {achievements.length} получено</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`group relative aspect-square rounded-xl flex flex-col items-center justify-center text-2xl transition-all duration-300 ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer border border-purple-200'
                        : 'bg-gray-50 opacity-40 grayscale border border-gray-100'
                    }`}
                    title={achievement.description}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-[10px] mt-1.5 font-medium text-purple-700 text-center px-1">{achievement.name}</span>
                    {!achievement.earned && (
                      <div className="absolute inset-0 bg-gray-100/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-gray-500">🔒</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${(achievements.filter(a => a.earned).length / achievements.length) * 100}%` }}
                ></div>
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
                      <h3 className="text-purple-800 font-semibold">История постов</h3>
                      <p className="text-sm text-gray-400">Ваши темы и обсуждения</p>
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
                    <div
                      key={post.id}
                      className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                      onClick={() => window.location.href = `/topic/${post.id}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="flex-1 text-gray-800 font-semibold group-hover:text-purple-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        {post.isSolved && (
                          <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-sm">
                            ✓ Решено
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSectionColor(post.section)} text-white shadow-sm`}>
                          {post.section}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 border border-purple-200">
                          {post.type === 'Вопросы' ? 'Вопрос' : 'Обсуждение'}
                        </span>
                        <span className="text-xs text-gray-400">{post.timestamp || formatDate(post.created)}</span>
                      </div>

                      <div className="flex items-center gap-5 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4 text-purple-400" />
                          <span>{post.replies || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4 text-pink-400" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="h-4 w-4 text-purple-400" />
                          <span>{post.likes || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {userPosts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4 border-2 border-purple-200">
                      <MessageCircle className="h-10 w-10 text-purple-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-1">Пока нет тем</h4>
                    <p className="text-gray-400 text-sm mb-4">Вы еще не создали ни одной темы для обсуждения</p>
                    <Button 
                      onClick={() => window.location.href = '/'}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Создать первую тему
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 border border-purple-100 shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Выход из аккаунта</h3>
              <p className="text-gray-500 mb-6">
                Вы уверены, что хотите выйти? Вам потребуется снова войти, чтобы получить доступ к профилю.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleConfirmLogout}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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