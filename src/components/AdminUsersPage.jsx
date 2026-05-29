// src/components/AdminUsersPage.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Search, User, Mail, Calendar, Shield, Ban, CheckCircle } from 'lucide-react';
import { Layout } from './Layout';

export function AdminUsersPage({ 
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Администратор';

  useEffect(() => {
    if (!isAdmin) {
      onBack();
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5234/api/users/all', {
        headers: { 'X-User-Id': currentUser?.id }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm('Заблокировать пользователя?')) return;
    
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(`http://localhost:5234/api/users/${userId}/block`, {
        method: 'POST',
        headers: { 'X-User-Id': currentUser?.id }
      });
      const data = await response.json();
      if (data.success) {
        await loadUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!window.confirm('Разблокировать пользователя?')) return;
    
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(`http://localhost:5234/api/users/${userId}/unblock`, {
        method: 'POST',
        headers: { 'X-User-Id': currentUser?.id }
      });
      const data = await response.json();
      if (data.success) {
        await loadUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Moderator': return 'bg-purple-100 text-purple-800';
      case 'Developer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Обработчики для навигации через window.location
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

  if (!isAdmin) return null;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center mb-6 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Вернуться
        </button>

        <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Управление пользователями
              </h1>
              <p className="text-gray-500 text-sm">Всего пользователей: {users.length}</p>
            </div>
            
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">Загрузка...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-200">
                    <th className="text-left py-3 px-4">Пользователь</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Роль</th>
                    <th className="text-left py-3 px-4">Активность</th>
                    <th className="text-left py-3 px-4">Регистрация</th>
                    <th className="text-left py-3 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-purple-100 hover:bg-purple-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">{user.username}</span>
                          {!user.isActive && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Заблокирован</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        Постов: {user.postCount}<br/>
                        Комментариев: {user.commentCount}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {!user.isActive ? (
                          <button
                            onClick={() => handleUnblockUser(user.id)}
                            disabled={actionLoading[user.id]}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Разблокировать
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUser(user.id)}
                            disabled={actionLoading[user.id] || user.role === 'Admin'}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50"
                            title={user.role === 'Admin' ? 'Нельзя заблокировать администратора' : ''}
                          >
                            <Ban className="h-4 w-4" />
                            Заблокировать
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}