// src/components/ActiveUsers.jsx - упрощенная версия
import React, { useState, useEffect } from 'react';
import statsService from '../services/statsService';
import { Crown, Award, Star, User as UserIcon } from 'lucide-react';

export function ActiveUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveUsers();
  }, []);

  const loadActiveUsers = async () => {
    try {
      setLoading(true);
      const data = await statsService.getActiveUsers(4);
      console.log('Загруженные активные пользователи:', data); // Для отладки
      setUsers(data || []); // Убедимся, что всегда массив
    } catch (error) {
      console.error('Error loading active users:', error);
      setUsers([]); // При ошибке устанавливаем пустой массив
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role, avatar) => {
    if (avatar) return <span className="text-xl">{avatar}</span>;
    
    switch(role?.toLowerCase()) {
      case 'админ': return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'мудрец': return <Award className="h-5 w-5 text-purple-600" />;
      case 'эксперт': return <Star className="h-5 w-5 text-blue-600" />;
      default: return <UserIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Активные пользователи</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-6">Активные пользователи</h3>
      
      {users && users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  {getRoleIcon(user.role, user.avatar)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.username}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.role === 'Админ' ? 'bg-yellow-100 text-yellow-800' :
                    user.role === 'Модератор' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'Эксперт' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.postCount} сообщ.
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">
                  {/*+{user.reputation}*/}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Нет активных пользователей
        </div>
      )}
    </div>
  );
}